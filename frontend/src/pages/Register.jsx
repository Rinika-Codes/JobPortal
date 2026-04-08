import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { showNotification } from '../components/shared/Notification';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const [role, setRole] = useState('seeker');
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', full_name: '', company_name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    if (form.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, role });
      showNotification('Account created successfully!', 'success');
      window.location.href = '/dashboard';
    } catch (err) {
      showNotification(err.message || 'Registration failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the AI-powered job platform</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>I am a</label>
            <div className="role-selector">
              <button type="button" className={`role-option ${role === 'seeker' ? 'active' : ''}`} onClick={() => setRole('seeker')}>
                <span className="role-icon">👤</span>
                <span className="role-label">Job Seeker</span>
              </button>
              <button type="button" className={`role-option ${role === 'employer' ? 'active' : ''}`} onClick={() => setRole('employer')}>
                <span className="role-icon">🏢</span>
                <span className="role-label">Employer</span>
              </button>
            </div>
          </div>

          {role === 'seeker' ? (
            <div className="input-group">
              <label>Full Name</label>
              <input className="input-field" type="text" placeholder="John Doe" value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
          ) : (
            <div className="input-group">
              <label>Company Name</label>
              <input className="input-field" type="text" placeholder="Acme Inc." value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}
