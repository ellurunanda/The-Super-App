import { useEffect, useState } from 'react';
import { Gauge, Droplets, Wind, CloudRain, LocateFixed, MapPin } from 'lucide-react';
import { fetchCurrentWeather, reverseGeocodeCoordinates } from '../services/apiServices';
import { useStore } from '../store/useStore';

export default function WeatherWidget() {
  const city = useStore((state) => state.weatherCity);
  const pushToast = useStore((state) => state.pushToast);
  const setWeatherCity = useStore((state) => state.setWeatherCity);
  const [weather, setWeather] = useState(null);
  const [draftCity, setDraftCity] = useState(city);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setDraftCity(city);
  }, [city]);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setIsLoading(true);
      setIsTransitioning(true);
      try {
        const data = await fetchCurrentWeather(city);
        if (!cancelled) {
          setWeather(data);
          setIsLoading(false);
          window.setTimeout(() => {
            if (!cancelled) {
              setIsTransitioning(false);
            }
          }, 220);
        }
      } catch (error) {
        if (!cancelled) {
          setWeather(null);
          setIsLoading(false);
          window.setTimeout(() => {
            if (!cancelled) {
              setIsTransitioning(false);
            }
          }, 220);
          pushToast({
            tone: 'error',
            title: 'Weather request failed',
            message: 'Showing fallback weather for now.',
          });
        }
      }
    }

    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [city, pushToast]);

  const handleCitySubmit = (event) => {
    event.preventDefault();

    const nextCity = draftCity.trim();
    if (!nextCity) {
      pushToast({
        tone: 'warning',
        title: 'City required',
        message: 'Enter a city name to fetch weather.',
      });
      return;
    }

    setWeatherCity(nextCity);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      pushToast({
        tone: 'warning',
        title: 'Geolocation unsupported',
        message: 'This browser cannot detect your location.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude.toFixed(2);
        const longitude = position.coords.longitude.toFixed(2);

        try {
          const resolvedCity = await reverseGeocodeCoordinates(latitude, longitude);
          if (resolvedCity) {
            setWeatherCity(resolvedCity);
            return;
          }

          pushToast({
            tone: 'warning',
            title: 'Location found but city unavailable',
            message: `Coordinates: ${latitude}, ${longitude}`,
          });
        } catch {
          pushToast({
            tone: 'error',
            title: 'Could not resolve location',
            message: 'Please enter your city manually.',
          });
        }
      },
      () => {
        pushToast({
          tone: 'error',
          title: 'Location permission denied',
          message: 'Allow location access or enter your city manually.',
        });
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 },
    );
  };

  return (
    <section className={`widget weather-widget ${isTransitioning ? 'weather-widget-loading' : ''}`}>
      <div className="weather-datebar">
        <span>{new Date().toLocaleDateString()}</span>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <form className="weather-locationbar" onSubmit={handleCitySubmit}>
        <div className="weather-location-pill">
          <MapPin size={14} />
          <input
            value={draftCity}
            onChange={(event) => setDraftCity(event.target.value)}
            placeholder="Enter city"
            aria-label="Weather city"
          />
        </div>
        <button type="submit" className="weather-location-btn">Set</button>
        <button type="button" className="weather-location-btn weather-location-icon" onClick={detectLocation} aria-label="Use current location">
          <LocateFixed size={14} />
        </button>
      </form>

      <div className={`weather-panel ${isLoading ? 'weather-panel-loading' : ''}`}>
        {isLoading ? (
          <div className="skeleton-weather">
            <div className="skeleton-line skeleton-line-lg" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-sm" />
          </div>
        ) : !weather ? (
          <div className="empty-state">Weather unavailable.</div>
        ) : (
          <>
            <div className="weather-main weather-main-figma">
              <div className="weather-first-col">
                <CloudRain size={38} />
                <span>{weather.weather?.[0]?.description || 'N/A'}</span>
              </div>
              <div className="weather-temp">{Number.isFinite(weather.main?.temp) ? `${Math.round(weather.main.temp)}°C` : 'N/A'}</div>
              <div className="weather-meta">
                <span><Wind size={14} /> {weather.wind?.speed ?? 'N/A'} km/h Wind</span>
                <span><Gauge size={14} /> {weather.main?.pressure ?? 'N/A'} mbar Pressure</span>
                <span><Droplets size={14} /> {weather.main?.humidity ?? 'N/A'}% Humidity</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}