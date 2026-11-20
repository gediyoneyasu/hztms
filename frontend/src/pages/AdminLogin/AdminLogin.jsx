import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('Invalid Admin Credentials!');
    }
  };

  return (
    <div className="wrap s" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
        <h2>Admin Portal</h2>
        <p className="muted" style={{ marginBottom: '24px' }}>Restricted access only.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Username</label>
            <input className="field" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Password</label>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }}>Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
}
