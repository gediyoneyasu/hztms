import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { API_URL, FALLBACK_IMAGE } from '../../../utils/constants.js';
import './PopularRoutes.css';

export default function PopularRoutes() {
  const { t, lang } = useLanguage();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((res) => res.json())
      .then((data) => setRoutes(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setRoutes([]));
  }, []);

  return (
    <section className="popular-section">
      <div className="popular-wrap">
        <div className="popular-header">
          <div className="eyebrow">{t('popEyebrow')}</div>
          <h2>{t('popTitle')}</h2>
          <Link to="/routes" className="btn btn-outline view-all-btn">
            {t('popViewAll')} →
          </Link>
        </div>

        <div className="popular-grid">
          {routes.map((r) => (
            <article key={r._id || r.to} className="card rc lift">
              <Link to={`/booking?from=${encodeURIComponent(r.from || 'Hossana')}&to=${encodeURIComponent(r.to)}`} className="im">
                <span className="tag">{r.frequency || 'Daily'}</span>
                <img src={r.image || FALLBACK_IMAGE} alt={r.to} />
              </Link>
              <div className="bd">
                <h3>{lang === 'am' && r.from_am ? r.from_am : (r.from || 'Hossana')} → {lang === 'am' && r.to_am ? r.to_am : r.to}</h3>
                <div className="meta">
                  <span>🕒 {r.duration}</span>
                  <span>🚌 {lang === 'am' && r.frequency_am ? r.frequency_am : r.frequency}</span>
                </div>
                <div className="rc-foot">
                  <span className="price">ETB {r.price}</span>
                  <Link to={`/booking?from=${encodeURIComponent(r.from || 'Hossana')}&to=${encodeURIComponent(r.to)}`} className="btn btn-primary">
                    {t('bookBtn')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
