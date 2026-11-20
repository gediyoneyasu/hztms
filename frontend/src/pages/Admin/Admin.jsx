import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants.js';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form States
  const [newRoute, setNewRoute] = useState({ to: '', price: '', duration: '', frequency: '' });
  const [newSchedule, setNewSchedule] = useState({ busId: '', to: '', departure: '', arrival: '', price: '' });
  const [newAnn, setNewAnn] = useState({ title: '', date: '', body: '' });

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

  // Actions
  const approveBooking = async (id, status) => {
    await fetch(`${API_URL}/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchAll();
  };

  const addRoute = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/routes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newRoute, from: 'Hossana', price: Number(newRoute.price) }) });
    setNewRoute({ to: '', price: '', duration: '', frequency: '' }); fetchAll();
  };

  const deleteRoute = async (id) => { if (window.confirm('Delete route?')) { await fetch(`${API_URL}/routes/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addSchedule = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/schedules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newSchedule, from: 'Hossana', price: Number(newSchedule.price) }) });
    setNewSchedule({ busId: '', to: '', departure: '', arrival: '', price: '' }); fetchAll();
  };

  const deleteSchedule = async (id) => { if (window.confirm('Delete schedule?')) { await fetch(`${API_URL}/schedules/${id}`, { method: 'DELETE' }); fetchAll(); } };

  const addAnnouncement = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAnn) });
    setNewAnn({ title: '', date: '', body: '' }); fetchAll();
  };

  const deleteAnnouncement = async (id) => { if (window.confirm('Delete announcement?')) { await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' }); fetchAll(); } };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>HZTMS Admin</h2>
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>🎫 Bookings</button>
        <button className={tab === 'routes' ? 'active' : ''} onClick={() => setTab('routes')}>🗺️ Routes</button>
        <button className={tab === 'schedules' ? 'active' : ''} onClick={() => setTab('schedules')}>🚌 Schedules</button>
        <button className={tab === 'announcements' ? 'active' : ''} onClick={() => setTab('announcements')}>📢 Announcements</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>✉️ Messages</button>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="admin-content">
        {tab === 'bookings' && (
          <div className="admin-section">
            <h1>Manage Bookings</h1>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Ticket</th><th>Passenger</th><th>Route</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {bookings.length === 0 ? <tr><td colSpan="5">No bookings yet.</td></tr> : bookings.map(b => (
                    <tr key={b._id}>
                      <td><b>{b.ticketCode}</b></td>
                      <td>{b.passengerName}<br/><small className="muted">{b.phone}</small></td>
                      <td>{b.scheduleId ? `${b.scheduleId.from} → ${b.scheduleId.to}` : 'N/A'}</td>
                      <td><span className={`st ${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => approveBooking(b._id, 'Confirmed')}>Approve</button>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => approveBooking(b._id, 'Cancelled')}>Reject</button>
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

        {tab === 'routes' && (
          <div className="admin-section">
            <h1>Manage Routes</h1>
            <form onSubmit={addRoute} className="admin-form">
              <input className="field" placeholder="Destination (To)" value={newRoute.to} onChange={e => setNewRoute({...newRoute, to: e.target.value})} required />
              <input className="field" type="number" placeholder="Price (ETB)" value={newRoute.price} onChange={e => setNewRoute({...newRoute, price: e.target.value})} required />
              <input className="field" placeholder="Duration (e.g. 4h 30m)" value={newRoute.duration} onChange={e => setNewRoute({...newRoute, duration: e.target.value})} required />
              <input className="field" placeholder="Frequency" value={newRoute.frequency} onChange={e => setNewRoute({...newRoute, frequency: e.target.value})} required />
              <button className="btn btn-primary" type="submit">+ Add Route</button>
            </form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>To</th><th>Price</th><th>Duration</th><th>Frequency</th><th>Action</th></tr></thead>
                <tbody>
                  {routes.map(r => (
                    <tr key={r._id}>
                      <td>{r.to}</td><td>ETB {r.price}</td><td>{r.duration}</td><td>{r.frequency}</td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteRoute(r._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'schedules' && (
          <div className="admin-section">
            <h1>Manage Schedules</h1>
            <form onSubmit={addSchedule} className="admin-form">
              <input className="field" placeholder="Bus ID (HZ-XXX)" value={newSchedule.busId} onChange={e => setNewSchedule({...newSchedule, busId: e.target.value})} required />
              <input className="field" placeholder="To (Destination)" value={newSchedule.to} onChange={e => setNewSchedule({...newSchedule, to: e.target.value})} required />
              <input className="field" placeholder="Departure (e.g. 06:00)" value={newSchedule.departure} onChange={e => setNewSchedule({...newSchedule, departure: e.target.value})} required />
              <input className="field" placeholder="Arrival (e.g. 10:30)" value={newSchedule.arrival} onChange={e => setNewSchedule({...newSchedule, arrival: e.target.value})} required />
              <input className="field" type="number" placeholder="Price (ETB)" value={newSchedule.price} onChange={e => setNewSchedule({...newSchedule, price: e.target.value})} required />
              <button className="btn btn-primary" type="submit">+ Add Schedule</button>
            </form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Bus</th><th>Destination</th><th>Departure</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s._id}>
                      <td><b>{s.busId}</b></td><td>{s.to}</td><td>{s.departure}</td>
                      <td><span className={`st ${s.status}`}>{s.status}</span></td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteSchedule(s._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'announcements' && (
          <div className="admin-section">
            <h1>Manage Announcements</h1>
            <form onSubmit={addAnnouncement} className="admin-form">
              <input className="field" placeholder="Announcement Title" value={newAnn.title} onChange={e => setNewAnn({...newAnn, title: e.target.value})} required />
              <input className="field" placeholder="Date (e.g. Nov 10, 2026)" value={newAnn.date} onChange={e => setNewAnn({...newAnn, date: e.target.value})} required />
              <textarea className="field" placeholder="Announcement Body text..." value={newAnn.body} onChange={e => setNewAnn({...newAnn, body: e.target.value})} required />
              <button className="btn btn-primary" type="submit">+ Post Announcement</button>
            </form>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>Title</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {announcements.map(a => (
                    <tr key={a._id}>
                      <td><b>{a.title}</b><br/><small className="muted">{a.body}</small></td>
                      <td>{a.date}</td>
                      <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteAnnouncement(a._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div className="admin-section">
            <h1>Contact Messages</h1>
            <div className="tw card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th>From</th><th>Email</th><th>Message</th></tr></thead>
                <tbody>
                  {messages.length === 0 ? <tr><td colSpan="3">No messages yet.</td></tr> : messages.map(m => (
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
/ /   A d m i n   b y   E y u e l  
 