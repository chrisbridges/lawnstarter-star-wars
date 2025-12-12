// client/src/api.js

const API_BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export function search(type, query) {
  const t = (type || 'people').toLowerCase();
  const params = new URLSearchParams({ type: t, q: query });
  return fetch(`${API_BASE}/search?${params.toString()}`).then(handle);
}

export function fetchPerson(id) {
  return fetch(`${API_BASE}/people/${id}`).then(handle);
}

export function fetchFilm(id) {
  return fetch(`${API_BASE}/films/${id}`).then(handle);
}

export function fetchStats() {
  return fetch(`${API_BASE}/stats`).then(handle);
}