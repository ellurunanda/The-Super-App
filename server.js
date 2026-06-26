import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 10000;

const openWeatherApiKey = process.env.OPENWEATHER_API_KEY || '';
const newsApiKey = process.env.NEWS_API_KEY || '';
const tmdbApiKey = process.env.TMDB_API_KEY || '';

function requireApiKey(res, keyValue, keyName) {
  if (keyValue) {
    return true;
  }

  res.status(503).json({
    status: 'error',
    code: 'missingServerKey',
    message: `${keyName} is not configured on the server.`,
  });
  return false;
}

function relayAxiosError(res, error) {
  const status = error.response?.status || 502;
  const message = error.response?.data || {
    status: 'error',
    code: 'upstreamRequestFailed',
    message: 'Upstream API request failed.',
  };

  res.status(status).json(message);
}

app.get('/api/weather/weather', async (req, res) => {
  if (!requireApiKey(res, openWeatherApiKey, 'OPENWEATHER_API_KEY')) {
    return;
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        ...req.query,
        appid: openWeatherApiKey,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    relayAxiosError(res, error);
  }
});

app.get('/api/news/top-headlines', async (req, res) => {
  if (!requireApiKey(res, newsApiKey, 'NEWS_API_KEY')) {
    return;
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        ...req.query,
        apiKey: newsApiKey,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    relayAxiosError(res, error);
  }
});

app.get('/api/tmdb/search/movie', async (req, res) => {
  if (!requireApiKey(res, tmdbApiKey, 'TMDB_API_KEY')) {
    return;
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        ...req.query,
        api_key: tmdbApiKey,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    relayAxiosError(res, error);
  }
});

app.get('/api/tmdb/movie/:id', async (req, res) => {
  if (!requireApiKey(res, tmdbApiKey, 'TMDB_API_KEY')) {
    return;
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${encodeURIComponent(req.params.id)}`, {
      params: {
        ...req.query,
        append_to_response: req.query.append_to_response || 'credits',
        api_key: tmdbApiKey,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    relayAxiosError(res, error);
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Super App server listening on port ${port}`);
});
