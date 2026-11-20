import { useLanguage } from '../../context/LanguageContext.jsx';
import './About.css';

export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>{t('aboutTitle')}</h1>
          <p>{t('aboutSub')}</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="card" style={{ padding: 32 }}>
          <p style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.7 }}>{t('aboutBody1')}</p>
          <p style={{ fontSize: 16, lineHeight: 1.7 }}>{t('aboutBody2')}</p>
        </div>
      </section>
    </>
  );
}
