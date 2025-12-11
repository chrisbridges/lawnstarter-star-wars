// Simple in-memory store. For production, back this with a real DB.
const searchLogs = []; // { type, query, durationMs, timestamp: Date }

let currentStats = {
  lastComputedAt: null,
  totalSearches: 0,
  avgDurationMs: 0,
  topQueries: [],
  hourlyVolume: Array(24).fill(0)
};

export function logSearch({ type, query, durationMs }) {
  searchLogs.push({
    type,
    query: query.trim().toLowerCase(),
    durationMs,
    timestamp: new Date()
  });
}

export function recomputeStats() {
  const logs = [...searchLogs];
  const total = logs.length;
  if (!total) {
    currentStats = {
      lastComputedAt: new Date(),
      totalSearches: 0,
      avgDurationMs: 0,
      topQueries: [],
      hourlyVolume: Array(24).fill(0)
    };
    return currentStats;
  }

  // Average duration
  const totalDuration = logs.reduce((sum, l) => sum + l.durationMs, 0);
  const avgDurationMs = totalDuration / total;

  // Top queries (type + query)
  const counts = new Map();
  const hourly = Array(24).fill(0);

  for (const log of logs) {
    const key = `${log.type}:${log.query}`;
    counts.set(key, (counts.get(key) || 0) + 1);

    const h = new Date(log.timestamp).getHours();
    hourly[h]++;
  }

  const topQueries = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [type, query] = key.split(":");
      return {
        type,
        query,
        count,
        percentage: (count / total) * 100
      };
    });

  currentStats = {
    lastComputedAt: new Date(),
    totalSearches: total,
    avgDurationMs,
    topQueries,
    hourlyVolume: hourly
  };

  return currentStats;
}

export function getCurrentStats() {
  return currentStats;
}