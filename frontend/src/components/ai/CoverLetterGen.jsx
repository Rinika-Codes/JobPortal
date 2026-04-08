import { useState } from 'react';
import aiService from '../../services/ai.service';
import './CoverLetterGen.css';

export default function CoverLetterGen({ jobId }) {
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await aiService.generateCoverLetter(jobId);
      setLetter(data.cover_letter);
    } catch {
      setLetter('Failed to generate cover letter. Please try again.');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cover-letter-gen">
      {!letter ? (
        <button className="btn btn-secondary" onClick={generate} disabled={loading}>
          {loading ? (
            <>⏳ Generating with AI...</>
          ) : (
            <>✨ Generate Cover Letter</>
          )}
        </button>
      ) : (
        <div className="cover-letter-card glass">
          <div className="cl-header">
            <h3>✨ AI-Generated Cover Letter</h3>
            <div className="cl-actions">
              <button className="btn btn-sm btn-secondary" onClick={copyToClipboard}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={generate}>
                🔄 Regenerate
              </button>
            </div>
          </div>
          <div className="cl-content">
            {letter.split('\n').map((line, i) => (
              <p key={i}>{line || <br />}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
