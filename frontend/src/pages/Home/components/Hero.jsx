import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* LEFT SIDE */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="dot"></span> Reliable Transport
          </div>
          
          <h1 className="hero-title">
            Where Journeys<br />
            Meet <span className="highlight">Precision</span>
          </h1>
          
          <p className="hero-subtext">
            We turn travel plans into seamless experiences through modern booking and transparent scheduling.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary-pill" onClick={() => navigate('/schedules')}>
              Explore Trips <span>→</span>
            </button>
            <button className="btn-outline-pill" onClick={() => navigate('/about')}>
              <div className="play-icon">▶</div> How it Works
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">🚌</span>
              <div><b>250+</b><small>Trips Completed</small></div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div><b>1,200+</b><small>Happy Passengers</small></div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <div><b>15+</b><small>Years of Service</small></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80" alt="Bus Travel" className="hero-img" />
          
          <div className="floating-card">
            <h4>Modern Booking <span className="dot green"></span></h4>
            <p>Reserve seats instantly and travel with peace of mind.</p>
            <button className="float-btn" onClick={() => navigate('/schedules')}>+</button>
          </div>
        </div>

      </div>

      {/* FINDER SEARCH BAR */}
      <div className="finder-wrapper">
         <form className="finder" onSubmit={(e) => { e.preventDefault(); navigate('/schedules'); }}>
          <div>
            <label>From</label>
            <select className="field">
              <option>Hossana</option>
              <option>Addis Ababa</option>
              <option>Hawassa</option>
            </select>
          </div>
          <div>
            <label>To</label>
            <select className="field">
              <option>Addis Ababa</option>
              <option>Hossana</option>
              <option>Hawassa</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input className="field" type="date" />
          </div>
          <button className="btn-primary-pill finder-btn" type="submit">
            Search Trips
          </button>
        </form>
      </div>
    </section>
  );
}
