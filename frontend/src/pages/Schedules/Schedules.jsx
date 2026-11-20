import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import Chip from '../../components/ui/Chip/Chip.jsx';
import { API_URL } from '../../utils/constants.js';
import './Schedules.css';

const filters = ['All routes', 'Addis Ababa', 'Hawassa', 'Wolkite'];

export default function Schedules() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('All routes');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/schedules`)
      .then(res => res.json())
      .then(data => setSchedules(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load schedules", err))
      .finally(() => setLoading(false));
  }, []);

  const rows = filter === 'All routes' ? schedules : schedules.filter((s) => s.to === filter);

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>{t('schedules')}</h1>
          <p>{lang === 'am' ? 'ከሆሳና አውቶቡስ ጣቢያ የቀጥታ መነሻዎች።' : 'Live departures from Hossana Bus Station.'}</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="chips">
          {filters.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
          ))}
        </div>

        {loading ? <p className="muted">Loading...</p> : rows.length === 0 ? <p className="muted">{t('noData')}</p> : (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>{t('colBus')}</th><th>{t('colRoute')}</th><th>{t('colDep')}</th><th>{t('colArr')}</th>
                  <th>{t('colFare')}</th><th>{t('colStatus')}</th><th>{t('colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}>
                    <td><b>{r.busId || r._id}</b></td>
                    <td>
                      {lang === 'am' && r.from_am ? r.from_am : (r.from || 'Hossana')} 
                      → 
                      {lang === 'am' && r.to_am ? r.to_am : r.to}
                    </td>
                    <td>{r.departure}</td>
                    <td>{r.arrival}</td>
                    <td className="price">ETB {r.price}</td>
                    <td><span className={`st ${r.status || 'Available'}`}>{r.status || 'Available'}</span></td>
                    <td>
                      {r.status === 'Full' ? (
                        <button className="btn btn-primary" disabled>Full</button>
                      ) : (
                        <Link to={`/booking?scheduleId=${r._id}`} className="btn btn-primary">{t('bookBtn')}</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
