import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim() || '';
const apiBase = configuredApiBase.endsWith('/') ? configuredApiBase.slice(0, -1) : configuredApiBase;

const weatherBaseUrl = `${apiBase}/api/weather`;
const newsBaseUrl = `${apiBase}/api/news`;
const movieBaseUrl = `${apiBase}/api/tmdb`;

const weatherClient = axios.create({ baseURL: weatherBaseUrl });
const newsClient = axios.create({ baseURL: newsBaseUrl });
const movieClient = axios.create({ baseURL: movieBaseUrl });

const fallbackMovies = [
  {
    Title: 'The Dark Knight',
    Year: '2008',
    imdbID: 'tmdb-155',
    Poster: 'https://m.media-amazon.com/images/I/51k0qaQb4lL._AC_.jpg',
    Genre: 'Action, Crime, Drama',
  },
  {
    Title: 'Interstellar',
    Year: '2014',
    imdbID: 'tmdb-157336',
    Poster: 'https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg',
    Genre: 'Adventure, Drama, Sci-Fi',
  },
  {
    Title: 'Whiplash',
    Year: '2014',
    imdbID: 'tmdb-244786',
    Poster: 'https://m.media-amazon.com/images/I/81j+W6c0xkL._AC_SY679_.jpg',
    Genre: 'Drama, Music',
  },
  {
    Title: 'Top Gun: Maverick',
    Year: '2022',
    imdbID: 'tmdb-361743',
    Poster: 'https://m.media-amazon.com/images/I/71vZLx7Wf-L._AC_SL1500_.jpg',
    Genre: 'Action, Drama',
  },
  {
    Title: 'Smile',
    Year: '2022',
    imdbID: 'tmdb-882598',
    Poster: 'https://m.media-amazon.com/images/I/71NQf8N7f7L._AC_SL1500_.jpg',
    Genre: 'Horror, Mystery, Thriller',
  },
  {
    Title: 'La La Land',
    Year: '2016',
    imdbID: 'tmdb-313369',
    Poster: 'https://m.media-amazon.com/images/I/71VAj4vP0SL._AC_SL1080_.jpg',
    Genre: 'Comedy, Drama, Music, Romance',
  },
];

const posterFallback = 'https://images.unsplash.com/photo-1489599093899-0c8de3f8f3b3?auto=format&fit=crop&w=900&q=80';

const tmdbGenreNames = {
  28: 'Action',
  35: 'Comedy',
  18: 'Drama',
  10402: 'Music',
  9648: 'Mystery',
  27: 'Horror',
  10749: 'Romance',
  53: 'Thriller',
  14: 'Fantasy',
  878: 'Sci-Fi',
  12: 'Adventure',
};

function tmdbPoster(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : posterFallback;
}

function mapTmdbMovieToCard(movie, query) {
  const genre = (movie.genre_ids || []).map((id) => tmdbGenreNames[id]).filter(Boolean).join(', ');

  return {
    Title: movie.title || movie.name || 'Untitled',
    Year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
    imdbID: `tmdb-${movie.id}`,
    Poster: tmdbPoster(movie.poster_path),
    Genre: genre || query || 'Movie',
  };
}

function normalizeMovie(movie) {
  return {
    ...movie,
    Poster: !movie.Poster || movie.Poster === 'N/A' ? posterFallback : movie.Poster,
  };
}

function fallbackMoviesByQuery(query) {
  const normalizedQuery = (query || '').toLowerCase();
  const filtered = fallbackMovies.filter((movie) => `${movie.Title} ${movie.Genre}`.toLowerCase().includes(normalizedQuery));
  return (filtered.length ? filtered : fallbackMovies).map(normalizeMovie);
}

export async function reverseGeocodeCoordinates(latitude, longitude) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&language=en&count=1`,
  );

  if (!response.ok) {
    throw new Error('Reverse geocoding request failed');
  }

  const data = await response.json();
  const result = data?.results?.[0];

  if (!result) {
    return null;
  }

  return [result.name, result.admin1, result.country].filter(Boolean).join(', ');
}

export async function fetchCurrentWeather(city) {
  try {
    const response = await weatherClient.get('/weather', {
      params: { q: city, units: 'metric' },
    });
    return response.data;
  } catch {
    return {
      name: city,
      main: { temp: 24, pressure: 1010, humidity: 83 },
      wind: { speed: 3.7 },
      weather: [{ main: 'Rain', description: 'heavy rain' }],
    };
  }
}

export async function fetchTopHeadlines(category = 'general') {
  const fallbackArticles = [
    {
      title: 'Design systems are shaping the next wave of product teams',
      description: 'A quick look at what teams are standardizing in 2026.',
      urlToImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      source: { name: 'Superapp Daily' },
    },
    {
      title: 'Cities are investing in more walkable public spaces',
      description: 'Transport planning is shifting toward people-first layouts.',
      urlToImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
      source: { name: 'Metro Wire' },
    },
    {
      title: 'AI tools move from novelty to everyday workflow',
      description: 'The practical layer is replacing the demo layer.',
      urlToImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
      source: { name: 'Tech Ledger' },
    },
  ];

  try {
    const response = await newsClient.get('/top-headlines', {
      params: { category, language: 'en' },
    });
    return response.data.articles || fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function searchMovieByGenre(query) {
  try {
    const response = await movieClient.get('/search/movie', {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
    });

    if (!Array.isArray(response.data?.results) || response.data.results.length === 0) {
      return fallbackMoviesByQuery(query);
    }

    return response.data.results.slice(0, 8).map((movie) => normalizeMovie(mapTmdbMovieToCard(movie, query)));
  } catch {
    return fallbackMoviesByQuery(query);
  }
}

export async function fetchMovieDetails(imdbID) {
  const tmdbId = Number(String(imdbID).replace('tmdb-', ''));
  if (!Number.isFinite(tmdbId)) {
    return {
      Title: 'Movie details unavailable',
      Genre: 'N/A',
      imdbRating: 'N/A',
      Runtime: 'N/A',
      Plot: 'Movie details are not available for this item.',
      Actors: 'N/A',
      Poster: posterFallback,
    };
  }

  try {
    const response = await movieClient.get(`/movie/${tmdbId}`, {
      params: { language: 'en-US', append_to_response: 'credits' },
    });

    const cast = (response.data?.credits?.cast || []).slice(0, 5).map((person) => person.name).join(', ');

    return {
      Title: response.data?.title || 'Untitled',
      Genre: (response.data?.genres || []).map((genre) => genre.name).join(', ') || 'N/A',
      imdbRating: response.data?.vote_average ? String(response.data.vote_average.toFixed(1)) : 'N/A',
      Runtime: response.data?.runtime ? `${response.data.runtime} min` : 'N/A',
      Plot: response.data?.overview || 'No plot available.',
      Actors: cast || 'Not available',
      Poster: tmdbPoster(response.data?.poster_path || response.data?.backdrop_path),
    };
  } catch {
    return {
      Title: 'The Dark Knight',
      Genre: 'Action, Crime, Drama',
      Rating: '9.0',
      Runtime: '152 min',
      Plot: 'Batman raises the stakes in his war on crime.',
      Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
      Poster: 'https://m.media-amazon.com/images/I/51k0qaQb4lL._AC_.jpg',
    };
  }
}