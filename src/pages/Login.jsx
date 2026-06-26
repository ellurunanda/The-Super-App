import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleAlert, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

const defaultForm = {
  identifier: '',
  mobile: '',
};

function Field({ label, name, value, error, onChange, type = 'text', placeholder }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className={`field-input ${error ? 'field-input-error' : ''}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete="off"
        placeholder={placeholder || label}
      />
      {error ? <span className="field-error"><CircleAlert size={14} /> {error}</span> : null}
    </label>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const isRegistered = useStore((state) => state.isRegistered);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const pushToast = useStore((state) => state.pushToast);
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const mobilePattern = useMemo(() => /^\d{10}$/, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/categories', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!isRegistered) {
      nextErrors.identifier = 'Create an account first.';
      pushToast({
        tone: 'warning',
        title: 'No account found',
        message: 'Please register before logging in.',
      });
    }

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Username or email is required.';
    } else {
      const normalized = formData.identifier.trim().toLowerCase();
      const matchesUser = normalized === user.username.toLowerCase() || normalized === user.email.toLowerCase();

      if (!matchesUser) {
        nextErrors.identifier = 'Username or email does not match the registered account.';
      }
    }

    if (!formData.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required.';
    } else if (!mobilePattern.test(formData.mobile.trim())) {
      nextErrors.mobile = 'Enter exactly 10 digits.';
    } else if (formData.mobile.trim() !== user.mobile) {
      nextErrors.mobile = 'Mobile number does not match the registered account.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setAuthenticated(true);
    pushToast({
      tone: 'success',
      title: 'Logged in successfully',
      message: 'Welcome back to Superapp.',
    });
    navigate('/categories');
  };

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setFormData((current) => ({ ...current, [field]: nextValue }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-visual auth-visual-login">
        <div className="auth-visual-overlay" />
        <div className="auth-visual-copy">
          <p>Welcome back to</p>
          <h2>Superapp</h2>
        </div>
      </section>

      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="brand-stack auth-brand">
          <div className="brand-badge">Super app</div>
          <h1>Log in to your account</h1>
        </div>

        <div className="form-grid">
          <Field
            label="Username or Email"
            name="identifier"
            value={formData.identifier}
            error={errors.identifier}
            onChange={updateField('identifier')}
            placeholder="Username or Email"
          />
          <Field
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            error={errors.mobile}
            onChange={updateField('mobile')}
          />
        </div>

        <button className="primary-button" type="submit">
          <ShieldCheck size={18} />
          Log in
        </button>

        <p className="legal-text auth-switch">
          New here? <Link to="/" className="auth-switch-link">Create your account</Link>
        </p>
      </form>
    </main>
  );
}