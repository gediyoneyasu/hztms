import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { API_URL } from '../../utils/constants.js';
import './Routes.css';

export default function RoutesPage() {
  const { t, lang } = useLanguage();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then(res => res.json())
      .then(data => setRoutes(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load routes:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>{t('routeTitle')}</h1>
          <p>{t('routeSub')}</p>
        </div>
      </div>

      <section className="s wrap">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : routes.length === 0 ? (
          <p className="muted">{t('noRoutes')}</p>
        ) : (
          <div className="grid">
            {routes.map((r) => (
              <div key={r._id} className="card lift route-card">
                <div className="eyebrow">{t('routeLabel')}</div>
                <h3>
                  {lang === 'am' && r.from_am ? r.from_am : (r.from || 'Hossana')} 
                  → 
                  {lang === 'am' && r.to_am ? r.to_am : r.to}
                </h3>
                <div className="meta">
                  <span>🕒 {r.duration}</span>
                  <span>🚌 {lang === 'am' && r.frequency_am ? r.frequency_am : r.frequency}</span>
                </div>
                <div className="route-foot">
                  <span className="price">{r.price} ETB</span>
                  <Link to={`/booking?from=${r.from || 'Hossana'}&to=${r.to}`} className="btn btn-primary">
                    {t('bookBtn')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
