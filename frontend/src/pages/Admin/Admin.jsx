import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { API_URL } from '../../utils/constants.js';
import { uploadImage } from '../../services/uploadService.js';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form States - Now including _am fields for bilingual support
  const [newRoute, setNewRoute] = useState({ from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', price: '', duration: '', frequency: '', frequency_am: '' });
  const [newSchedule, setNewSchedule] = useState({ busId: '', from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', departure: '', arrival: '', price: '' });
  const [newAnn, setNewAnn] = useState({ title_en: '', title_am: '', date: '', body_en: '', body_am: '' });
  const [routeImage, setRouteImage] = useState(null);
  const [annImage, setAnnImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    Promise.all([
      fetch(`${API_URL}/bookings`).then(r => r.json()),
      fetch(`${API_URL}/schedules`).then(r => r.json()),
      fetch(`${API_URL}/routes`).then(r => r.json()),
      fetch(`${API_URL}/announcements`).then(r => r.json()),
      fetch(`${API_URL}/messages`).then(r => r.json()),
    ]).then(([b, s, r, a, m]) => {
      setBookings(b); setSchedules(s); setRoutes(r); setAnnouncements(a); setMessages(m);
    }).catch(console.error);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') { navigate('/admin-login'); return; }
    fetchAll();
  }, [navigate]);

  const logout = () => { localStorage.removeItem('isAdmin'); navigate('/'); };

  const approveBooking = async (id, status) => {
    await fetch(`${API_URL}/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchAll();
  };

  const addRoute = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const image = routeImage ? await uploadImage(routeImage) : '';
      await fetch(`${API_URL}/routes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newRoute, price: Number(newRoute.price), image }) });
      setNewRoute({ from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', price: '', duration: '', frequency: '', frequency_am: '' });
      setRouteImage(null);
      e.target.reset();
      fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRoute = async (id) => { if (window.confirm('Delete route?')) { await fetch(`${API_URL}/routes/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addSchedule = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/schedules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newSchedule, price: Number(newSchedule.price) }) });
    setNewSchedule({ busId: '', from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', departure: '', arrival: '', price: '' }); fetchAll();
  };

  const deleteSchedule = async (id) => { if (window.confirm('Delete schedule?')) { await fetch(`${API_URL}/schedules/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addAnnouncement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const image = annImage ? await uploadImage(annImage) : '';
      await fetch(`${API_URL}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newAnn, image }) });
      setNewAnn({ title_en: '', title_am: '', date: '', body_en: '', body_am: '' });
      setAnnImage(null);
      e.target.reset();
      fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (id) => { if (window.confirm('Delete announcement?')) { await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' }); fetchAll(); } };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>{t('adminTitle')}</h2>
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>🎫 {t('tabBookings')}</button>
        <button className={tab === 'routes' ? 'active' : ''} onClick={() => setTab('routes')}>🗺️ {t('tabRoutes')}</button>
        <button className={tab === 'schedules' ? 'active' : ''} onClick={() => setTab('schedules')}>🚌 {t('tabSchedules')}</button>
        <button className={tab === 'announcements' ? 'active' : ''} onClick={() => setTab('announcements')}>📢 {t('tabAnnouncements')}</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>✉️ {t('tabMessages')}</button>
        <button className="logout-btn" onClick={logout}>🚪 {t('btnLogout')}</button>
      </aside>

      <main className="admin-content">
        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div className="admin-section">
            <h1>{t('manageBookings')}</h1>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>{t('colTicket')}</th><th>{t('colPassenger')}</th><th>{t('colRoute')}</th><th>{t('colStatus')}</th><th>{t('colAction')}</th></tr></thead>
                <tbody>
                  {bookings.length === 0 ? <tr><td colSpan="5">{t('noData')}</td></tr> : bookings.map(b => (
                    <tr key={b._id}>
                      <td><b>{b.ticketCode}</b></td>
                      <td>{b.passengerName}<br/><small className="muted">{b.phone}</small></td>
                      <td>{b.scheduleId ? `${b.scheduleId.from || 'Hossana'} → ${b.scheduleId.to}` : 'N/A'}</td>
                      <td><span className={`st ${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => approveBooking(b._id, 'Confirmed')}>{t('btnApprove')}</button>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => approveBooking(b._id, 'Cancelled')}>{t('btnReject')}</button>
                          </div>
                        ) : <span className="muted">Done</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROUTES TAB (BILINGUAL) */}
        {tab === 'routes' && (
          <div className="admin-section">
            <h1>{t('manageRoutes')}</h1>
            <form onSubmit={addRoute} className="admin-form register-form">
  <h3 className="form-section-title">Route Information</h3>
  
  <div className="form-grid">
    <div className="input-group">
      <label>From (English)</label>
      <input className="field" placeholder="e.g. Hossana" value={newRoute.from} onChange={e => setNewRoute({...newRoute, from: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>From (Amharic)</label>
      <input className="field" placeholder="e.g. ሆሳና" value={newRoute.from_am || ''} onChange={e => setNewRoute({...newRoute, from_am: e.target.value})} />
    </div>

    <div className="input-group">
      <label>To (English)</label>
      <input className="field" placeholder="e.g. Addis Ababa" value={newRoute.to} onChange={e => setNewRoute({...newRoute, to: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>To (Amharic)</label>
      <input className="field" placeholder="e.g. አዲስ አበባ" value={newRoute.to_am || ''} onChange={e => setNewRoute({...newRoute, to_am: e.target.value})} />
    </div>

    <div className="input-group">
      <label>Price (ETB)</label>
      <input className="field" type="number" placeholder="e.g. 450" value={newRoute.price} onChange={e => setNewRoute({...newRoute, price: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>Duration</label>
      <input className="field" placeholder="e.g. 4h 30m" value={newRoute.duration} onChange={e => setNewRoute({...newRoute, duration: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>Frequency (English)</label>
      <input className="field" placeholder="e.g. Every 3 hours" value={newRoute.frequency} onChange={e => setNewRoute({...newRoute, frequency: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>Frequency (Amharic)</label>
      <input className="field" placeholder="e.g. በየ3 ሰዓቱ" value={newRoute.frequency_am || ''} onChange={e => setNewRoute({...newRoute, frequency_am: e.target.value})} />
    </div>

    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
      <label>Route image</label>
      <input className="field" type="file" accept="image/*" onChange={e => setRouteImage(e.target.files?.[0] || null)} />
    </div>
  </div>
  
  <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>
    {saving ? 'Saving...' : t('addRouteBtn')}
  </button>
</form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Image</th><th>{t('colFrom')}</th><th>{t('colTo')}</th><th>{t('colPrice')}</th><th>{t('colDur')}</th><th>{t('colFreq')}</th><th>{t('colAction')}</th></tr></thead>
                <tbody>
                  {routes.map(r => (
                    <tr key={r._id}>
                      <td>{r.image ? <img src={r.image} alt="" className="admin-thumb" /> : '—'}</td>
                      <td>{r.from || 'Hossana'} ({r.from_am || 'ሆሳና'})</td>
                      <td>{r.to} ({r.to_am || '-'})</td>
                      <td>ETB {r.price}</td>
                      <td>{r.duration}</td>
                      <td>{r.frequency} ({r.frequency_am || '-'})</td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteRoute(r._id)}>{t('btnDelete')}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SCHEDULES TAB (BILINGUAL) */}
        {tab === 'schedules' && (
          <div className="admin-section">
            <h1>{t('manageSchedules')}</h1>
            <form onSubmit={addSchedule} className="admin-form register-form">
  <h3 className="form-section-title">Bus & Route Information</h3>
  
  <div className="form-grid">
    <div className="input-group">
      <label>Bus ID</label>
      <input className="field" placeholder="e.g. HZ-123" value={newSchedule.busId} onChange={e => setNewSchedule({...newSchedule, busId: e.target.value})} required />
    </div>
    
    <div className="input-group">
      <label>Price (ETB)</label>
      <input className="field" type="number" placeholder="e.g. 450" value={newSchedule.price} onChange={e => setNewSchedule({...newSchedule, price: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>From (English)</label>
      <input className="field" placeholder="e.g. Aroge Menariya" value={newSchedule.from} onChange={e => setNewSchedule({...newSchedule, from: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>From (Amharic)</label>
      <input className="field" placeholder="e.g. አሮጌ መናሪያ" value={newSchedule.from_am || ''} onChange={e => setNewSchedule({...newSchedule, from_am: e.target.value})} />
    </div>

    <div className="input-group">
      <label>To (English)</label>
      <input className="field" placeholder="e.g. Shone" value={newSchedule.to} onChange={e => setNewSchedule({...newSchedule, to: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>To (Amharic)</label>
      <input className="field" placeholder="e.g. ሾኔ" value={newSchedule.to_am || ''} onChange={e => setNewSchedule({...newSchedule, to_am: e.target.value})} />
    </div>

    <div className="input-group">
      <label>Departure Time</label>
      <input className="field" placeholder="e.g. 06:00 AM" value={newSchedule.departure} onChange={e => setNewSchedule({...newSchedule, departure: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>Arrival Time</label>
      <input className="field" placeholder="e.g. 09:30 AM" value={newSchedule.arrival} onChange={e => setNewSchedule({...newSchedule, arrival: e.target.value})} required />
    </div>
  </div>
  
  <button className="btn btn-primary submit-btn" type="submit">
    {t('addScheduleBtn')}
  </button>
</form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>{t('colBus')}</th><th>{t('colRoute')}</th><th>{t('colDep')}</th><th>{t('colStatus')}</th><th>{t('colAction')}</th></tr></thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s._id}>
                      <td><b>{s.busId}</b></td>
                      <td>{s.from || 'Hossana'} ({s.from_am || 'ሆሳና'}) → {s.to} ({s.to_am || '-'})</td>
                      <td>{s.departure}</td>
                      <td><span className={`st ${s.status}`}>{s.status || 'Available'}</span></td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteSchedule(s._id)}>{t('btnDelete')}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB (BILINGUAL) */}
        {tab === 'announcements' && (
          <div className="admin-section">
            <h1>{t('manageAnn')}</h1>
            <form onSubmit={addAnnouncement} className="admin-form register-form">
  <h3 className="form-section-title">Announcement Details</h3>
  
  <div className="form-grid">
    <div className="input-group">
      <label>Title (English)</label>
      <input className="field" placeholder="e.g. Holiday Schedule" value={newAnn.title_en} onChange={e => setNewAnn({...newAnn, title_en: e.target.value})} required />
    </div>

    <div className="input-group">
      <label>Title (Amharic)</label>
      <input className="field" placeholder="e.g. የበዓል መርሃ ግብር" value={newAnn.title_am || ''} onChange={e => setNewAnn({...newAnn, title_am: e.target.value})} />
    </div>

    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
      <label>Date</label>
      <input className="field" placeholder="e.g. Nov 10, 2026" value={newAnn.date} onChange={e => setNewAnn({...newAnn, date: e.target.value})} required />
    </div>

    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
      <label>Body (English)</label>
      <textarea className="field" rows="3" placeholder="Write the announcement in English..." value={newAnn.body_en} onChange={e => setNewAnn({...newAnn, body_en: e.target.value})} required />
    </div>

    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
      <label>Body (Amharic)</label>
      <textarea className="field" rows="3" placeholder="ማስታወቂያውን በአማርኛ ይጻፉ..." value={newAnn.body_am || ''} onChange={e => setNewAnn({...newAnn, body_am: e.target.value})} />
    </div>

    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
      <label>Announcement image</label>
      <input className="field" type="file" accept="image/*" onChange={e => setAnnImage(e.target.files?.[0] || null)} />
    </div>
  </div>
  
  <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>
    {saving ? 'Saving...' : t('addAnnBtn')}
  </button>
</form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Image</th><th>{t('colTitle')}</th><th>{t('colDate')}</th><th>{t('colAction')}</th></tr></thead>
                <tbody>
                  {announcements.map(a => (
                    <tr key={a._id}>
                      <td>{a.image ? <img src={a.image} alt="" className="admin-thumb" /> : '—'}</td>
                      <td><b>{a.title_en || a.title}</b><br/><small className="muted">{a.title_am}</small></td>
                      <td>{a.date}</td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteAnnouncement(a._id)}>{t('btnDelete')}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === 'messages' && (
          <div className="admin-section">
            <h1>{t('manageMsg')}</h1>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>{t('colFrom')}</th><th>{t('colEmail')}</th><th>{t('colMsg')}</th></tr></thead>
                <tbody>
                  {messages.length === 0 ? <tr><td colSpan="3">{t('noData')}</td></tr> : messages.map(m => (
                    <tr key={m._id}>
                      <td><b>{m.name}</b></td><td>{m.email}</td><td>{m.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}



