import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { useStore } from '../store/useStore';

export default function Register() {
  const navigate = useNavigate();
  const isRegistered = useStore((state) => state.isRegistered);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/categories', { replace: true });
      return;
    }

    if (isRegistered) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isRegistered, navigate]);

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="auth-visual-overlay" />
        <div className="auth-visual-copy">
          <p>Discover new things on</p>
          <h2>Superapp</h2>
        </div>
      </section>
      <RegistrationForm />
    </main>
  );
}