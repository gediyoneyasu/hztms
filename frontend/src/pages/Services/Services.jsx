import { useLanguage } from '../../context/LanguageContext.jsx';
import './Services.css';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { icon: '🎫', title: t('svcSeatTitle'), body: t('svcSeatBody') },
    { icon: '🔍', title: t('svcLostTitle'), body: t('svcLostBody') },
    { icon: '📝', title: t('svcCompTitle'), body: t('svcCompBody') },
    { icon: '🚶', title: t('svcWalkTitle'), body: t('svcWalkBody') },
  ];

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>{t('svcTitle')}</h1>
          <p>{t('svcSub')}</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="grid">
          {services.map((s) => (
            <article key={s.title} className="card lift svc-card">
              <div className="svc-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
