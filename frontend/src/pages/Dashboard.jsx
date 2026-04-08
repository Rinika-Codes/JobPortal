import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employerJobs, setEmployerJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'seeker') {
          const apps = await api.get('/applications');
          setApplications(apps);
          const jobsData = await api.get('/jobs?limit=4');
          setRecentJobs(jobsData.jobs);
        } else if (user.role === 'employer') {
          const empData = await api.get('/employer/profile');
          setStats(empData.stats);
          const jobs = await api.get('/employer/jobs');
          setEmployerJobs(jobs);
        } else if (user.role === 'admin') {
          const adminStats = await api.get('/admin/stats');
          setStats(adminStats);
        }
      } catch {}
    };
    if (user) fetchData();
  }, [user]);

  const statusIcon = { pending: '⏳', reviewed: '👀', shortlisted: '⭐', accepted: '✅', rejected: '❌' };

  // Seeker Dashboard
  if (user?.role === 'seeker') {
    const appCounts = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
    };

    return (
      <div className="container page">
        <div className="page-header">
          <h1>Welcome, {profile?.full_name || 'User'} 👋</h1>
          <p>{profile?.headline || 'Complete your profile to get better job matches'}</p>
        </div>

        <div className="grid-4 dash-stats">
          <div className="stat-card"><div className="stat-value">{appCounts.total}</div><div className="stat-label">Total Applications</div></div>
          <div className="stat-card"><div className="stat-value">{appCounts.pending}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card"><div className="stat-value">{appCounts.shortlisted}</div><div className="stat-label">Shortlisted</div></div>
          <div className="stat-card"><div className="stat-value">{appCounts.accepted}</div><div className="stat-label">Accepted</div></div>
        </div>

        <div className="dash-grid">
          <div className="dash-section">
            <div className="dash-section-header">
              <h2>Recent Applications</h2>
              <a href="/applications" className="btn btn-sm btn-secondary">View All</a>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📝</div><h3>No applications yet</h3><p>Start applying to jobs!</p></div>
            ) : (
              <div className="dash-list">
                {applications.slice(0, 5).map(app => (
                  <a key={app.id} href={`/jobs/${app.job_id}`} className="dash-list-item">
                    <div className="dash-item-icon">{statusIcon[app.status] || '📝'}</div>
                    <div className="dash-item-info">
                      <div className="dash-item-title">{app.job_title}</div>
                      <div className="dash-item-sub">{app.company_name} • {app.job_location}</div>
                    </div>
                    <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'shortlisted' ? 'primary' : app.status === 'rejected' ? 'danger' : 'warning'}`}>
                      {app.status}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="dash-section">
            <div className="dash-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <a href="/jobs" className="quick-action-card card">
                <span className="qa-icon">🔍</span>
                <span className="qa-label">Find Jobs</span>
              </a>
              <a href="/profile" className="quick-action-card card">
                <span className="qa-icon">👤</span>
                <span className="qa-label">Edit Profile</span>
              </a>
              <a href="/applications" className="quick-action-card card">
                <span className="qa-icon">📋</span>
                <span className="qa-label">Applications</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employer Dashboard
  if (user?.role === 'employer') {
    return (
      <div className="container page">
        <div className="page-header">
          <h1>Employer Dashboard 🏢</h1>
          <p>{profile?.company_name || 'Your Company'}</p>
        </div>

        <div className="grid-4 dash-stats">
          <div className="stat-card"><div className="stat-value">{stats?.total_jobs || 0}</div><div className="stat-label">Total Jobs</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.active_jobs || 0}</div><div className="stat-label">Active Jobs</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.total_applications || 0}</div><div className="stat-label">Applications</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.closed_jobs || 0}</div><div className="stat-label">Closed Jobs</div></div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Your Job Postings</h2>
            <a href="/post-job" className="btn btn-primary btn-sm">+ Post New Job</a>
          </div>
          {employerJobs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><h3>No jobs posted</h3><p>Post your first job opening!</p></div>
          ) : (
            <div className="dash-list">
              {employerJobs.map(job => (
                <div key={job.id} className="dash-list-item">
                  <div className="dash-item-info" style={{ flex: 1 }}>
                    <div className="dash-item-title">{job.title}</div>
                    <div className="dash-item-sub">{job.location} • {job.job_type} • {job.application_count} applicants</div>
                  </div>
                  <span className={`badge badge-${job.status === 'active' ? 'success' : 'warning'}`}>{job.status}</span>
                  <a href={`/jobs/${job.id}`} className="btn btn-sm btn-secondary" style={{ marginLeft: 8 }}>View</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    return (
      <div className="container page">
        <div className="page-header">
          <h1>Admin Dashboard ⚙️</h1>
          <p>Platform overview and management</p>
        </div>

        <div className="grid-4 dash-stats">
          <div className="stat-card"><div className="stat-value">{stats?.users?.total || 0}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.users?.seekers || 0}</div><div className="stat-label">Job Seekers</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.jobs?.total || 0}</div><div className="stat-label">Jobs Posted</div></div>
          <div className="stat-card"><div className="stat-value">{stats?.applications?.total || 0}</div><div className="stat-label">Applications</div></div>
        </div>

        <div className="dash-grid">
          <div className="dash-section">
            <h2>Recent Applications</h2>
            <div className="dash-list">
              {stats?.recent_applications?.map(app => (
                <div key={app.id} className="dash-list-item">
                  <div className="dash-item-info">
                    <div className="dash-item-title">{app.seeker_name || 'Unknown'} → {app.job_title}</div>
                    <div className="dash-item-sub">{app.company_name}</div>
                  </div>
                  <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>{app.status}</span>
                </div>
              )) || <p className="empty-state">No data</p>}
            </div>
          </div>
          <div className="dash-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <a href="/admin" className="quick-action-card card"><span className="qa-icon">👥</span><span className="qa-label">Manage Users</span></a>
              <a href="/jobs" className="quick-action-card card"><span className="qa-icon">💼</span><span className="qa-label">Browse Jobs</span></a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
