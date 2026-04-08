import { useState, useCallback } from 'react';
import jobsService from '../services/jobs.service';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsService.getJobs(params);
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, pagination, loading, error, fetchJobs };
}

export default useJobs;
