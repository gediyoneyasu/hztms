import './About.css';

export default function About() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>About HZTMS</h1>
          <p>The official reservation platform for Hadiyaa Zone Hossana Bus Station.</p>
        </div>
      </div>

      <section className="s wrap about-section">
        
        {/* Intro */}
        <div className="about-intro">
          <p>
            The Hadiyaa Zone Hossana Bus Reservation System (HZTMS) connects travellers 
            with licensed bus operators serving Hossana and the wider Hadiyaa Zone. 
            Our mission is to make intercity bus travel safe, transparent, and convenient for everyone.
          </p>
        </div>

        {/* Core Values / Cards */}
        <div className="about-grid">
          <div className="card about-card">
            <div className="about-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To digitalize and streamline transport operations, replacing manual processes with automated workflows for a seamless passenger experience.</p>
          </div>
          <div className="card about-card">
            <div className="about-icon">🤝</div>
            <h3>Our Vision</h3>
            <p>To be a reference implementation for cloud-based, mobile-friendly transport platforms across the Central Ethiopia Regional State.</p>
          </div>
          <div className="card about-card">
            <div className="about-icon">🛡️</div>
            <h3>Our Commitment</h3>
            <p>We work closely with the Hadiyaa Zone Transport Authority to ensure accurate schedules, fair fares, and reliable seat reservations.</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="about-benefits">
          <h2>Why Use HZTMS?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <span>✅</span>
              <div>
                <b>Drastic reduction in queues</b>
                <p>24/7 online booking from anywhere.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span>✅</span>
              <div>
                <b>Transparent fares</b>
                <p>Published prices ensure no overcharging at the terminal.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span>✅</span>
              <div>
                <b>Real-time visibility</b>
                <p>Track trip status and schedule updates instantly.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span>✅</span>
              <div>
                <b>Automated reconciliation</b>
                <p>Downloadable financial reports for management.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
