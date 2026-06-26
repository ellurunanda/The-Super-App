import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, LogOut } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import NewsWidget from '../components/NewsWidget';
import TimerWidget from '../components/TimerWidget';
import NotesWidget from '../components/NotesWidget';
import { useStore } from '../store/useStore';

const profileAvatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=500&q=80';

function ProfileWidget() {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);

  return (
    <section className="widget profile-widget">
      <div className="profile-top">
        <img src={profileAvatar} alt="Profile avatar" className="profile-avatar-image" />
        <div className="profile-copy">
          <h3>{user.name || 'Guest User'}</h3>
          <p>{user.email || 'guest@superapp.dev'}</p>
          <strong>{user.username || 'superuser'}</strong>
        </div>
      </div>
      <div className="profile-chip-grid">
        {categories.slice(0, 4).map((item) => (
          <span key={item} className="chip chip-soft">{item}</span>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const logoutSession = useStore((state) => state.logoutSession);

  const handleLogout = () => {
    logoutSession();
    navigate('/login');
  };

  return (
    <main className="page-shell dashboard-shell dashboard-shell-figma">
      <header className="dashboard-topbar dashboard-topbar-minimal">
        <span className="brand-badge dashboard-brand">Super app</span>
        <div className="topbar-actions">
          <button type="button" className="ghost-button page-back-button" onClick={() => navigate('/categories')}>
            <ArrowLeft size={16} /> Back
          </button>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <section className="dashboard-grid dashboard-grid-figma">
        <ProfileWidget />
        <NotesWidget />
        <NewsWidget />
        <WeatherWidget />
        <TimerWidget />
      </section>

      <footer className="dashboard-footer">
        <button type="button" className="secondary-button" onClick={() => navigate('/movies')}>
          <LayoutGrid size={16} /> Browse
        </button>
      </footer>
    </main>
  );
}
