import { useState } from 'react';
import './JobFilters.css';

export default function JobFilters({ onFilter, initial = {} }) {
  const [filters, setFilters] = useState({
    keyword: initial.keyword || '',
    location: initial.location || '',
    job_type: initial.job_type || '',
    industry: initial.industry || '',
    sort: initial.sort || 'newest',
  });

  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const cleared = { keyword: '', location: '', job_type: '', industry: '', sort: 'newest' };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <form className="job-filters glass" onSubmit={handleSubmit}>
      <div className="filters-row">
        <div className="filter-input-wrapper">
          <span className="filter-icon">🔍</span>
          <input
            type="text"
            name="keyword"
            placeholder="Job title, keyword, or company"
            value={filters.keyword}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        <div className="filter-input-wrapper">
          <span className="filter-icon">📍</span>
          <input
            type="text"
            name="location"
            placeholder="City or Remote"
            value={filters.location}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        <select name="job_type" value={filters.job_type} onChange={handleChange} className="filter-select">
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleChange} className="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary_high">Highest Salary</option>
          <option value="salary_low">Lowest Salary</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
      </div>
    </form>
  );
}
