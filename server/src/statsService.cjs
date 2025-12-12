const FIVE_MINUTES = 5 * 60 * 1000;

// Queue of raw events waiting to be processed
const pendingEvents = [];

// Aggregated state
const state = {
  totalSearches: 0,
  totalDurationMs: 0,
  countsByQuery: new Map(),   // key: `${type}:${query.toLowerCase()}`
  countsByHour: new Map(),    // key: hour (0-23)
  lastComputedAt: null
};

function recordSearch({ type, query, durationMs, timestamp }) {
  pendingEvents.push({
    type,
    query: query.trim(),
    durationMs,
    timestamp: timestamp || new Date()
  });
}

// Worker that runs every 5 minutes
function processQueue() {
  while (pendingEvents.length) {
    const evt = pendingEvents.shift();

    state.totalSearches += 1;
    state.totalDurationMs += evt.durationMs;

    const qKey = `${evt.type}:${evt.query.toLowerCase()}`;
    state.countsByQuery.set(qKey, (state.countsByQuery.get(qKey) || 0) + 1);

    const hour = new Date(evt.timestamp).getHours();
    state.countsByHour.set(hour, (state.countsByHour.get(hour) || 0) + 1);
  }

  state.lastComputedAt = new Date();
}

// Kick off the interval
setInterval(processQueue, FIVE_MINUTES);
// Also run once at boot so stats aren't empty forever
processQueue();

function getStats() {
  const avgResponseTimeMs =
    state.totalSearches === 0
      ? 0
      : Math.round(state.totalDurationMs / state.totalSearches);

  const total = state.totalSearches || 1; // avoid divide by zero

  // Top 5 queries across both types
  const topQueries = Array.from(state.countsByQuery.entries())
    .map(([key, count]) => {
      const [type, q] = key.split(':');
      return {
        type,
        query: q,
        count,
        percentage: +(count * 100 / total).toFixed(1)
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const volumeByHour = Array.from(state.countsByHour.entries())
    .sort(([a], [b]) => a - b)
    .map(([hour, count]) => ({ hour, count }));

  return {
    lastComputedAt: state.lastComputedAt,
    totalSearches: state.totalSearches,
    avgResponseTimeMs,
    topQueries,
    volumeByHour
  };
}

module.exports = {
  recordSearch,
  getStats
};