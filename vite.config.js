import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function appendQuery(path, key, value) {
  if (!value || path.includes(`${key}=`)) {
    return path;
  }

  return `${path}${path.includes('?') ? '&' : '?'}${key}=${encodeURIComponent(value)}`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const openWeatherApiKey = env.OPENWEATHER_API_KEY || '';
  const newsApiKey = env.NEWS_API_KEY || '';
  const tmdbApiKey = env.TMDB_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/weather': {
          target: 'https://api.openweathermap.org/data/2.5',
          changeOrigin: true,
          rewrite: (path) => appendQuery(path.replace(/^\/api\/weather/, ''), 'appid', openWeatherApiKey),
        },
        '/api/news': {
          target: 'https://newsapi.org/v2',
          changeOrigin: true,
          rewrite: (path) => appendQuery(path.replace(/^\/api\/news/, ''), 'apiKey', newsApiKey),
        },
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => appendQuery(path.replace(/^\/api\/tmdb/, ''), 'api_key', tmdbApiKey),
        },
      },
    },
  };
});