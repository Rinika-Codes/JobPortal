import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { showNotification } from '../components/shared/Notification';
import './Admin.css';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/stats')
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleUser = async (id, isActive) => {
    try {
      await api.put(`/admin/users/${id}/status`, { is_active: !isActive });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u));
      showNotification(`User ${!isActive ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin panel..." />;

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors = { seeker: 'badge-info', employer: 'badge-primary', admin: 'badge-warning' };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage users and monitor platform activity</p>
      </div>

      {stats && (
        <div className="grid-4 dash-stats" style={{ marginBottom: 32 }}>
          <div className="stat-card"><div className="stat-value">{stats.users?.total || 0}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value">{stats.jobs?.active || 0}</div><div className="stat-label">Active Jobs</div></div>
          <div className="stat-card"><div className="stat-value">{stats.applications?.total || 0}</div><div className="stat-label">Applications</div></div>
          <div className="stat-card"><div className="stat-value">{stats.users?.employers || 0}</div><div className="stat-label">Employers</div></div>
        </div>
      )}

      {stats?.top_industries?.length > 0 && (
        <div className="admin-section glass" style={{ marginBottom: 24 }}>
          <h2>📊 Top Industries</h2>
          <div className="industry-bars">
            {stats.top_industries.map((ind, i) => (
              <div key={i} className="industry-bar-item">
                <div className="industry-label">{ind.industry}</div>
                <div className="industry-bar">
                  <div className="industry-fill" style={{ width: `${(ind.count / stats.top_industries[0].count) * 100}%` }}></div>
                </div>
                <span className="industry-count">{ind.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-section glass">
        <div className="admin-section-header">
          <h2>👥 User Management</h2>
          <input
            className="input-field"
            placeholder="Search users..."
            style={{ maxWidth: 250 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name || '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-primary'}`} onClick={() => toggleUser(u.id, u.is_active)}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
