import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../utils/constants.js';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch the user's specific tickets
  const loadMyTickets = () => {
    setLoading(true);
    setShowTickets(true);
    fetch(`${API_URL}/bookings`)
      .then(res => res.json())
      .then(data => {
        // Filter to only show bookings that match this user's email
        const myBookings = data.filter(b => b.userEmail === user.email || b.phone === user.phone);
        setBookings(myBookings);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="wrap s">
      <div className="dash-header">
        <div>
          <h1>{user.role} Dashboard</h1>
          <p className="muted">Welcome, {user.name} ({user.email})</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dash-grid">
        {user.role === 'Passenger' && (
          <>
            <div className="card dash-card">
              <h3>🎫 My Bookings</h3>
              <p className="muted">View your upcoming trips and e-tickets.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={loadMyTickets}>
                {showTickets ? 'Refresh Tickets' : 'View Tickets'}
              </button>
            </div>
            <div className="card dash-card">
              <h3>🔍 Book a New Trip</h3>
              <p className="muted">Search for buses and reserve your seat.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={() => navigate('/schedules')}>Book Now</button>
            </div>
          </>
        )}

        {/* ... (Other roles stay the same) ... */}
      </div>

      {/* TICKET HISTORY SECTION */}
      {showTickets && (
        <div style={{ marginTop: '40px' }}>
          <h2>Your Ticket History</h2>
          {loading ? (
            <p className="muted">Loading your tickets...</p>
          ) : bookings.length === 0 ? (
            <div className="card" style={{ padding: '20px', marginTop: '15px' }}>
              <p className="muted">You haven't booked any trips yet.</p>
              <Link to="/booking" className="btn btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>Book a Trip</Link>
            </div>
          ) : (
            <div className="grid" style={{ marginTop: '20px' }}>
              {bookings.map(b => (
                <div key={b._id} className="card" style={{ padding: '20px', borderLeft: b.status === 'Confirmed' ? '4px solid #22c55e' : '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <b style={{ fontSize: '18px', color: 'var(--primary)' }}>{b.ticketCode}</b>
                    <span className={`st ${b.status}`}>{b.status}</span>
                  </div>
                  <p><b>From:</b> {b.scheduleId?.from || 'Hossana'} → <b>To:</b> {b.scheduleId?.to}</p>
                  <p><b>Bus:</b> {b.scheduleId?.busId} ({b.scheduleId?.departure})</p>
                  <p><b>Seats:</b> {b.seats} | <b>Name:</b> {b.passengerName}</p>
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--mfg)' }}>
                    Booked on: {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
