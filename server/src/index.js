import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import {
  searchPeople,
  searchFilms,
  getPerson,
  getFilm,
  getMany
} from "./swapiClient.js";

import { logSearch, getCurrentStats } from "./statsService.js";
import { startStatsScheduler } from "./statsQueue.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- API ROUTES ----

// Search route
app.get("/api/search", async (req, res) => {
  const { type, q } = req.query;

  if (!type || !q) {
    return res.status(400).json({ error: "Missing type or q parameter" });
  }

  if (!["people", "movies"].includes(type)) {
    return res.status(400).json({ error: "type must be 'people' or 'movies'" });
  }

  const query = String(q);
  const startedAt = Date.now();

  try {
    let data;
    if (type === "people") {
      data = await searchPeople(query);
    } else {
      data = await searchFilms(query);
    }

    const durationMs = Date.now() - startedAt;
    logSearch({ type, query, durationMs });

    if (type === "people") {
      const results = data.results.map((p) => {
        const id = p.url.match(/people\/(\d+)\//)?.[1];
        return { id, name: p.name };
      });
      return res.json({ results });
    } else {
      const results = data.results.map((f) => {
        const id = f.url.match(/films\/(\d+)\//)?.[1];
        return { id, title: f.title };
      });
      return res.json({ results });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to fetch from SWAPI" });
  }
});

// Person details
app.get("/api/people/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await getPerson(id);
    const films = await getMany(person.films);

    const mappedFilms = films.map((f) => ({
      id: f.url.match(/films\/(\d+)\//)?.[1],
      title: f.title
    }));

    res.json({
      id,
      name: person.name,
      birthYear: person.birth_year,
      gender: person.gender,
      eyeColor: person.eye_color,
      hairColor: person.hair_color,
      height: person.height,
      mass: person.mass,
      films: mappedFilms
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch person" });
  }
});

// Film details
app.get("/api/films/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const film = await getFilm(id);
    const characters = await getMany(film.characters);

    const mappedChars = characters.map((c) => ({
      id: c.url.match(/people\/(\d+)\//)?.[1],
      name: c.name
    }));

    res.json({
      id,
      title: film.title,
      openingCrawl: film.opening_crawl,
      characters: mappedChars
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch film" });
  }
});

// Stats endpoint
app.get("/api/stats", (req, res) => {
  res.json(getCurrentStats());
});

// ---- STATIC FRONTEND ----
const clientBuildPath = path.join(__dirname, "..", "client-build"); // we'll copy Vite build here in Docker
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ---- START ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  startStatsScheduler();
});