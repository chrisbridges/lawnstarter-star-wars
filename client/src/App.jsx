import React, { useState } from 'react';
import { search, fetchPerson, fetchFilm } from './api';
import './styles.css';

function App() {
    const [mode, setMode] = useState('people');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const [view, setView] = useState('search');
    const [person, setPerson] = useState(null);
    const [film, setFilm] = useState(null);

    const hasQuery = query.trim().length > 0;

    async function onSubmit(e) {
        e.preventDefault();
        if (!hasQuery) return;

        setIsSearching(true);
        setError(null);
        setResults([]);
        setPerson(null);
        setFilm(null);
        setView('search');

        try {
            const res = await search(mode, query);
            setResults(res.results || []);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSearching(false);
        }
    }

    async function openPersonDetails(id) {
        setIsSearching(true);
        setError(null);
        try {
            const p = await fetchPerson(id);
            setPerson(p);
            setView('personDetails');
        } catch (err) {
            console.error(err);
            setError('Failed to load character details.');
        } finally {
            setIsSearching(false);
        }
    }

    async function openFilmDetails(id) {
        setIsSearching(true);
        setError(null);
        try {
            const f = await fetchFilm(id);
            setFilm(f);
            setView('filmDetails');
        } catch (err) {
            console.error(err);
            setError('Failed to load movie details.');
        } finally {
            setIsSearching(false);
        }
    }

    function backToSearch() {
        setView('search');
    }

    return (
        <div className="app-root">
            <header className="app-header">
                <h1 className="logo">SWStarter</h1>
            </header>

            <main className="app-main">
                <section className="search-panel">
                    <form onSubmit={onSubmit}>
                        <p className="search-label">What are you searching for?</p>

                        <div className="search-toggle">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="people"
                                    checked={mode === 'people'}
                                    onChange={() => setMode('people')}
                                />
                                <span>People</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="films"
                                    checked={mode === 'films'}
                                    onChange={() => setMode('films')}
                                />
                                <span>Movies</span>
                            </label>
                        </div>

                        <input
                            type="text"
                            className="search-input"
                            placeholder={
                                mode === 'people'
                                    ? 'e.g. Chewbacca, Yoda, Boba Fett'
                                    : 'e.g. A New Hope, Jedi'
                            }
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />

                        <button
                            type="submit"
                            className={`search-button ${isSearching ? 'searching' : ''}`}
                            disabled={!hasQuery || isSearching}
                        >
                            {isSearching ? 'SEARCHING…' : 'SEARCH'}
                        </button>
                    </form>
                </section>

                <section className="results-panel">
                    <h2 className="results-title">Results</h2>

                    {error && <div className="error-message">{error}</div>}

                    {isSearching && view === 'search' && (
                        <div className="results-empty">Searching…</div>
                    )}

                    {!isSearching && view === 'search' && results.length === 0 && !error && (
                        <div className="results-empty">
                            There are zero matches.
                            <br />
                            Use the form to search for People or Movies.
                        </div>
                    )}

                    {!isSearching && view === 'search' && results.length > 0 && (
                        <ul className="results-list">
                            {results.map(item => (
                                <li key={item.id} className="result-row">
                                    <span className="result-name">
                                        {mode === 'people' ? item.name : item.title}
                                    </span>
                                    <button
                                        className="details-button"
                                        type="button"
                                        onClick={() =>
                                            mode === 'people'
                                                ? openPersonDetails(item.id)
                                                : openFilmDetails(item.id)
                                        }
                                    >
                                        SEE DETAILS
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {view === 'personDetails' && person && (
                        <div className="details-layout">
                            <div className="details-column">
                                <h2>{person.name}</h2>
                                <h3>Details</h3>
                                <div className="details-list">
                                    <div>Birth Year: {person.birthYear}</div>
                                    <div>Gender: {person.gender}</div>
                                    <div>Eye Color: {person.eyeColor}</div>
                                    <div>Hair Color: {person.hairColor}</div>
                                    <div>Height: {person.height}</div>
                                    <div>Mass: {person.mass}</div>
                                </div>
                            </div>
                            <div className="details-column">
                                <h3>Movies</h3>
                                <ul className="link-list">
                                    {person.films.map(f => (
                                        <li key={f.id}>
                                            <button
                                                type="button"
                                                className="link-like-button"
                                                onClick={() => openFilmDetails(f.id)}
                                            >
                                                {f.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="details-footer">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={backToSearch}
                                >
                                    BACK TO SEARCH
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'filmDetails' && film && (
                        <div className="details-layout">
                            <div className="details-column">
                                <h2>{film.title}</h2>
                                <h3>Opening Crawl</h3>
                                <p className="crawl-text">
                                    {film.openingCrawl}
                                </p>
                            </div>
                            <div className="details-column">
                                <h3>Characters</h3>
                                <ul className="link-list">
                                    {film.characters.map(c => (
                                        <li key={c.id}>
                                            <button
                                                type="button"
                                                className="link-like-button"
                                                onClick={() => openPersonDetails(c.id)}
                                            >
                                                {c.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="details-footer">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={backToSearch}
                                >
                                    BACK TO SEARCH
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;