import { useState, useEffect } from 'react';
import api from '../../services/api';
import './SkillsInput.css';

export default function SkillsInput({ userSkills = [], onUpdate }) {
  const [allSkills, setAllSkills] = useState([]);
  const [selected, setSelected] = useState(userSkills);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/profile/skills/all');
        setAllSkills(data);
      } catch {}
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    setSelected(userSkills);
  }, [userSkills]);

  const toggleSkill = (skillId) => {
    setSelected(prev => {
      const exists = prev.find(s => s.skill_id === skillId || s.id === skillId);
      if (exists) return prev.filter(s => (s.skill_id || s.id) !== skillId);
      return [...prev, { skill_id: skillId, proficiency_level: 'intermediate' }];
    });
  };

  const updateProficiency = (skillId, level) => {
    setSelected(prev =>
      prev.map(s => (s.skill_id || s.id) === skillId ? { ...s, proficiency_level: level } : s)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const skills = selected.map(s => ({
        skill_id: s.skill_id || s.id,
        proficiency_level: s.proficiency_level || 'intermediate'
      }));
      const data = await api.put('/profile/skills', { skills });
      if (onUpdate) onUpdate(data.skills);
    } catch {}
    setSaving(false);
  };

  const filtered = allSkills.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (id) => selected.some(s => (s.skill_id || s.id) === id);

  return (
    <div className="skills-input-container">
      <div className="skills-search">
        <input
          type="text"
          className="input-field"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="skills-available">
        {filtered.slice(0, 20).map(skill => (
          <button
            key={skill.id}
            type="button"
            className={`skill-chip ${isSelected(skill.id) ? 'selected' : ''}`}
            onClick={() => toggleSkill(skill.id)}
          >
            {skill.name}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="selected-skills">
          <h4>Your Skills ({selected.length})</h4>
          {selected.map(s => {
            const skill = allSkills.find(a => a.id === (s.skill_id || s.id));
            return (
              <div key={s.skill_id || s.id} className="selected-skill-item">
                <span className="selected-skill-name">{skill?.name || s.name}</span>
                <select
                  className="proficiency-select"
                  value={s.proficiency_level || 'intermediate'}
                  onChange={(e) => updateProficiency(s.skill_id || s.id, e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button className="remove-skill" onClick={() => toggleSkill(s.skill_id || s.id)}>×</button>
              </div>
            );
          })}
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: '16px' }}>
        {saving ? 'Saving...' : '💾 Save Skills'}
      </button>
    </div>
  );
}
