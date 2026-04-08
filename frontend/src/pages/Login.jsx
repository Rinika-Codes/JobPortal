import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showNotification } from '../components/shared/Notification';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showNotification('Welcome back!', 'success');
      
      // Use navigate to change pages without a full browser refresh
      navigate('/dashboard'); 
    } catch (err) {
      showNotification(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Accounts (password: <code>password123</code>)</p>
          <div className="demo-list">
            <button className="demo-btn" type="button" onClick={() => setForm({ email: 'john.doe@email.com', password: 'password123' })}>
              👤 Job Seeker
            </button>
            <button className="demo-btn" type="button" onClick={() => setForm({ email: 'techcorp@employer.com', password: 'password123' })}>
              🏢 Employer
            </button>
            <button className="demo-btn" type="button" onClick={() => setForm({ email: 'admin@jobportal.com', password: 'password123' })}>
              ⚙️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}