import { useState, useEffect } from 'react';
import './Notification.css';

let notifId = 0;
const listeners = new Set();

export function showNotification(message, type = 'info', duration = 4000) {
  const notification = { id: ++notifId, message, type, duration };
  listeners.forEach(fn => fn(notification));
}

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handler = (notif) => {
      setNotifications(prev => [...prev, notif]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
      }, notif.duration);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const remove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notif-container">
      {notifications.map(n => (
        <div key={n.id} className={`notif-toast notif-${n.type}`}>
          <span className="notif-toast-icon">
            {n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : n.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <span className="notif-toast-msg">{n.message}</span>
          <button className="notif-toast-close" onClick={() => remove(n.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
