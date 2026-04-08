import { useState } from 'react';
import api from '../services/api';
import JobForm from '../components/jobs/JobForm';
import { showNotification } from '../components/shared/Notification';

export default function PostJob() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await api.post('/jobs', formData);
      showNotification('Job posted successfully!', 'success');
      window.location.href = `/jobs/${result.id}`;
    } catch (err) {
      showNotification(err.message || 'Failed to post job', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Create a job listing to find the perfect candidate</p>
      </div>

      <div className="glass" style={{ padding: '32px', maxWidth: '800px' }}>
        <JobForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
