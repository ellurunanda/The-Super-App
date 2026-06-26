import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, LogOut } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { fetchMovieDetails, searchMovieByGenre } from '../services/apiServices';
import { useStore } from '../store/useStore';

const genreMap = {
  Action: 'action',
  Comedy: 'comedy',
  Drama: 'drama',
  Music: 'music',
  Sports: 'sport',
  Thriller: 'thriller',
  Fantasy: 'fantasy',
  Romance: 'romance',
};

export default function Movies() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const pushToast = useStore((state) => state.pushToast);
  const logoutSession = useStore((state) => state.logoutSession);
  const [movieGroups, setMovieGroups] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const selectedGenres = useMemo(() => (categories.length ? categories : ['Action', 'Drama', 'Music']), [categories]);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      const nextGroups = {};
      setLoadingGroups(true);

      for (const genre of selectedGenres) {
        const query = genreMap[genre] || genre.toLowerCase();
        try {
          const movies = await searchMovieByGenre(query);
          nextGroups[genre] = movies;
        } catch (error) {
          nextGroups[genre] = [];
          pushToast({
            tone: 'error',
            title: `${genre} search failed`,
            message: 'Showing an empty row for this category.',
          });
        }
      }

      if (!cancelled) {
        setMovieGroups(nextGroups);
        setLoadingGroups(false);
      }
    }

    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [pushToast, selectedGenres]);

  const openDetails = async (movie) => {
    const details = await fetchMovieDetails(movie.imdbID);
    setSelectedMovie({ ...movie, ...details });
  };

  const handleLogout = () => {
    logoutSession();
    navigate('/login');
  };

  const movieSkeletonRow = (
    <div className="movie-row movie-row-skeleton">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="movie-skeleton-card">
          <div className="skeleton-media" />
          <div className="skeleton-line skeleton-line-sm" />
        </div>
      ))}
    </div>
  );

  return (
    <main className="page-shell movie-shell">
      <header className="movie-topbar movie-topbar-figma">
        <div className="movie-actions-row">
          <button type="button" className="ghost-button page-back-button" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="movie-actions-right">
            <button
              type="button"
              className="movie-avatar-button"
              onClick={() => navigate('/dashboard')}
              aria-label="Back to dashboard"
            >
              <span>{user.username?.slice(0, 2).toUpperCase() || 'SA'}</span>
            </button>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="movie-topbar-copy">
          <span className="brand-badge">Super app</span>
          <h1>Entertainment according to your choice</h1>
        </div>
      </header>

      <div className="movie-groups">
        {selectedGenres.map((genre) => (
          <section key={genre} className="movie-group">
            <h2>{genre}</h2>
            {loadingGroups ? movieSkeletonRow : (
              <div className="movie-row">
                {(movieGroups[genre] || []).slice(0, 4).map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} onClick={openDetails} compact />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <footer className="movie-footer">
        <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
          <LayoutGrid size={16} /> Browse
        </button>
      </footer>

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}