// server/swapiClient.js
const axios = require('axios');

const SWAPI_BASE = 'https://swapi.tech/api';

function unwrapResource(data) {
  // New swapi.tech format: { message, result: { properties: {...} } }
  if (data && data.result && data.result.properties) {
    return data.result.properties;
  }
  // Older format (docs on GitHub): resource is the object itself
  return data;
}

function extractIdFromUrl(url) {
  // e.g. "https://swapi.tech/api/people/10/" -> "10"
  if (!url) return null;
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || null;
}

/**
 * Search people by name fragment.
 * Uses global "search" parameter described in docs.  [oai_citation:0‡GitHub](https://github.com/semperry/swapi)
 */
async function searchPeople(query) {
  const { data } = await axios.get(`${SWAPI_BASE}/people`, {
    params: { search: query.trim() }
  });

  const results = data.results || []; // [{ uid, name, url }, ...]  [oai_citation:1‡FeRHeDio - iOS Developer](https://www.ferhedio.com/building-a-star-wars-app-with-swiftui-combine-part-3/?utm_source=chatgpt.com)
  return results.map(r => ({
    id: r.uid || extractIdFromUrl(r.url),
    name: r.name
  }));
}

/**
 * Search films by title fragment.
 * Films also support the search parameter; title is the search field.  [oai_citation:2‡GitHub](https://github.com/semperry/swapi)
 */
async function searchFilms(query) {
  const { data } = await axios.get(`${SWAPI_BASE}/films`, {
    params: { search: query.trim() }
  });

  const results = data.results || []; // same shape as people list
  return results.map(r => ({
    id: r.uid || extractIdFromUrl(r.url),
    title: r.title || r.name // defensive
  }));
}

/**
 * Fetch a single person + basic film info.
 */
async function getPerson(id) {
  const { data } = await axios.get(`${SWAPI_BASE}/people/${id}`);
  const props = unwrapResource(data);

  const filmUrls = props.films || [];
  const films = await Promise.all(
    filmUrls.map(async url => {
      try {
        const { data: filmData } = await axios.get(url);
        const filmProps = unwrapResource(filmData);
        return {
          id: extractIdFromUrl(filmProps.url),
          title: filmProps.title
        };
      } catch {
        return null;
      }
    })
  );

  return {
    id,
    name: props.name,
    birthYear: props.birth_year,
    gender: props.gender,
    eyeColor: props.eye_color,
    hairColor: props.hair_color,
    height: props.height,
    mass: props.mass,
    films: films.filter(Boolean)
  };
}

/**
 * Fetch a single film + basic character info.
 */
async function getFilm(id) {
  const { data } = await axios.get(`${SWAPI_BASE}/films/${id}`);
  const props = unwrapResource(data);

  const characterUrls = props.characters || [];
  const characters = await Promise.all(
    characterUrls.map(async url => {
      try {
        const { data: personData } = await axios.get(url);
        const personProps = unwrapResource(personData);
        return {
          id: extractIdFromUrl(personProps.url),
          name: personProps.name
        };
      } catch {
        return null;
      }
    })
  );

  return {
    id,
    title: props.title,
    openingCrawl: props.opening_crawl,
    characters: characters.filter(Boolean)
  };
}

module.exports = {
  searchPeople,
  searchFilms,
  getPerson,
  getFilm
};