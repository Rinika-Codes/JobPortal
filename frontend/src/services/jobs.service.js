import api from './api';

export const jobsService = {
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/jobs?${query}`);
  },
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/jobs/saved/list'),
};

export default jobsService;
