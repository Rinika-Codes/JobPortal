import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './Applications.css';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await api.get('/applications');
        setApps(data);
      } catch {}
      setLoading(false);
    };
    fetchApps();
  }, []);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const statusColors = {
    pending: 'warning', reviewed: 'info', shortlisted: 'primary', accepted: 'success', rejected: 'danger'
  };
  const statusIcons = {
    pending: '⏳', reviewed: '👀', shortlisted: '⭐', accepted: '✅', rejected: '❌'
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return '';
    const fmt = n => `$${(n/1000).toFixed(0)}K`;
    return min && max ? `${fmt(min)} - ${fmt(max)}` : '';
  };

  if (loading) return <LoadingSpinner text="Loading applications..." />;

  return (
    <div className="container page">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of all your job applications</p>
      </div>

      {/* Status tabs */}
      <div className="app-tabs">
        {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            className={`app-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? '📋 All' : `${statusIcons[status]} ${status}`}
            <span className="tab-count">
              {status === 'all' ? apps.length : apps.filter(a => a.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No applications found</h3>
          <p>{filter === 'all' ? 'Start applying to jobs!' : `No ${filter} applications`}</p>
          <a href="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Jobs</a>
        </div>
      ) : (
        <div className="app-list">
          {filtered.map(app => (
            <a key={app.id} href={`/jobs/${app.job_id}`} className="app-card card">
              <div className="app-card-left">
                <div className="app-status-icon">{statusIcons[app.status]}</div>
                <div className="app-card-info">
                  <h3>{app.job_title}</h3>
                  <p className="app-company">{app.company_name}</p>
                  <div className="app-meta">
                    <span>📍 {app.job_location}</span>
                    <span>💼 {app.job_type?.replace('-', ' ')}</span>
                    {app.salary_min && <span>💰 {formatSalary(app.salary_min, app.salary_max)}</span>}
                  </div>
                </div>
              </div>
              <div className="app-card-right">
                <span className={`badge badge-${statusColors[app.status]}`}>{app.status}</span>
                <span className="app-date">Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                {app.match_score && <span className="app-score">{app.match_score}% match</span>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
