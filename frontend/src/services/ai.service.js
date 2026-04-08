import api from './api';

export const aiService = {
  getMatchScore: (job_id) => api.post('/ai/match-score', { job_id }),
  generateCoverLetter: (job_id) => api.post('/ai/cover-letter', { job_id }),
  getSkillGap: (job_id) => api.post('/ai/skill-gap', { job_id }),
  parseResume: (resume_text) => api.post('/ai/parse-resume', { resume_text }),
};

export default aiService;
