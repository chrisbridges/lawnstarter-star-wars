import axios from "axios";

const SWAPI_BASE = "https://swapi.tech/api";

export async function searchPeople(query) {
  const res = await axios.get(`${SWAPI_BASE}/people/`, { params: { search: query } });
  return res.data;
}

export async function searchFilms(query) {
  const res = await axios.get(`${SWAPI_BASE}/films/`, { params: { search: query } });
  return res.data;
}

export async function getPerson(id) {
  const res = await axios.get(`${SWAPI_BASE}/people/${id}/`);
  return res.data;
}

export async function getFilm(id) {
  const res = await axios.get(`${SWAPI_BASE}/films/${id}/`);
  return res.data;
}

export async function getMany(urls) {
  // Used for films/characters fan-out
  const promises = urls.map((u) => axios.get(u).then((r) => r.data));
  return Promise.all(promises);
}