import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import MatchScore from '../components/ai/MatchScore';
import CoverLetterGen from '../components/ai/CoverLetterGen';
import SkillGap from '../components/ai/SkillGap';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { showNotification } from '../components/shared/Notification';
import './JobDetail.css';

export default function JobDetail() {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [jobApps, setJobApps] = useState([]);

  // Get job ID from URL
  const jobId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${jobId}`);
        setJob(data.job);
        setSkills(data.skills);

        // Check if already applied
        if (user?.role === 'seeker') {
          try {
            const apps = await api.get('/applications');
            const hasApplied = apps.some(a => a.job_id === parseInt(jobId));
            setApplied(hasApplied);
          } catch {}
        }

        // Get applications if employer
        if (user?.role === 'employer') {
          try {
            const apps = await api.get(`/applications/job/${jobId}`);
            setJobApps(apps);
          } catch {}
        }
      } catch {
        showNotification('Failed to load job', 'error');
      }
      setLoading(false);
    };
    fetchJob();
  }, [jobId, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post('/applications', { job_id: parseInt(jobId), cover_letter: coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      showNotification('Application submitted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
    setApplying(false);
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setJobApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      showNotification(`Application ${status}`, 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading job details..." />;
  if (!job) return <div className="container page"><div className="empty-state"><h3>Job not found</h3></div></div>;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    const fmt = n => `$${(n/1000).toFixed(0)}K`;
    return min && max ? `${fmt(min)} - ${fmt(max)}/year` : min ? `From ${fmt(min)}/year` : `Up to ${fmt(max)}/year`;
  };

  return (
    <div className="container page">
      <div className="jd-layout">
        <div className="jd-main">
          <div className="jd-header glass">
            <div className="jd-company-logo">
              {job.company_name?.[0] || 'C'}
            </div>
            <div className="jd-header-info">
              <h1>{job.title}</h1>
              <p className="jd-company">{job.company_name}</p>
              <div className="jd-meta">
                <span>📍 {job.location || 'Remote'}</span>
                <span>💼 {job.job_type?.replace('-', ' ')}</span>
                <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                {job.deadline && <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>

          <div className="jd-section">
            <h2>📋 Description</h2>
            <div className="jd-text">{job.description}</div>
          </div>

          {job.qualifications && (
            <div className="jd-section">
              <h2>🎓 Qualifications</h2>
              <div className="jd-text">{job.qualifications}</div>
            </div>
          )}

          {job.responsibilities && (
            <div className="jd-section">
              <h2>🎯 Responsibilities</h2>
              <div className="jd-text">{job.responsibilities}</div>
            </div>
          )}

          {job.benefits && (
            <div className="jd-section">
              <h2>🎁 Benefits</h2>
              <div className="jd-text">{job.benefits}</div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="jd-section">
              <h2>🛠️ Required Skills</h2>
              <div className="jd-skills">
                {skills.map((s, i) => (
                  <span key={i} className={`badge badge-${s.importance === 'required' ? 'primary' : s.importance === 'preferred' ? 'info' : 'warning'}`}>
                    {s.name} ({s.importance})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Employer: Applications */}
          {user?.role === 'employer' && jobApps.length > 0 && (
            <div className="jd-section">
              <h2>📨 Applications ({jobApps.length})</h2>
              <div className="jd-apps-list">
                {jobApps.map(app => (
                  <div key={app.id} className="jd-app-item card">
                    <div className="jd-app-info">
                      <div className="jd-app-name">{app.full_name || app.email}</div>
                      <div className="jd-app-sub">{app.headline || app.skills_list?.substring(0, 60)}</div>
                    </div>
                    <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>{app.status}</span>
                    <div className="jd-app-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => updateAppStatus(app.id, 'shortlisted')}>⭐</button>
                      <button className="btn btn-sm btn-primary" onClick={() => updateAppStatus(app.id, 'accepted')}>✅</button>
                      <button className="btn btn-sm btn-danger" onClick={() => updateAppStatus(app.id, 'rejected')}>❌</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="jd-sidebar">
          {user?.role === 'seeker' && (
            <>
              {applied ? (
                <div className="jd-applied-card glass">
                  <span style={{ fontSize: 28 }}>✅</span>
                  <h3>Applied!</h3>
                  <p>Your application has been submitted.</p>
                  <a href="/applications" className="btn btn-secondary btn-sm">Track Application</a>
                </div>
              ) : (
                <div className="glass" style={{ padding: 20 }}>
                  {!showApplyForm ? (
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowApplyForm(true)}>
                      🚀 Apply Now
                    </button>
                  ) : (
                    <form onSubmit={handleApply}>
                      <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--text-primary)' }}>Apply for this job</h3>
                      <div className="input-group">
                        <label>Cover Letter (optional)</label>
                        <textarea className="input-field" rows="5" placeholder="Why are you a good fit?" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={applying}>
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              <MatchScore jobId={parseInt(jobId)} />
              <SkillGap jobId={parseInt(jobId)} />
              <CoverLetterGen jobId={parseInt(jobId)} />
            </>
          )}

          <div className="jd-company-card glass">
            <h3>About {job.company_name}</h3>
            {job.company_description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{job.company_description.substring(0, 200)}</p>}
            {job.website && <a href={job.website} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary" style={{ marginTop: 12 }}>🌐 Website</a>}
            <div className="jd-company-details">
              {job.company_location && <span>📍 {job.company_location}</span>}
              {job.company_size && <span>👥 {job.company_size}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
