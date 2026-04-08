import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markRead, markAllRead } = useNotifications();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = user ? (
    user.role === 'employer' ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/post-job', label: 'Post Job' },
      { href: '/jobs', label: 'Browse Jobs' },
    ] : user.role === 'admin' ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/admin', label: 'Admin Panel' },
      { href: '/jobs', label: 'Browse Jobs' },
    ] : [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/jobs', label: 'Find Jobs' },
      { href: '/applications', label: 'Applications' },
      { href: '/profile', label: 'Profile' },
    ]
  ) : [];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <a href="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          <span className="brand-text">JobPortal</span>
        </a>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="nav-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notifications */}
              <div className="notif-wrapper" ref={notifRef}>
                <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
                  🔔
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>
                {showNotif && (
                  <div className="notif-dropdown glass">
                    <div className="notif-header">
                      <h4>Notifications</h4>
                      {unreadCount > 0 && (
                        <button className="mark-all-btn" onClick={markAllRead}>Mark all read</button>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <p className="notif-empty">No notifications</p>
                      ) : (
                        notifications.slice(0, 8).map(n => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                            onClick={() => markRead(n.id)}
                          >
                            <div className="notif-title">{n.title}</div>
                            <div className="notif-message">{n.message}</div>
                            <div className="notif-time">{getTimeAgo(n.created_at)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="user-menu-wrapper" ref={menuRef}>
                <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
                  <span className="user-avatar">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>
                {showMenu && (
                  <div className="user-dropdown glass">
                    <div className="user-info">
                      <div className="user-email">{user.email}</div>
                      <div className="user-role badge badge-primary">{user.role}</div>
                    </div>
                    <hr className="dropdown-divider" />
                    {user.role === 'seeker' && <a href="/profile" className="dropdown-item">👤 Profile</a>}
                    {user.role === 'employer' && <a href="/dashboard" className="dropdown-item">🏢 Company</a>}
                    <a href="/dashboard" className="dropdown-item">📊 Dashboard</a>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout-btn" onClick={logout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <a href="/login" className="btn btn-secondary btn-sm">Sign In</a>
              <a href="/register" className="btn btn-primary btn-sm">Sign Up</a>
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}
