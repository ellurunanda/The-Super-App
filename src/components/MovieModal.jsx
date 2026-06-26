import { X } from 'lucide-react';

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close movie details">
          <X size={18} />
        </button>
        <img src={movie.Poster} alt={movie.Title} className="modal-poster" />
        <div className="modal-content">
          <h3>{movie.Title}</h3>
          <p><strong>Genre:</strong> {movie.Genre || 'Not available'}</p>
          <p><strong>Rating:</strong> {movie.imdbRating || movie.Rating || 'N/A'}</p>
          <p><strong>Runtime:</strong> {movie.Runtime || 'N/A'}</p>
          <p><strong>Plot:</strong> {movie.Plot || 'No plot available.'}</p>
          <p><strong>Cast:</strong> {movie.Actors || 'Not available'}</p>
        </div>
      </div>
    </div>
  );
}