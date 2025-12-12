export default function PersonDetails({ data, onBack }) {
    return (
        <section className="card detail-card">
            <div className="detail-header">
                <h2>{data.name}</h2>
            </div>

            <div className="detail-columns">
                <div className="detail-col">
                    <h3>Details</h3>
                    <hr />
                    <p>Birth Year: {data.birthYear}</p>
                    <p>Gender: {data.gender}</p>
                    <p>Eye Color: {data.eyeColor}</p>
                    <p>Hair Color: {data.hairColor}</p>
                    <p>Height: {data.height}</p>
                    <p>Mass: {data.mass}</p>
                </div>

                <div className="detail-col">
                    <h3>Movies</h3>
                    <hr />
                    <ul className="link-list">
                        {data.films.map((film) => (
                            <li key={film.id}>{film.title}</li>
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