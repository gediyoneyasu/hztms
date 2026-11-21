import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';
import { uploadImage } from '../../services/uploadService.js';

export default function Complaints() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    category: 'Driver behavior',
    subject: '',
    description: '',
    travelDate: '',
    busPlate: '',
    contactPhone: user?.phone || ''
  });

  const categories = [
    'Driver behavior', 'Conductor behavior', 'Bus condition', 
    'Late departure', 'Trip cancellation', 'Ticket booking problems', 
    'Payment problems', 'Lost belongings', 'Other'
  ];

  // 1. Verify Ticket ID
  const verifyTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // We check if the booking exists and belongs to this user
      const res = await fetch(`${API_URL}/bookings/verify/${ticketId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Ticket not found');
      
      // Check if it belongs to the logged-in user
      if (data.userEmail !== user.email) {
        throw new Error('This ticket does not belong to your account.');
      }
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Submit Complaint
  const submitComplaint = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadImage(image);

      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bookingId: ticketId,
          userEmail: user.email,
          imageUrl
        })
      });

      if (!res.ok) throw new Error('Failed to submit complaint');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="wrap s" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '20px' }}>✅ Complaint Submitted!</h2>
        <p className="muted">Your complaint has been received. You can track its status in your dashboard.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'} style={{ marginTop: '20px' }}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="wrap s">
      <div className="banner" style={{ borderRadius: '16px', marginBottom: '30px' }}>
        <div className="wrap">
          <h1>Submit a Complaint</h1>
          <p>We take your feedback seriously. Please verify your ticket to continue.</p>
        </div>
      </div>

      {error && <div className="booking-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {step === 1 && (
        <div className="card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>Verify Your Ticket</h3>
          <p className="muted" style={{ marginBottom: '20px' }}>Enter the Ticket Code (e.g., HZ-XXXXXX) to file a complaint.</p>
          <form onSubmit={verifyTicket} style={{ display: 'flex', gap: '10px' }}>
            <input 
              className="field" 
              placeholder="Enter Ticket ID" 
              value={ticketId} 
              onChange={e => setTicketId(e.target.value.toUpperCase())} 
              required 
            />
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Checking...' : 'Verify'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <form className="card register-form" onSubmit={submitComplaint}>
          <h3 className="form-section-title">Complaint Details</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>Ticket ID</label>
              <input className="field" value={ticketId} disabled />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select className="field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Subject</label>
              <input className="field" placeholder="Brief summary of the issue" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea className="field" rows="4" placeholder="Explain what happened..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Travel Date</label>
              <input className="field" type="date" value={form.travelDate} onChange={e => setForm({...form, travelDate: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input className="field" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Upload Evidence (Optional)</label>
              <input className="field" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
            </div>
          </div>
          <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>
            {saving ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      )}
    </div>
  );
}
