import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleAlert, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

const defaultForm = {
  name: '',
  username: '',
  email: '',
  mobile: '',
};

function Field({ label, name, value, error, onChange, type = 'text' }) {
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
        placeholder={label}
      />
      {error ? <span className="field-error"><CircleAlert size={14} /> {error}</span> : null}
    </label>
  );
}

export default function RegistrationForm() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const pushToast = useStore((state) => state.pushToast);
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const namePattern = useMemo(() => /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/, []);
  const usernamePattern = useMemo(() => /^[A-Za-z0-9]+$/, []);
  const emailPattern = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const mobilePattern = useMemo(() => /^\d{10}$/, []);

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Name is required.';
    else if (!namePattern.test(formData.name.trim())) nextErrors.name = 'Use alphabetic characters only.';

    if (!formData.username.trim()) nextErrors.username = 'Username is required.';
    else if (!usernamePattern.test(formData.username.trim())) nextErrors.username = 'Use letters and numbers with no spaces.';

    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.';

    if (!formData.mobile.trim()) nextErrors.mobile = 'Mobile number is required.';
    else if (!mobilePattern.test(formData.mobile.trim())) nextErrors.mobile = 'Enter exactly 10 digits.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setUser({
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
    });

    pushToast({
      tone: 'success',
      title: 'Account created',
      message: 'Use the login screen to continue.',
    });

    navigate('/login');
  };

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setFormData((current) => ({ ...current, [field]: nextValue }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <div className="brand-stack auth-brand">
        <div className="brand-badge">Super app</div>
        <h1>Create your new account</h1>
      </div>

      <div className="form-grid">
        <Field label="Name" name="name" value={formData.name} error={errors.name} onChange={updateField('name')} />
        <Field label="UserName" name="username" value={formData.username} error={errors.username} onChange={updateField('username')} />
        <Field label="Email" name="email" value={formData.email} error={errors.email} onChange={updateField('email')} type="email" />
        <Field label="Mobile" name="mobile" value={formData.mobile} error={errors.mobile} onChange={updateField('mobile')} />
      </div>

      <label className="checkline">
        <input type="checkbox" defaultChecked />
        <span>Share my registration data with Superapp</span>
      </label>

      <button className="primary-button" type="submit">
        <ShieldCheck size={18} />
        Sign up
      </button>

      <p className="legal-text">
        By clicking on Sign up, you agree to Superapp <strong>Terms and Conditions of Use</strong>.
      </p>
      <p className="legal-text">
        To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp <strong>Privacy Policy</strong>.
      </p>

      <p className="legal-text auth-switch">
        Already have an account? <Link to="/login" className="auth-switch-link">Log in</Link>
      </p>
    </form>
  );
}