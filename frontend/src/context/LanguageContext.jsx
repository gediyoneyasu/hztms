import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../utils/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('hztms-lang') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('hztms-lang', lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
