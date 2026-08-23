import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    title: 'Hazard-to-response mapping',
    text: 'Combines historical disaster trends with current district conditions to estimate likely operational impact before teams move.',
  },
  {
    title: 'Field deployability check',
    text: 'Evaluates whether resources can actually move by factoring in route status, communication resilience, team availability, and equipment readiness.',
  },
  {
    title: 'Capability gap detection',
    text: 'Highlights damaged routes, under-staffed teams, blocked assets, and degraded communication that reduce real response capability.',
  },
  {
    title: 'AI command briefing',
    text: 'Generates a district commander brief with readiness score, critical gaps, and priority actions to recover capability first.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-wrap">
          <div className="brand-mark">D</div>
          <div>
            <div className="brand-name">DRISHTI</div>
            <div className="brand-sub">DRAA • Dynamic Response Assurance & Analytics</div>
          </div>
        </div>

        <button className="primary-btn" onClick={() => navigate('/login')}>Open console</button>
      </header>

      <main className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Scenario-driven disaster intelligence</span>
          <h1>
            What can <span>actually deploy</span> right now?
          </h1>
          <p>
            DRISHTI combines historical disaster intelligence, district-level scenario conditions, and live resource status to answer whether response capability is truly deployable in the field.
          </p>

          <div className="cta-row">
            <button className="primary-btn large" onClick={() => navigate('/login')}>Start simulation</button>
            <button className="secondary-btn large" onClick={() => navigate('/login')}>View dashboard</button>
          </div>

          <div className="mini-stats">
            <div>
              <strong>783</strong>
              <span>Historical disaster records</span>
            </div>
            <div>
              <strong>67%</strong>
              <span>Sample deployability baseline</span>
            </div>
            <div>
              <strong>3 data feeds</strong>
              <span>Flood, lightning, disaster events</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="signal-card">
            <div className="signal-row">
              <span className="signal-dot green" />
              <span>Operational state</span>
            </div>
            <h3>Moderate readiness</h3>
            <div className="score-pill">71 / 100</div>
            <ul>
              <li>Road networks: degraded in 3 districts</li>
              <li>Communication backup: partially restored</li>
              <li>Rescue teams: 8 deployable units</li>
            </ul>
          </div>
        </div>
      </main>

      <section className="feature-showcase">
        <div className="section-header">
          <span className="eyebrow">AapdaNetra core feature</span>
          <h2>Scenario-based assessment of operational readiness and deployable disaster response capability</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card, index) => (
            <article className="feature-item" key={card.title}>
              <span className="feature-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="portal-footer">
        <p>Simulated operational data based on public disaster management reports and historical event datasets.</p>
      </footer>
    </div>
  );
};

export default HomePage;
