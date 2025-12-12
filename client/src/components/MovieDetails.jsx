export default function MovieDetails({ data, onBack, onOpenPerson }) {
    return (
        <section className="card detail-card">
            <div className="detail-header">
                <h2>{data.title}</h2>
            </div>

            <div className="detail-columns">
                <div className="detail-col">
                    <h3>Opening Crawl</h3>
                    <hr />
                    <p className="opening-crawl">
                        {data.openingCrawl}
                    </p>
                </div>

                <div className="detail-col">
                    <h3>Characters</h3>
                    <hr />
                    <ul className="link-list">
                        {data.characters.map((c) => (
                            <li key={c.id}>
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => onOpenPerson(c.id)}
                                >
                                    {c.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="primary-btn back-btn" onClick={onBack}>
                BACK TO SEARCH
            </button>
        </section>
    );
}