import { Link } from 'react-router-dom';
import './Routes.css';

const routes = [
  { to: 'Addis Ababa', price: 'ETB 450', time: '4h 30m', freq: 'Every 3 hours' },
  { to: 'Hawassa', price: 'ETB 300', time: '3h 15m', freq: 'Every 5 hours' },
  { to: 'Wolkite', price: 'ETB 250', time: '2h 45m', freq: 'Twice daily' },
  { to: 'Butajira', price: 'ETB 200', time: '2h 00m', freq: 'Daily 08:00' },
];

export default function RoutesPage() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>Routes & Fares</h1>
          <p>All buses depart from Hossana Bus Station unless otherwise noted.</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="grid">
          {routes.map((r) => (
            <div key={r.to} className="card lift route-card">
              <div className="eyebrow">Route</div>
              <h3>Hossana → {r.to}</h3>
              <div className="meta">
                <span>🕒 {r.time}</span>
                <span>🚌 {r.freq}</span>
              </div>
              <div className="route-foot">
                <span className="price">{r.price}</span>
                <Link to="/schedules" className="btn btn-outline">Schedules</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
