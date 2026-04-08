import { useState } from 'react';
import aiService from '../../services/ai.service';
import './SkillGap.css';

export default function SkillGap({ jobId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await aiService.getSkillGap(jobId);
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  if (!result) {
    return (
      <button className="btn btn-secondary" onClick={analyze} disabled={loading}>
        {loading ? '⏳ Analyzing...' : '📊 Skill Gap Analysis'}
      </button>
    );
  }

  return (
    <div className="skill-gap-card glass">
      <h3>📊 Skill Gap Analysis</h3>
      <p className="sg-summary">{result.analysis_summary}</p>

      <div className="sg-bar-wrapper">
        <div className="sg-bar">
          <div
            className="sg-bar-fill"
            style={{ width: `${result.coverage_percentage}%` }}
          ></div>
        </div>
        <span className="sg-percentage">{result.coverage_percentage}% Coverage</span>
      </div>

      {result.matched_skills?.length > 0 && (
        <div className="sg-section">
          <h4>✅ Skills You Have</h4>
          <div className="sg-skills">
            {result.matched_skills.map((s, i) => (
              <div key={i} className="sg-skill-item matched">
                <span>{s.name}</span>
                <span className={`badge badge-${s.importance === 'required' ? 'primary' : 'info'}`}>
                  {s.importance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div className="sg-section">
          <h4>📚 Recommendations</h4>
          {result.recommendations.map((rec, i) => (
            <div key={i} className="sg-recommendation">
              <div className="sg-rec-header">
                <span className="sg-rec-skill">{rec.skill}</span>
                <span className={`badge badge-${rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'info'}`}>
                  {rec.priority} priority
                </span>
              </div>
              <p className="sg-rec-text">{rec.suggestion}</p>
              {rec.estimated_time && (
                <span className="sg-rec-time">⏱️ Est. {rec.estimated_time}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
