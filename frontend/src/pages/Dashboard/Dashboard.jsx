import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../utils/constants.js';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'complaints' | 'lost'
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch all user data at once
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/bookings/my/${user.email}`).then(res => res.json()),
      fetch(`${API_URL}/complaints/my/${user.email}`).then(res => res.json()),
      fetch(`${API_URL}/lost-found/lost/my/${user.email}`).then(res => res.json()).catch(() => []) // Fallback in case route doesn't exist yet
    ]).then(([b, c, l]) => {
      setBookings(Array.isArray(b) ? b : []);
      setComplaints(Array.isArray(c) ? c : []);
      setLostItems(Array.isArray(l) ? l : []);
    }).catch(err => console.error("Error loading dashboard", err))
      .finally(() => setLoading(false));

  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="wrap s">
      <div className="dash-header">
        <div>
          <h1>{user.role} Dashboard</h1>
          <p className="muted">Welcome back, <b>{user.name}</b> ({user.email})</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dash-tabs">
        <button className={activeTab === 'tickets' ? 'active' : ''} onClick={() => setActiveTab('tickets')}>🎫 My Tickets</button>
        <button className={activeTab === 'complaints' ? 'active' : ''} onClick={() => setActiveTab('complaints')}>📝 My Complaints</button>
        <button className={activeTab === 'lost' ? 'active' : ''} onClick={() => setActiveTab('lost')}>🔍 Lost Items</button>
      </div>

      {loading ? (
        <p className="muted" style={{ marginTop: '30px' }}>Loading your history...</p>
      ) : (
        <div className="dash-content">
          
          {/* TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div>
              <div className="tab-header">
                <h2>Your Bookings</h2>
                <Link to="/schedules" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>+ Book New Trip</Link>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state">No bookings found. Go book a trip!</div>
              ) : (
                <div className="dash-grid">
                  {bookings.map(b => (
                    <div key={b._id} className="card dash-ticket-card" style={{ borderLeft: b.status === 'Confirmed' ? '4px solid #22c55e' : '4px solid #f59e0b' }}>
                      <div className="ticket-top">
                        <b>{b.ticketCode}</b>
                        <span className={`st ${b.status}`}>{b.status}</span>
                      </div>
                      <p><b>Route:</b> {b.scheduleId?.from || 'Hossana'} → {b.scheduleId?.to}</p>
                      <p><b>Bus:</b> {b.scheduleId?.busId} ({b.scheduleId?.departure})</p>
                      <p><b>Seats:</b> {b.seats} | <b>Passenger:</b> {b.passengerName}</p>
                      <div className="ticket-footer">
                        Booked on: {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === 'complaints' && (
            <div>
              <div className="tab-header">
                <h2>Your Complaints</h2>
                <Link to="/complaints" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>+ File Complaint</Link>
              </div>
              {complaints.length === 0 ? (
                <div className="empty-state">No complaints filed.</div>
              ) : (
                <div className="dash-grid">
                  {complaints.map(c => (
                    <div key={c._id} className="card dash-ticket-card">
                      <div className="ticket-top">
                        <b>{c.complaintId}</b>
                        <span className={`st ${c.status.replace(' ', '-')}`}>{c.status}</span>
                      </div>
                      <p><b>Ticket:</b> {c.bookingId}</p>
                      <p><b>Category:</b> {c.category}</p>
                      <p><b>Subject:</b> {c.subject}</p>
                      {c.adminResponse && (
                        <div className="admin-reply">
                          <b>Admin Response:</b> {c.adminResponse}
                        </div>
                      )}
                      <div className="ticket-footer">
                        Filed on: {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOST ITEMS TAB */}
          {activeTab === 'lost' && (
            <div>
              <div className="tab-header">
                <h2>Your Lost Items</h2>
                <Link to="/lost-found" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>+ Report Lost</Link>
              </div>
              {lostItems.length === 0 ? (
                <div className="empty-state">No lost items reported.</div>
              ) : (
                <div className="dash-grid">
                  {lostItems.map(l => (
                    <div key={l._id} className="card dash-ticket-card">
                      <div className="ticket-top">
                        <b>{l.itemName}</b>
                        <span className={`st ${l.status.replace(' ', '-')}`}>{l.status}</span>
                      </div>
                      <p><b>Ticket:</b> {l.bookingId}</p>
                      <p><b>Category:</b> {l.category}</p>
                      <p><b>Location:</b> {l.lostLocation}</p>
                      <div className="ticket-footer">
                        Lost on: {l.lostDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
