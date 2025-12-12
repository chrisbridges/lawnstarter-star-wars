export default function ResultsList({
    searchType,
    results,
    isSearching,
    onOpenPerson,
    onOpenMovie
}) {
    return (
        <section className="card results-card">
            <h2 className="results-title">Results</h2>
            <div className="results-content">
                {isSearching && (
                    <p className="muted">Searching...</p>
                )}

                {!isSearching && results.length === 0 && (
                    <p className="muted">
                        There are zero matches.
                        <br />
                        Use the form to search for People or Movies.
                    </p>
                )}

                {!isSearching && results.length > 0 && (
                    <ul className="results-list">
                        {results.map((item) => (
                            <li key={item.id} className="result-row">
                                <span className="result-name">
                                    {searchType === "people" ? item.name : item.title}
                                </span>
                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        searchType === "people"
                                            ? onOpenPerson(item.id)
                                            : onOpenMovie(item.id)
                                    }
                                >
                                    SEE DETAILS
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}