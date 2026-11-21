import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { t } = useLanguage();
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setServicesOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="main-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'on' : '')}>{t('home')}</NavLink>
      <div className={`dd ${servicesOpen ? 'open' : ''}`} ref={dropdownRef}>
        <button onClick={(e) => { e.preventDefault(); setServicesOpen((v) => !v); }}>
          {t('services')} ▾
        </button>
        <div className="menu">
          <Link to="/lost-found">{t('lostFound')}</Link>
          <Link to="/complaints">{t('complain')}</Link>
          <Link to="/schedules">{t('schedules')}</Link>
          <Link to="/routes">{t('routes')}</Link>
          <Link to="/services">{t('walkIn')}</Link>
        </div>
      </div>
      <NavLink to="/announcements" className={({ isActive }) => (isActive ? 'on' : '')}>{t('announcements')}</NavLink>
      <NavLink to="/about" className={({ isActive }) => (isActive ? 'on' : '')}>{t('about')}</NavLink>
      <NavLink to="/contact" className={({ isActive }) => (isActive ? 'on' : '')}>{t('contact')}</NavLink>
    </nav>
  );
}

