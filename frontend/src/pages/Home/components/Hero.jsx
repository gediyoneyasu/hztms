import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { API_URL } from '../../../utils/constants.js';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [allSchedules, setAllSchedules] = useState([]);
  const [trip, setTrip] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // 1. Fetch data from Admin
  useEffect(() => {
    fetch(`${API_URL}/schedules`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setAllSchedules(list);
        
        // Auto-select the first station and destination
        if (list.length > 0) {
          setTrip(prev => ({
            ...prev,
            from: list[0].from || 'Hossana',
            to: list[0].to
          }));
        }
      })
      .catch(err => console.error("Failed to load schedules:", err));
  }, []);

  // 2. Get the exact list of Stations the Admin added
  const availableStations = [...new Set(allSchedules.map(s => s.from || 'Hossana'))];
  
  // 3. Get the Destinations ONLY for the selected Station
  const availableDestinations = [...new Set(
    allSchedules
      .filter(s => (s.from || 'Hossana') === trip.from)
      .map(s => s.to)
  )];

  // 4. If the user changes the Station, automatically update the Destination to the first available one
  useEffect(() => {
    if (availableDestinations.length > 0 && !availableDestinations.includes(trip.to)) {
      setTrip(prev => ({ ...prev, to: availableDestinations[0] }));
    }
  }, [trip.from, availableDestinations, trip.to]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trip.from || !trip.to) return;
    navigate(`/booking?from=${trip.from}&to=${trip.to}&date=${trip.date}`);
  };

  const scrollToHow = () => {
    document.querySelector('.how')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="dot"></span> {t('heroBadge')}
          </div>
          <h1 className="hero-title">
            {t('heroTitle1')}<br />
            {t('heroTitle2')} <span className="highlight">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="hero-subtext">{t('heroSub')}</p>
          <div className="hero-buttons">
            <button className="btn-primary-pill" onClick={() => navigate('/schedules')}>
              {t('btnExplore')} <span>→</span>
            </button>
            <button className="btn-outline-pill" onClick={scrollToHow}>
              <div className="play-icon">▶</div> {t('btnHow')}
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">🚌</span>
              <div><b>250+</b><small>{t('statTrips')}</small></div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div><b>1,200+</b><small>{t('statPassengers')}</small></div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <div><b>15+</b><small>{t('statYears')}</small></div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80" alt="Bus Travel" className="hero-img" />
          <div className="floating-card">
            <h4>{t('floatTitle')} <span className="dot green"></span></h4>
            <p>{t('floatDesc')}</p>
            <button className="float-btn" onClick={() => navigate('/schedules')}>+</button>
          </div>
        </div>
      </div>

      <div className="finder-wrapper">
        <form className="finder" onSubmit={handleSearch}>
          
          {/* STATION DROPDOWN */}
          <div>
            <label>{t('from')}</label>
            <select 
              className="field" 
              value={trip.from} 
              onChange={(e) => setTrip({ ...trip, from: e.target.value })}
            >
              {availableStations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
          
          {/* DESTINATION DROPDOWN (Filtered) */}
          <div>
            <label>{t('to')}</label>
            <select 
              className="field" 
              value={trip.to} 
              onChange={(e) => setTrip({ ...trip, to: e.target.value })}
            >
              {availableDestinations.length > 0 ? (
                availableDestinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))
              ) : (
                <option disabled>No routes available</option>
              )}
            </select>
          </div>
          
          <div>
            <label>{t('date')}</label>
            <input 
              className="field" 
              type="date" 
              value={trip.date} 
              onChange={(e) => setTrip({ ...trip, date: e.target.value })} 
            />
          </div>
          
          <button className="btn-primary-pill finder-btn" type="submit">
            {t('finderSearchBtn')}
          </button>
        </form>
      </div>
    </section>
  );
}
