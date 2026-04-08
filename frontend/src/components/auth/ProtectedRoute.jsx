import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner spinner-lg">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="empty-icon">🚫</div>
          <h3>Access Denied</h3>
          <p>You don't have permission to view this page.</p>
          <a href="/dashboard" className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return children;
}
