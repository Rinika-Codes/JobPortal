import './Home.css';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: '🔍', title: 'Smart Job Search', desc: 'Search jobs by keywords, location, industry, type, and salary range with advanced filtering.' },
    { icon: '🤖', title: 'AI Match Score', desc: 'Get instant AI-powered compatibility scores between your profile and job requirements.' },
    { icon: '✨', title: 'Cover Letter AI', desc: 'Generate personalized, professional cover letters in seconds using our AI engine.' },
    { icon: '📊', title: 'Skill Gap Analysis', desc: 'Identify missing skills and get personalized learning recommendations.' },
    { icon: '📝', title: 'Application Tracking', desc: 'Track all your applications in one place with real-time status updates.' },
    { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with instant notifications on application status changes.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Jobs' },
    { value: '50K+', label: 'Job Seekers' },
    { value: '5K+', label: 'Companies' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 AI-Powered Job Platform</div>
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Career</span> with AI
          </h1>
          <p className="hero-subtitle">
            Connect with top employers, get AI-powered job matching, generate cover letters,
            and track your applications — all in one premium platform.
          </p>
          <div className="hero-actions">
            {user ? (
              <a href="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</a>
            ) : (
              <>
                <a href="/register" className="btn btn-primary btn-lg">Get Started Free →</a>
                <a href="/jobs" className="btn btn-secondary btn-lg">Browse Jobs</a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to land your dream job or find the perfect candidate</p>
          </div>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className="feature-card card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass">
            <h2>Ready to Accelerate Your Career?</h2>
            <p>Join thousands of professionals who found their dream jobs through our platform.</p>
            <div className="cta-actions">
              <a href="/register" className="btn btn-primary btn-lg">Create Account</a>
              <a href="/register?role=employer" className="btn btn-secondary btn-lg">I'm an Employer</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span>💼</span> <span className="gradient-text">JobPortal</span>
            </div>
            <p className="footer-text">AI-Powered Job Platform • DBMS Course Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
