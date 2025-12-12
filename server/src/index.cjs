// server/index.cjs
const path = require('path');
const express = require('express');
const cors = require('cors');

const {
  searchPeople,
  searchFilms,
  getPerson,
  getFilm
} = require('./swapiClient.cjs');

const { recordSearch, getStats } = require('./statsService.cjs');

const app = express();

app.use(cors());
app.use(express.json());

// --- API routes ---

// Unified search endpoint
// GET /api/search?type=people|films&q=obi
app.get('/api/search', async (req, res) => {
  const type = (req.query.type || 'people').toLowerCase();
  const q = (req.query.q || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Missing q query parameter' });
  }

  if (!['people', 'films'].includes(type)) {
    return res.status(400).json({ error: 'type must be "people" or "films"' });
  }

  const started = Date.now();

  try {
    let results;
    if (type === 'people') {
      results = await searchPeople(q);
    } else {
      results = await searchFilms(q);
    }

    const durationMs = Date.now() - started;
    recordSearch({
      type,
      query: q,
      durationMs,
      timestamp: new Date()
    });

    return res.json({ type, query: q, results });
  } catch (err) {
    console.error('Search error', err.message);
    return res.status(502).json({ error: 'Upstream SWAPI error' });
  }
});

// GET /api/people/:id
app.get('/api/people/:id', async (req, res) => {
  try {
    const person = await getPerson(req.params.id);
    res.json(person);
  } catch (err) {
    console.error('Person error', err.message);
    res.status(502).json({ error: 'Failed to fetch person' });
  }
});

// GET /api/films/:id
app.get('/api/films/:id', async (req, res) => {
  try {
    const film = await getFilm(req.params.id);
    res.json(film);
  } catch (err) {
    console.error('Film error', err.message);
    res.status(502).json({ error: 'Failed to fetch film' });
  }
});

// Stats endpoint, recomputed by the background worker every 5 minutes
// GET /api/stats
app.get('/api/stats', (req, res) => {
  res.json(getStats());
});

// --- Static frontend (React build) ---
// By default the server does not serve the frontend build. If you want
// the server container to also serve the static client, set
// `SERVE_FRONTEND=true` in the environment. When enabled, the server
// will serve files from ../client/build.
if (process.env.SERVE_FRONTEND === 'true') {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    // Avoid trying to send index.html for unknown API routes
    if (req.path && req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }

    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});