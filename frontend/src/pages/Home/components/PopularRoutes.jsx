import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './PopularRoutes.css';

const routes = [
  { to: 'Addis Ababa', price: 'ETB 450', tag: 'Express', time: '4h 30m' },
  { to: 'Hawassa', price: 'ETB 300', tag: 'Standard', time: '3h 15m' },
  { to: 'Wolkite', price: 'ETB 250', tag: 'Standard', time: '2h 45m' },
];

const IMG = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

export default function PopularRoutes() {
  const { t } = useLanguage();

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
            <article key={r.to} className="card rc lift">
              <Link to={`/booking?from=Hossana&to=${encodeURIComponent(r.to)}`} className="im">
                <span className="tag">{r.tag}</span>
                <img src={IMG} alt={r.to} />
              </Link>
              <div className="bd">
                <h3>Hossana → {r.to}</h3>
                <div className="meta">
                  <span>🕒 {r.time}</span>
                  <span>🚌 {t('popDaily')}</span>
                </div>
                <div className="rc-foot">
                  <span className="price">{r.price}</span>
                  <Link to={`/booking?from=Hossana&to=${encodeURIComponent(r.to)}`} className="btn btn-primary">
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
