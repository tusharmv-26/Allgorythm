import React from 'react';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-container fade-in">
      
      {/* 1. Navigation Bar */}
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="nav-logo mono text-gradient-cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', verticalAlign: 'middle'}}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            SENTINEL_MESH
          </div>
          <div className="nav-links">
            <a href="#features">FEATURES</a>
            <a href="#architecture">ARCHITECTURE</a>
            <a href="#integrations">INTEGRATIONS</a>
          </div>
          <button className="nav-btn btn-glow" onClick={onEnter}>
            SIGN IN
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="topo-overlay"></div>
        <div className="glow-orb" style={{ top: '20%', left: '10%' }}></div>
        <div className="glow-orb-purple" style={{ bottom: '10%', right: '20%' }}></div>

        <div className="hero-content">
          <h1 className="hero-title slide-down" style={{animationDelay: '0.1s'}}>
            Autonomous <br/>
            <span className="text-gradient-cyan">Cloud Defense.</span>
          </h1>
          
          <div className="search-bar-wrapper slide-down" style={{animationDelay: '0.3s'}}>
            <input type="text" className="mock-search" placeholder="Query threat intel network..." disabled />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="hero-actions slide-down" style={{animationDelay: '0.5s'}}>
            <button className="btn-glow hero-btn-main" onClick={onEnter}>
              INITIALIZE SYSTEM
            </button>
            <a href="#architecture" className="hero-link">View Architecture</a>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="features-section">
        <div className="features-header">
          <h3 className="section-subtitle">CORE CAPABILITIES</h3>
          <h2 className="section-title">Intelligent Protection</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-cyan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h4>Behavioral Engine</h4>
            <p>Built-in time-velocity heuristics dynamically score attacker IPs before they cause damage.</p>
          </div>

          <div className="feature-card highlighted-card">
            <div className="feature-icon-wrapper bg-amber">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h4>Auto Self-Healing</h4>
            <p>Boto3 integration orchestrates real-time EC2 security group restrictions instantly locking out hackers.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h4>Similarity Mapping</h4>
            <p>Utilizing SequenceMatchers to correlate honeypot probes to active real-world backend assets.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h4>Grok AI Auditing</h4>
            <p>xAI Grok translation engine abstracts thousands of telemetry logs into plain-English security reports.</p>
          </div>
        </div>
      </section>

      {/* 4. Architecture Section */}
      <section id="architecture" className="arch-section">
        <div className="features-header">
          <h3 className="section-subtitle">THE PIPELINE</h3>
          <h2 className="section-title">Zero-Latency Flow</h2>
          <p style={{color: 'var(--text-secondary)', maxWidth: '600px', margin: '16px auto 0'}}>Watch how SentinelMesh catches an attacker passing through Amazon API Gateways down to intelligent React visualization.</p>
        </div>

        <div className="arch-flow">
          <div className="arch-node">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            <span>ATTACKER</span>
          </div>
          <div className="arch-node">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <span>AWS S3 / SNS</span>
          </div>
          <div className="arch-node">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>LAMBDA PROC</span>
          </div>
          <div className="arch-node" style={{borderColor: 'var(--accent-cyan)'}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>FASTAPI ENGINE</span>
          </div>
          <div className="arch-node">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>REACT HUD</span>
          </div>
        </div>
      </section>

      {/* 5. Integrations / Tech Stack */}
      <section id="integrations" className="tech-section">
        <h3 className="section-subtitle">ENTERPRISE STACK</h3>
        <h2 className="section-title">Built with Precision</h2>
        
        <div className="tech-grid">
          <div className="tech-badge"><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" height="16" /> AWS EC2</div>
          <div className="tech-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg> Boto3 Client</div>
          <div className="tech-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> FastAPI Engine</div>
          <div className="tech-badge"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" height="16" /> React 18</div>
          <div className="tech-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg> Python 3.11</div>
          <div className="tech-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> xAI Grok LLM</div>
        </div>
      </section>

      {/* 6. CTA Bottom */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to secure your perimeter?</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px'}}>Deploy SentinelMesh and watch hackers get locked out in real-time.</p>
          <button className="btn-glow hero-btn-main" onClick={onEnter} style={{padding: '20px 48px', fontSize: '16px'}}>
            LAUNCH DASHBOARD
          </button>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="mono text-gradient-cyan" style={{ fontSize: '18px', fontWeight: 700 }}>SENTINEL_MESH</div>
          <p>© 2024 SentinelMesh Intelligence. Symbiot Hackathon Deployment.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
