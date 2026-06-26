import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim() || '';
const apiBase = configuredApiBase.endsWith('/') ? configuredApiBase.slice(0, -1) : configuredApiBase;

const weatherBaseUrl = `${apiBase}/api/weather`;
const newsBaseUrl = `${apiBase}/api/news`;
const movieBaseUrl = `${apiBase}/api/tmdb`;

const weatherClient = axios.create({ baseURL: weatherBaseUrl, timeout: 12000 });
const newsClient = axios.create({ baseURL: newsBaseUrl, timeout: 12000 });
const movieClient = axios.create({ baseURL: movieBaseUrl, timeout: 12000 });

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
  const response = await weatherClient.get('/weather', {
    params: { q: city, units: 'metric' },
  });
  return response.data;
}

export async function fetchTopHeadlines(category = 'general') {
  const response = await newsClient.get('/top-headlines', {
    params: { category, language: 'en' },
  });
  return response.data.articles || [];
}

export async function searchMovieByGenre(query) {
  const response = await movieClient.get('/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
  });

  if (!Array.isArray(response.data?.results) || response.data.results.length === 0) {
    return [];
  }

  return response.data.results.slice(0, 8).map((movie) => normalizeMovie(mapTmdbMovieToCard(movie, query)));
}

export async function fetchMovieDetails(imdbID) {
  const tmdbId = Number(String(imdbID).replace('tmdb-', ''));
  if (!Number.isFinite(tmdbId)) {
    throw new Error('Invalid movie id');
  }

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
}