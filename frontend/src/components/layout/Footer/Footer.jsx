import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap fg">
        <div>
          <div className="display">🚌 HZHBRS</div>
          <p className="ftr-note">
            Hadiyaa Zone Hossana Bus Reservation System — the official way to
            reserve your seat.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/routes">Routes</Link></li>
            <li><Link to="/schedules">Schedules</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div>
          <h4>Information</h4>
          <ul>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>📍 Hossana Bus Station</li>
            <li>📞 +251 46 000 0000</li>
            <li>✉️ info@hzhbrs.et</li>
          </ul>
        </div>
      </div>

      <div className="copy">
        © {new Date().getFullYear()} Hadiyaa Zone Transport Authority
      </div>
    </footer>
  );
}
