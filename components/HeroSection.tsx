'use client';

export function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <div className="hero-badge">
          <span></span> Live Portal — Active Job Openings
        </div>
        <h2>Find Your Dream <em>Engineering Job</em><br />in PSU & Public Sectors</h2>
        <p>One portal for all GATE & Non-GATE engineering jobs — PSUs, Defence, Railways, and more. Apply directly.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">14</div>
            <div className="lbl">Active Jobs</div>
          </div>
          <div className="hero-stat">
            <div className="num">48+</div>
            <div className="lbl">Organisations</div>
          </div>
          <div className="hero-stat">
            <div className="num">12,000+</div>
            <div className="lbl">Total Vacancies</div>
          </div>
          <div className="hero-stat">
            <div className="num">9</div>
            <div className="lbl">Branch Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}
