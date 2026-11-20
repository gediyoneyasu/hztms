import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/constants.js';
import './Announcements.css';

export default function Announcements() {
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
          <h1>Station Announcements</h1>
          <p>Live updates from Hossana Bus Station management.</p>
        </div>
      </div>

      <section className="s wrap">
        {items.length > 0 && (
          <div className="grid">
            {items.map((a) => (
              <article key={a._id} className="card lift ann-card">
                <div className="eyebrow">{a.date}</div>
                <h3>{a.title}</h3>
                <p className="muted">{a.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
