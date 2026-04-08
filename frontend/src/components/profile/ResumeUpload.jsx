import { useState } from 'react';
import api from '../../services/api';
import { showNotification } from '../shared/Notification';

export default function ResumeUpload({ currentUrl, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const data = await api.upload('/profile/resume', formData);
      showNotification('Resume uploaded successfully!', 'success');
      if (onUpload) onUpload(data.resume_url);
    } catch (err) {
      showNotification(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        📄 Resume
      </h3>
      {currentUrl && (
        <div style={{ marginBottom: '12px' }}>
          <a href={currentUrl} target="_blank" rel="noreferrer" className="badge badge-success" style={{ textDecoration: 'none' }}>
            ✓ Resume uploaded
          </a>
        </div>
      )}
      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : currentUrl ? '🔄 Replace Resume' : '📤 Upload Resume'}
        <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
      </label>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>PDF, DOC, DOCX (Max 5MB)</p>
    </div>
  );
}
