import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './HowItWorks.css';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    { n: 1, title: t('howStep1Title'), body: t('howStep1Body') },
    { n: 2, title: t('howStep2Title'), body: t('howStep2Body') },
    { n: 3, title: t('howStep3Title'), body: t('howStep3Body') },
  ];

  return (
    <section className="s how">
      <div className="wrap">
        <div className="sh">
          <div>
            <div className="eyebrow">{t('howEyebrow')}</div>
            <h2>{t('howTitle')}</h2>
          </div>
        </div>

        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className="card step">
              <div className="n">{s.n}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/booking')}>
            {t('bookBtn')} →
          </button>
        </div>
      </div>
    </section>
  );
}
