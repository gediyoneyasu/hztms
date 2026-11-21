import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.');
      if (data.role !== 'Admin') throw new Error('This account does not have administrator access.');
      login(data);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap s" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
        <h2>Admin Portal</h2>
        <p className="muted" style={{ marginBottom: '24px' }}>Restricted access only.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {error && <div className="auth-error">{error}</div>}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Email</label>
            <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Password</label>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }} disabled={loading}>{loading ? 'Signing in...' : 'Login to Dashboard'}</button>
        </form>
      </div>
    </div>
  );
}
