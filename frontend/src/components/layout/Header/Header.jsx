import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import Drawer from '../Drawer/Drawer.jsx';
import './Header.css';

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Language Dropdown State
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // Search Bar State
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (newLang) => {
    setLang(newLang);
    setLangOpen(false);
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="hd">
          {/* 1. Brand Area */}
          <Link to="/" className="brand">
            <span className="logo">🚌</span>
            <div className="brand-text">
              <b>HZTMS</b>
              <small>{t('sub')}</small>
            </div>
          </Link>

          {/* 2. Center Nav */}
          <Navbar />

          {/* 3. Right Actions */}
          <div className="acts">
            
            {/* Search Dropdown Box */}
            <div className="search-wrapper" ref={searchRef}>
              <button className="ibtn" onClick={() => setSearchOpen(!searchOpen)}>
                🔍
              </button>
              
              {searchOpen && (
                <div className="search-dropdown">
                  <input 
                    type="text" 
                    className="header-search-input" 
                    placeholder="Search routes..." 
                    autoFocus
                  />
                </div>
              )}
            </div>

            <Link className="ibtn hide-m" to="/announcements" aria-label="Announcements">
              🔔
            </Link>

            {/* Language Dropdown */}
            <div className={`dd ${langOpen ? 'open' : ''}`} ref={langRef}>
              <button className="ibtn" onClick={() => setLangOpen(!langOpen)}>
                🌐 <span>{lang === 'en' ? 'En' : 'Am'}</span> ▾
              </button>
              
              <div className="menu r">
                <button onClick={() => handleLangSelect('en')}>English (En)</button>
                <button onClick={() => handleLangSelect('am')}>አማርኛ (Am)</button>
              </div>
            </div>

            {user ? (
              <Link to="/dashboard" className="ibtn hide-m" style={{ fontWeight: 'bold' }}>
                👤 {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link to="/auth" className="ibtn hide-m">
                👤 {t('login')}
              </Link>
            )}

            <Link className="btn btn-primary hide-m" to="/schedules">
              🎫 {t('book')}
            </Link>

            <button
              className="ibtn ham"
              aria-label="Menu"
              onClick={() => setDrawerOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
