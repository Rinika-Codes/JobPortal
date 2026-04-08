import { useEffect } from 'react';
import { useJobs } from '../hooks/useJobs';
import JobFilters from '../components/jobs/JobFilters';
import JobCard from '../components/jobs/JobCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function JobSearch() {
  const { jobs, pagination, loading, fetchJobs } = useJobs();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilter = (filters) => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    fetchJobs(params);
  };

  const handlePageChange = (page) => {
    fetchJobs({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Find Your Dream Job</h1>
        <p>Browse {pagination.total || 0} job opportunities</p>
      </div>

      <JobFilters onFilter={handleFilter} />

      {loading ? (
        <LoadingSpinner text="Searching jobs..." />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '32px' }}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
