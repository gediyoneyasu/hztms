import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './Drawer.css';

export default function Drawer({ open, onClose }) {
  const { t } = useLanguage();
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className={`drawer ${open ? 'open' : ''}`}>
      <div className="ov" onClick={onClose} />
      <div className="pn">
        <Link to="/" onClick={onClose}>{t('home')}</Link>

        <div className={`drawer-dd ${servicesOpen ? 'open' : ''}`}>
          <button onClick={() => setServicesOpen((v) => !v)}>
            <span>{t('services')}</span>
            <span className="chevron">▾</span>
          </button>
          <div className="drawer-menu">
            <Link to="/services" onClick={onClose}>{t('lostFound')}</Link>
            <Link to="/services" onClick={onClose}>{t('complain')}</Link>
            <Link to="/schedules" onClick={onClose}>{t('schedules')}</Link>
            <Link to="/routes" onClick={onClose}>{t('routes')}</Link>
            <Link to="/services" onClick={onClose}>{t('walkIn')}</Link>
          </div>
        </div>

        <Link to="/announcements" onClick={onClose}>{t('announcements')}</Link>
        <Link to="/about" onClick={onClose}>{t('about')}</Link>
        <Link to="/contact" onClick={onClose}>{t('contact')}</Link>

        <Link
          to="/schedules"
          onClick={onClose}
          className="btn btn-primary drawer-book"
        >
          🎫 {t('book')}
        </Link>
      </div>
    </div>
  );
}
