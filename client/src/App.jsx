import React, { useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ResultsList from "./components/ResultsList.jsx";
import PersonDetails from "./components/PersonDetails.jsx";
import MovieDetails from "./components/MovieDetails.jsx";

const API_BASE = "/api";

export default function App() {
    const [mode, setMode] = useState("search"); // "search" | "person" | "movie"
    const [searchType, setSearchType] = useState("people");
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResults([]);
        try {
            const res = await fetch(
                `${API_BASE}/search?type=${searchType}&q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            setResults(data.results || []);
        } finally {
            setIsSearching(false);
            setMode("search");
        }
    }

    async function openPerson(id) {
        const res = await fetch(`${API_BASE}/people/${id}`);
        const data = await res.json();
        setSelectedPerson(data);
        setMode("person");
    }

    async function openMovie(id) {
        const res = await fetch(`${API_BASE}/films/${id}`);
        const data = await res.json();
        setSelectedMovie(data);
        setMode("movie");
    }

    function backToSearch() {
        setMode("search");
    }

    return (
        <div className="app-root">
            <header className="app-header">
                <h1>SWStarter</h1>
            </header>

            {mode === "search" && (
                <div className="layout">
                    <SearchForm
                        searchType={searchType}
                        setSearchType={setSearchType}
                        query={query}
                        setQuery={setQuery}
                        onSubmit={handleSearch}
                        isSearching={isSearching}
                    />
                    <ResultsList
                        searchType={searchType}
                        results={results}
                        isSearching={isSearching}
                        onOpenPerson={openPerson}
                        onOpenMovie={openMovie}
                    />
                </div>
            )}

            {mode === "person" && selectedPerson && (
                <div className="detail-layout">
                    <PersonDetails data={selectedPerson} onBack={backToSearch} />
                </div>
            )}

            {mode === "movie" && selectedMovie && (
                <div className="detail-layout">
                    <MovieDetails data={selectedMovie} onBack={backToSearch} onOpenPerson={openPerson} />
                </div>
            )}
        </div>
    );
}