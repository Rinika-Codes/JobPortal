import { useState } from 'react';
import aiService from '../../services/ai.service';
import './MatchScore.css';

export default function MatchScore({ jobId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkMatch = async () => {
    setLoading(true);
    try {
      const data = await aiService.getMatchScore(jobId);
      setResult(data);
    } catch {
      setResult({ score: 0, error: true });
    }
    setLoading(false);
  };

  if (!result) {
    return (
      <button className="btn btn-secondary" onClick={checkMatch} disabled={loading}>
        {loading ? '⏳ Analyzing...' : '🤖 Check Match Score'}
      </button>
    );
  }

  const getColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--primary-light)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <div className="match-score-card glass">
      <div className="match-header">
        <h3>🤖 AI Match Analysis</h3>
      </div>

      <div className="match-circle-wrapper">
        <div className="match-circle" style={{ '--score-color': getColor(result.score) }}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" className="circle-bg" />
            <circle
              cx="60" cy="60" r="52"
              className="circle-fill"
              style={{
                strokeDasharray: `${(result.score / 100) * 327} 327`,
                stroke: getColor(result.score)
              }}
            />
          </svg>
          <div className="match-score-value">{result.score}%</div>
        </div>
        <p className="match-label" style={{ color: getColor(result.score) }}>{getLabel(result.score)}</p>
      </div>

      {result.matched_skills?.length > 0 && (
        <div className="match-section">
          <h4>✅ Matched Skills</h4>
          <div className="match-tags">
            {result.matched_skills.map((s, i) => (
              <span key={i} className="badge badge-success">{s}</span>
            ))}
          </div>
        </div>
      )}

      {result.missing_skills?.length > 0 && (
        <div className="match-section">
          <h4>⚠️ Missing Skills</h4>
          <div className="match-tags">
            {result.missing_skills.map((s, i) => (
              <span key={i} className="badge badge-warning">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
