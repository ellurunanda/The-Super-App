export default function MovieCard({ movie, onClick, compact = false }) {
  return (
    <button type="button" className={`movie-card ${compact ? 'movie-card-compact' : ''}`} onClick={() => onClick(movie)}>
      <img src={movie.Poster} alt={movie.Title} />
      {!compact ? (
        <div className="movie-card-meta">
          <h4>{movie.Title}</h4>
          <p>{movie.Year}</p>
        </div>
      ) : null}
    </button>
  );
}