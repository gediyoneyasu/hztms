import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { API_URL } from '../../utils/constants.js';
import { uploadImage } from '../../services/uploadService.js';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [adminReply, setAdminReply] = useState({ id: '', text: '' });

  // Form States - Now including _am fields for bilingual support
  const [newRoute, setNewRoute] = useState({ from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', price: '', duration: '', frequency: '', frequency_am: '' });
  const [newSchedule, setNewSchedule] = useState({ busId: '', from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', departure: '', arrival: '', price: '' });
  const [newAnn, setNewAnn] = useState({ title_en: '', title_am: '', date: '', body_en: '', body_am: '' });
  const [routeImage, setRouteImage] = useState(null);
  const [annImage, setAnnImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const adminFetch = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${user?.token}`,
      },
    });
    if (!response.ok) {
      const body = await response.text();
      let message = body;
      try {
        message = JSON.parse(body).message || body;
      } catch {
        // Keep the response text when the server does not return JSON.
      }
      const error = new Error(message || `Request failed with ${response.status}`);
      setLoadError(error.message);
      throw error;
    }
    return response;
  };

  const fetchAll = async () => {
    setLoadError('');
    Promise.all([
      '/bookings', '/schedules', '/routes', '/announcements', '/messages',
      '/complaints', '/lost-found/lost', '/lost-found/admin/found',
    ].map(async (path) => {
      const response = await adminFetch(path);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Unable to load ${path}`);
      if (!Array.isArray(data)) throw new Error(`Unexpected response from ${path}`);
      return data;
    })).then(([b, s, r, a, m, c, l, f]) => {
      setBookings(b); setSchedules(s); setRoutes(r); setAnnouncements(a); setMessages(m);
      setComplaints(c); setLostItems(l); setFoundItems(f);
    }).catch((err) => setLoadError(err.message));
  };

  useEffect(() => {
    if (!user || user.role !== 'Admin' || !user.token) { navigate('/admin-login', { replace: true }); return; }
    fetchAll();
  }, [navigate, user]);

  const logout = () => { logoutUser(); navigate('/'); };

  const approveBooking = async (id, status) => {
    await adminFetch(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    fetchAll();
  };

  const addRoute = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const image = routeImage ? await uploadImage(routeImage) : '';
      await adminFetch('/routes', { method: 'POST', body: JSON.stringify({ ...newRoute, price: Number(newRoute.price), image }) });
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

  const deleteRoute = async (id) => { if (window.confirm('Delete route?')) { await adminFetch(`/routes/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addSchedule = async (e) => {
    e.preventDefault();
    await adminFetch('/schedules', { method: 'POST', body: JSON.stringify({ ...newSchedule, price: Number(newSchedule.price) }) });
    setNewSchedule({ busId: '', from: 'Hossana', from_am: 'ሆሳና', to: '', to_am: '', departure: '', arrival: '', price: '' }); fetchAll();
  };

  const deleteSchedule = async (id) => { if (window.confirm('Delete schedule?')) { await adminFetch(`/schedules/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addAnnouncement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const image = annImage ? await uploadImage(annImage) : '';
      await adminFetch('/announcements', { method: 'POST', body: JSON.stringify({ ...newAnn, image }) });
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

  const deleteAnnouncement = async (id) => { if (window.confirm('Delete announcement?')) { await adminFetch(`/announcements/${id}`, { method: 'DELETE' }); fetchAll(); } };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>{t('adminTitle')}</h2>
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>🎫 {t('tabBookings')}</button>
        <button className={tab === 'routes' ? 'active' : ''} onClick={() => setTab('routes')}>🗺️ {t('tabRoutes')}</button>
        <button className={tab === 'schedules' ? 'active' : ''} onClick={() => setTab('schedules')}>🚌 {t('tabSchedules')}</button>
        <button className={tab === 'announcements' ? 'active' : ''} onClick={() => setTab('announcements')}>📢 {t('tabAnnouncements')}</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>✉️ {t('tabMessages')}</button>
        <button className={tab === 'complaints' ? 'active' : ''} onClick={() => setTab('complaints')}>📝 Complaints</button>
        <button className={tab === 'lostItems' ? 'active' : ''} onClick={() => setTab('lostItems')}>🔍 Lost Items</button>
        <button className={tab === 'foundItems' ? 'active' : ''} onClick={() => setTab('foundItems')}>📦 Found Items</button>
        <button className="logout-btn" onClick={logout}>🚪 {t('btnLogout')}</button>
      </aside>

      <main className="admin-content">
        {loadError && <div className="booking-error" role="alert">{loadError}</div>}
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
              {/* COMPLAINTS TAB */}
        {tab === 'complaints' && (
          <div className="admin-section">
            <h1>Manage Complaints</h1>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>ID</th><th>Ticket</th><th>Category</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {complaints?.length === 0 ? <tr><td colSpan="5">No complaints found.</td></tr> : complaints?.map(c => (
                    <tr key={c._id}>
                      <td><b>{c.complaintId}</b><br/><small className="muted">{new Date(c.createdAt).toLocaleDateString()}</small></td>
                      <td>{c.bookingId}<br/><small className="muted">{c.userEmail}</small></td>
                      <td>{c.category}</td>
                      <td><span className={`st ${c.status}`}>{c.status}</span></td>
                      <td>
                        <select 
                          className="field" 
                          style={{ padding: '6px', fontSize: '12px', width: '120px', marginBottom: '5px' }}
                          value={c.status}
                          onChange={(e) => {
                            adminFetch(`/complaints/${c._id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ status: e.target.value })
                            }).then(() => fetchAll());
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <br/>
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => {
                          const reply = prompt("Enter admin response:", c.adminResponse);
                          if (reply !== null) {
                            adminFetch(`/complaints/${c._id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ adminResponse: reply })
                            }).then(() => fetchAll());
                          }
                        }}>
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

                {/* LOST ITEMS TAB */}
        {tab === 'lostItems' && (
          <div className="admin-section">
            <h1>Manage Lost Items</h1>
            
            {/* Form to add lost item manually */}
            <form className="admin-form register-form" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              await adminFetch('/lost-found/lost', {
                method: 'POST',
                body: JSON.stringify({
                  itemName: formData.get('itemName'),
                  category: formData.get('category'),
                  description: formData.get('description'),
                  lostDate: formData.get('lostDate'),
                  lostLocation: formData.get('lostLocation'),
                  contactPhone: formData.get('contactPhone'),
                  bookingId: 'ADMIN-ADDED',
                  userEmail: 'admin@hztms.com'
                })
              });
              e.target.reset();
              fetchAll();
            }}>
              <h3 className="form-section-title">Add Lost Item Manually</h3>
              <div className="form-grid">
                <div className="input-group"><label>Item Name</label><input name="itemName" className="field" required /></div>
                <div className="input-group"><label>Category</label><input name="category" className="field" required /></div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea name="description" className="field" rows="2" required /></div>
                <div className="input-group"><label>Date Lost</label><input name="lostDate" type="date" className="field" required /></div>
                <div className="input-group"><label>Location</label><input name="lostLocation" className="field" required /></div>
                <div className="input-group"><label>Contact Phone</label><input name="contactPhone" className="field" required /></div>
              </div>
              <button className="btn btn-primary submit-btn" type="submit">Add Lost Item</button>
            </form>

            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Item</th><th>Ticket</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {lostItems?.length === 0 ? <tr><td colSpan="4">No lost items reported.</td></tr> : lostItems?.map(l => (
                    <tr key={l._id}>
                      <td><b>{l.itemName}</b><br/><small className="muted">{l.category}</small></td>
                      <td>{l.bookingId === 'ADMIN-ADDED' ? <span className='muted'>Admin Added</span> : l.bookingId}</td>
                      <td><span className={`st ${l.status}`}>{l.status}</span></td>
                      <td>
                        <select 
                          className="field" 
                          style={{ padding: '6px', fontSize: '12px' }}
                          value={l.status}
                          onChange={(e) => {
                            adminFetch(`/lost-found/admin/lost/${l._id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ status: e.target.value })
                            }).then(() => fetchAll());
                          }}
                        >
                          <option value="Reported">Reported</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Found">Found</option>
                          <option value="Returned">Returned</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

                        {/* FOUND ITEMS TAB */}
        {tab === 'foundItems' && (
          <div className="admin-section">
            <h1>Found Item Reports (Review & Publish)</h1>
            <p className="muted" style={{ marginBottom: '20px' }}>
              When a user reports a found item, it appears here. Click "Publish" to make it visible to the public.
            </p>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Item</th><th>Location</th><th>Status</th><th>Visibility</th></tr></thead>
                <tbody>
                  {foundItems?.length === 0 ? <tr><td colSpan="4">No found items reported.</td></tr> : foundItems?.map(f => (
                    <tr key={f._id}>
                      <td>
                        <b>{f.itemName}</b><br/>
                        <small className="muted">{f.category} • {f.description}</small>
                      </td>
                      <td>{f.foundLocation}</td>
                      <td><span className={`st ${f.status}`}>{f.status}</span></td>
                      <td>
                        <button 
                          className={`btn ${f.isPublished ? 'btn-outline' : 'btn-primary'}`} 
                          style={{ padding: '6px 12px', fontSize: '12px', minWidth: '100px' }}
                          onClick={async () => {
                            await adminFetch(`/lost-found/admin/found/${f._id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ isPublished: !f.isPublished })
                            });
                            fetchAll(); // Refresh the list immediately
                          }}
                        >
                          {f.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
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










