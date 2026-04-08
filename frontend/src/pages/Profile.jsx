import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import SkillsInput from '../components/profile/SkillsInput';
import ResumeUpload from '../components/profile/ResumeUpload';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { showNotification } from '../components/shared/Notification';
import './Profile.css';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState({});
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: '' });
  const [expForm, setExpForm] = useState({ company: '', title: '', location: '', start_date: '', end_date: '', is_current: false, description: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/profile');
        setProfileData(data.profile);
        setSkills(data.skills);
        setEducation(data.education);
        setExperience(data.experience);
        setForm(data.profile);
      } catch {}
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const saveBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', form);
      showNotification('Profile updated!', 'success');
      refreshProfile();
    } catch (err) {
      showNotification(err.message, 'error');
    }
    setSaving(false);
  };

  const addEducation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profile/education', eduForm);
      const data = await api.get('/profile');
      setEducation(data.education);
      setEduForm({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: '' });
      showNotification('Education added!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const deleteEducation = async (id) => {
    try {
      await api.delete(`/profile/education/${id}`);
      setEducation(prev => prev.filter(e => e.id !== id));
      showNotification('Education removed', 'success');
    } catch {}
  };

  const addExperience = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profile/experience', expForm);
      const data = await api.get('/profile');
      setExperience(data.experience);
      setExpForm({ company: '', title: '', location: '', start_date: '', end_date: '', is_current: false, description: '' });
      showNotification('Experience added!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const deleteExperience = async (id) => {
    try {
      await api.delete(`/profile/experience/${id}`);
      setExperience(prev => prev.filter(e => e.id !== id));
      showNotification('Experience removed', 'success');
    } catch {}
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  const tabs = [
    { key: 'basic', label: '👤 Basic Info' },
    { key: 'skills', label: '🛠️ Skills' },
    { key: 'education', label: '🎓 Education' },
    { key: 'experience', label: '💼 Experience' },
    { key: 'resume', label: '📄 Resume' },
  ];

  return (
    <div className="container page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your professional profile</p>
      </div>

      <div className="profile-layout">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button key={tab.key} className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-content glass">
          {activeTab === 'basic' && (
            <form onSubmit={saveBasic} className="profile-form">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Full Name</label>
                  <input className="input-field" value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} />
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Headline</label>
                  <input className="input-field" value={form.headline || ''} onChange={e => setForm({...form, headline: e.target.value})} placeholder="e.g. Full Stack Developer" />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input className="input-field" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input className="input-field" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Summary</label>
                  <textarea className="input-field" rows="4" value={form.summary || ''} onChange={e => setForm({...form, summary: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>LinkedIn URL</label>
                  <input className="input-field" value={form.linkedin_url || ''} onChange={e => setForm({...form, linkedin_url: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>GitHub URL</label>
                  <input className="input-field" value={form.github_url || ''} onChange={e => setForm({...form, github_url: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 20 }}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'skills' && (
            <div>
              <h2>Skills & Expertise</h2>
              <SkillsInput userSkills={skills} onUpdate={setSkills} />
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h2>Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="profile-item card">
                  <div className="profile-item-info">
                    <h3>{edu.degree} in {edu.field_of_study}</h3>
                    <p>{edu.institution}</p>
                    <span className="profile-item-date">
                      {edu.start_date?.substring(0, 7)} → {edu.end_date?.substring(0, 7) || 'Present'}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </span>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteEducation(edu.id)}>×</button>
                </div>
              ))}
              <form onSubmit={addEducation} className="profile-add-form card" style={{ marginTop: 16 }}>
                <h3>Add Education</h3>
                <div className="form-grid">
                  <div className="input-group"><label>Institution</label><input className="input-field" value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} required /></div>
                  <div className="input-group"><label>Degree</label><input className="input-field" value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} required /></div>
                  <div className="input-group"><label>Field of Study</label><input className="input-field" value={eduForm.field_of_study} onChange={e => setEduForm({...eduForm, field_of_study: e.target.value})} /></div>
                  <div className="input-group"><label>GPA</label><input className="input-field" type="number" step="0.01" value={eduForm.gpa} onChange={e => setEduForm({...eduForm, gpa: e.target.value})} /></div>
                  <div className="input-group"><label>Start Date</label><input className="input-field" type="date" value={eduForm.start_date} onChange={e => setEduForm({...eduForm, start_date: e.target.value})} /></div>
                  <div className="input-group"><label>End Date</label><input className="input-field" type="date" value={eduForm.end_date} onChange={e => setEduForm({...eduForm, end_date: e.target.value})} /></div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>+ Add Education</button>
              </form>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <h2>Work Experience</h2>
              {experience.map(exp => (
                <div key={exp.id} className="profile-item card">
                  <div className="profile-item-info">
                    <h3>{exp.title}</h3>
                    <p>{exp.company} • {exp.location}</p>
                    <span className="profile-item-date">
                      {exp.start_date?.substring(0, 7)} → {exp.is_current ? 'Present' : exp.end_date?.substring(0, 7)}
                    </span>
                    {exp.description && <p className="profile-item-desc">{exp.description}</p>}
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteExperience(exp.id)}>×</button>
                </div>
              ))}
              <form onSubmit={addExperience} className="profile-add-form card" style={{ marginTop: 16 }}>
                <h3>Add Experience</h3>
                <div className="form-grid">
                  <div className="input-group"><label>Company</label><input className="input-field" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} required /></div>
                  <div className="input-group"><label>Title</label><input className="input-field" value={expForm.title} onChange={e => setExpForm({...expForm, title: e.target.value})} required /></div>
                  <div className="input-group"><label>Location</label><input className="input-field" value={expForm.location} onChange={e => setExpForm({...expForm, location: e.target.value})} /></div>
                  <div className="input-group"><label>Start</label><input className="input-field" type="date" value={expForm.start_date} onChange={e => setExpForm({...expForm, start_date: e.target.value})} /></div>
                  <div className="input-group"><label>End</label><input className="input-field" type="date" value={expForm.end_date} onChange={e => setExpForm({...expForm, end_date: e.target.value})} disabled={expForm.is_current} /></div>
                  <div className="input-group" style={{ justifyContent: 'center' }}>
                    <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={expForm.is_current} onChange={e => setExpForm({...expForm, is_current: e.target.checked})} /> Currently working here
                    </label>
                  </div>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}><label>Description</label><textarea className="input-field" rows="3" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} /></div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>+ Add Experience</button>
              </form>
            </div>
          )}

          {activeTab === 'resume' && (
            <div>
              <h2>Resume Management</h2>
              <ResumeUpload currentUrl={profileData?.resume_url} onUpload={(url) => setProfileData({...profileData, resume_url: url})} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
