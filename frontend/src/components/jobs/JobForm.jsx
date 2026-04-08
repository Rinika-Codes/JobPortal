import { useState, useEffect } from 'react';
import api from '../../services/api';
import './JobForm.css';

export default function JobForm({ onSubmit, initialData = null, loading = false }) {
  const [allSkills, setAllSkills] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', location: '', job_type: 'full-time',
    industry: 'Technology', salary_min: '', salary_max: '',
    qualifications: '', responsibilities: '', benefits: '', deadline: '',
    skills: [],
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/profile/skills/all');
        setAllSkills(data);
      } catch {}
    };
    fetchSkills();
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSkill = (skillId, importance = 'required') => {
    setForm(prev => {
      const exists = prev.skills.find(s => s.skill_id === skillId);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s.skill_id !== skillId) };
      }
      return { ...prev, skills: [...prev.skills, { skill_id: skillId, importance }] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const grouped = allSkills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Job Title *</label>
          <input className="input-field" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required />
        </div>
        <div className="input-group">
          <label>Location</label>
          <input className="input-field" name="location" value={form.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
        </div>
        <div className="input-group">
          <label>Job Type</label>
          <select className="input-field" name="job_type" value={form.job_type} onChange={handleChange}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div className="input-group">
          <label>Minimum Salary ($)</label>
          <input className="input-field" name="salary_min" type="number" value={form.salary_min} onChange={handleChange} placeholder="e.g. 80000" />
        </div>
        <div className="input-group">
          <label>Maximum Salary ($)</label>
          <input className="input-field" name="salary_max" type="number" value={form.salary_max} onChange={handleChange} placeholder="e.g. 150000" />
        </div>
        <div className="input-group">
          <label>Industry</label>
          <input className="input-field" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology" />
        </div>
        <div className="input-group">
          <label>Application Deadline</label>
          <input className="input-field" name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Description *</label>
          <textarea className="input-field" name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe the role..." required />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Qualifications</label>
          <textarea className="input-field" name="qualifications" value={form.qualifications} onChange={handleChange} rows="3" placeholder="Required qualifications..." />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Responsibilities</label>
          <textarea className="input-field" name="responsibilities" value={form.responsibilities} onChange={handleChange} rows="3" placeholder="Key responsibilities..." />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Benefits</label>
          <textarea className="input-field" name="benefits" value={form.benefits} onChange={handleChange} rows="2" placeholder="What you offer..." />
        </div>
      </div>

      <div className="form-skills-section">
        <h3>Required Skills</h3>
        <p className="text-muted">Select skills needed for this position</p>
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category} className="skill-category">
            <h4>{category}</h4>
            <div className="skills-chips">
              {skills.map(skill => {
                const selected = form.skills.find(s => s.skill_id === skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    className={`skill-chip ${selected ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    {skill.name}
                    {selected && <span className="chip-x">×</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
        {loading ? 'Posting...' : initialData ? 'Update Job' : '🚀 Post Job'}
      </button>
    </form>
  );
}
