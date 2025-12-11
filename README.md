# SWStarter

Star Wars search app (People / Movies) that talks to SWAPI via a Node/Express backend,
with a React frontend and a stats endpoint recomputed every 5 minutes.

## Running with Docker

```bash
docker build -t swstarter .
docker run -p 3000:3000 swstarter
