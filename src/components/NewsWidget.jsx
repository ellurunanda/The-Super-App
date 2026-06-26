import { useEffect, useMemo, useState } from 'react';
import { fetchTopHeadlines } from '../services/apiServices';
import { useStore } from '../store/useStore';

export default function NewsWidget() {
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('Loading headlines...');
  const [isLoading, setIsLoading] = useState(true);
  const pushToast = useStore((state) => state.pushToast);

  const activeArticle = useMemo(() => articles[activeIndex] || null, [articles, activeIndex]);

  useEffect(() => {
    let cancelled = false;
    let intervalId = 0;

    async function loadNews() {
      setIsLoading(true);
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY?.trim();
        if (!apiKey && !cancelled) {
          pushToast({
            tone: 'warning',
            title: 'News API key missing',
            message: 'Showing fallback headlines until a live key is added.',
          });
        }
        const data = await fetchTopHeadlines('general', apiKey);
        if (!cancelled) {
          setArticles(data.slice(0, 6));
          setStatus(apiKey ? 'Live headlines' : 'Fallback news feed');
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('News feed unavailable');
          setIsLoading(false);
          pushToast({
            tone: 'error',
            title: 'News request failed',
            message: 'Showing fallback headlines for now.',
          });
        }
      }
    }

    loadNews();
    intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextLength = articles.length || 1;
        return (current + 1) % nextLength;
      });
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= articles.length && articles.length > 0) {
      setActiveIndex(0);
    }
  }, [articles, activeIndex]);

  return (
    <section className="widget news-widget">
      {isLoading ? (
        <div className="skeleton-news">
          <div className="skeleton-media" />
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line-sm" />
        </div>
      ) : activeArticle ? (
        <article className="news-card">
          <div className="news-media-wrap">
            <img src={activeArticle.urlToImage || activeArticle.image} alt={activeArticle.title} />
            <div className="news-overlay">
              <h4>{activeArticle.title}</h4>
              <span>{new Date().toLocaleDateString()} | {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="news-body">
            <p>{activeArticle.description || 'No description available.'}</p>
          </div>
        </article>
      ) : (
        <div className="empty-state">No articles available.</div>
      )}
    </section>
  );
}