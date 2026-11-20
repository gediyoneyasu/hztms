import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth'); // kick them out if not logged in
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
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
        {/* PASSENGER DASHBOARD */}
        {user.role === 'Passenger' && (
          <>
            <div className="card dash-card">
              <h3>🎫 My Bookings</h3>
              <p className="muted">View your upcoming trips and e-tickets.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>View Tickets</button>
            </div>
            <div className="card dash-card">
              <h3>🔍 Book a New Trip</h3>
              <p className="muted">Search for buses and reserve your seat.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={() => navigate('/schedules')}>Book Now</button>
            </div>
          </>
        )}

        {/* DRIVER DASHBOARD */}
        {user.role === 'Driver' && (
          <>
            <div className="card dash-card">
              <h3>🚌 My Assigned Trips</h3>
              <p className="muted">View today's schedule and your assigned bus.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>View Trips</button>
            </div>
            <div className="card dash-card">
              <h3>⚠️ Report Incident</h3>
              <p className="muted">Report a mechanical issue or road incident.</p>
              <button className="btn btn-outline" style={{ marginTop: '15px' }}>Report</button>
            </div>
          </>
        )}

        {/* TICKET OFFICER DASHBOARD */}
        {user.role === 'TicketOfficer' && (
          <>
            <div className="card dash-card">
              <h3>📱 Scan Ticket</h3>
              <p className="muted">Verify passenger QR codes at the gate.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>Open Scanner</button>
            </div>
            <div className="card dash-card">
              <h3>🚶 Walk-in Check-in</h3>
              <p className="muted">Check in passengers without online bookings.</p>
              <button className="btn btn-outline" style={{ marginTop: '15px' }}>Check In</button>
            </div>
          </>
        )}

        {/* LOST & FOUND OFFICER DASHBOARD */}
        {user.role === 'LostFoundOfficer' && (
          <>
            <div className="card dash-card">
              <h3>📦 Log Found Item</h3>
              <p className="muted">Record a newly found item at the terminal.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>Log Item</button>
            </div>
            <div className="card dash-card">
              <h3>🔎 View All Items</h3>
              <p className="muted">Search the database for matching lost item reports.</p>
              <button className="btn btn-outline" style={{ marginTop: '15px' }}>Search</button>
            </div>
          </>
        )}

        {/* ADMIN DASHBOARD */}
        {user.role === 'Admin' && (
          <>
            <div className="card dash-card">
              <h3>👥 Manage Users</h3>
              <p className="muted">View and manage all system users and roles.</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>Manage</button>
            </div>
            <div className="card dash-card">
              <h3>🚌 Manage Fleet</h3>
              <p className="muted">Add new buses, routes, and schedules.</p>
              <button className="btn btn-outline" style={{ marginTop: '15px' }}>Manage</button>
            </div>
            <div className="card dash-card">
              <h3>📊 Operational Reports</h3>
              <p className="muted">View revenue, bookings, and system activity.</p>
              <button className="btn btn-outline" style={{ marginTop: '15px' }} onClick={() => navigate('/admin')}>View Reports</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
