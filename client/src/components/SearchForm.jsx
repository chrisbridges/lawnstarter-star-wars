import React from "react";

export default function SearchForm({
    searchType,
    setSearchType,
    query,
    setQuery,
    onSubmit,
    isSearching
}) {
    return (
        <section className="card search-card">
            <p className="section-title">What are you searching for?</p>
            <div className="radio-group">
                <label className="radio-label">
                    <input
                        type="radio"
                        value="people"
                        checked={searchType === "people"}
                        onChange={() => setSearchType("people")}
                    />
                    <span>People</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        value="movies"
                        checked={searchType === "movies"}
                        onChange={() => setSearchType("movies")}
                    />
                    <span>Movies</span>
                </label>
            </div>

            <form onSubmit={onSubmit}>
                <input
                    className="search-input"
                    placeholder="e.g. Chewbacca, Yoda, Boba Fett"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="primary-btn" type="submit" disabled={isSearching}>
                    {isSearching ? "SEARCHING..." : "SEARCH"}
                </button>
            </form>
        </section>
    );
}