import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { API_URL } from '../../utils/constants.js';
import './Announcements.css';

export default function Announcements() {
  const { lang } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/announcements`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wrap s">Loading...</div>;

  return (
    <>
      <div className="banner">
        <div className="wrap">
          {/* Bilingual Banner */}
          <h1>{lang === 'am' ? 'የጣቢያ ማስታወቂያዎች' : 'Station Announcements'}</h1>
          <p>{lang === 'am' ? 'ከሆሳና አውቶቡስ ጣቢያ አስተዳደር የቀጥታ ዝመናዎች።' : 'Live updates from Hossana Bus Station management.'}</p>
        </div>
      </div>

      <section className="s wrap">
        {items.length > 0 && (
          <div className="grid">
            {items.map((a) => (
              <article key={a._id} className="card lift ann-card">
                {a.image && <img className="ann-photo" src={a.image} alt="" />}
                <div className="eyebrow">{a.date}</div>
                
                {/* Bilingual Title and Body */}
                <h3>
                  {lang === 'am' && a.title_am ? a.title_am : (a.title_en || a.title)}
                </h3>
                <p className="muted">
                  {lang === 'am' && a.body_am ? a.body_am : (a.body_en || a.body)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
