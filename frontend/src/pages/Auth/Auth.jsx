import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Passenger' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      login(data);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="wrap s auth-wrap">
      <div className="card auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div>
              <label>Full Name</label>
              <input type="text" className="field" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          )}
          <div>
            <label>Email</label>
            <input type="email" className="field" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" className="field" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          {!isLogin && (
            <div>
              <label>I am a...</label>
              <select className="field" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="Passenger">Passenger</option>
                <option value="Driver">Driver</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary auth-btn">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</button>
        </p>
      </div>
    </div>
  );
}
