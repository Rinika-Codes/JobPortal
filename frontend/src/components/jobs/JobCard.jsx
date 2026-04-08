import './JobCard.css';

export default function JobCard({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    const fmt = (n) => `$${(n / 1000).toFixed(0)}K`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    return min ? `From ${fmt(min)}` : `Up to ${fmt(max)}`;
  };

  const timeAgo = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const typeColors = {
    'full-time': 'badge-success',
    'part-time': 'badge-warning',
    'contract': 'badge-info',
    'internship': 'badge-primary',
    'remote': 'badge-primary'
  };

  return (
    <a href={`/jobs/${job.id}`} className="job-card card">
      <div className="job-card-header">
        <div className="job-company-logo">
          {job.logo_url ? (
            <img src={job.logo_url} alt={job.company_name} />
          ) : (
            <span>{job.company_name?.[0] || 'C'}</span>
          )}
        </div>
        <div className="job-card-meta">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.company_name}</p>
        </div>
      </div>

      <div className="job-card-details">
        <span className="job-detail-item">📍 {job.location || 'Remote'}</span>
        <span className="job-detail-item">💰 {formatSalary(job.salary_min, job.salary_max)}</span>
      </div>

      <div className="job-card-tags">
        <span className={`badge ${typeColors[job.job_type] || 'badge-primary'}`}>
          {job.job_type?.replace('-', ' ')}
        </span>
        {job.skills_list?.split(', ').slice(0, 3).map((skill, i) => (
          <span key={i} className="badge badge-info">{skill}</span>
        ))}
      </div>

      <div className="job-card-footer">
        <span className="job-posted">{timeAgo(job.created_at)}</span>
        {job.application_count !== undefined && (
          <span className="job-applicants">{job.application_count} applicants</span>
        )}
      </div>
    </a>
  );
}
