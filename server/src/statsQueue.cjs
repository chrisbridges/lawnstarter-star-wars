import { EventEmitter } from "events";
import { recomputeStats } from "./statsService.cjs";

const events = new EventEmitter();
const queue = []; // simple FIFO queue of job names

let isProcessing = false;

function processQueue() {
  if (isProcessing) return;
  if (queue.length === 0) return;

  isProcessing = true;

  const job = queue.shift();

  if (job === "recomputeStats") {
    recomputeStats();
  }

  isProcessing = false;

  // Process next job if any
  if (queue.length > 0) {
    setImmediate(processQueue);
  }
}

// Listen for scheduled events
events.on("stats:recompute", () => {
  queue.push("recomputeStats");
  processQueue();
});

// Kick off repeating schedule every 5 minutes
export function startStatsScheduler() {
  // Run once on boot so /api/stats isn't empty
  events.emit("stats:recompute");

  setInterval(() => {
    events.emit("stats:recompute");
  }, 5 * 60 * 1000);
}

// TODO: delete?