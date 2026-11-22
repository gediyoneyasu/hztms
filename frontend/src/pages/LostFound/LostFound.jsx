import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';
import { uploadImage } from '../../services/uploadService.js';
import './LostFound.css';

export default function LostFound() {
  const { user } = useAuth();
  const [tab, setTab] = useState('lost'); 
  
  const [step, setStep] = useState(1);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [lostForm, setLostForm] = useState({ itemName: '', category: '', description: '', lostDate: '', lostLocation: '', contactPhone: '' });
  const [foundForm, setFoundForm] = useState({ itemName: '', category: '', description: '', foundDate: '', foundLocation: '', foundBy: '', contactPhone: '' });
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (tab === 'view') {
      fetch(`${API_URL}/lost-found/found`)
        .then(res => res.json())
        .then(data => setFoundItems(data))
        .catch(console.error);
    }
  }, [tab]);

  const verifyTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/bookings/verify/${ticketId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ticket not found');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submitLostItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadImage(image);
      await fetch(`${API_URL}/lost-found/lost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lostForm, bookingId: ticketId, userEmail: user?.email || 'guest@example.com', imageUrl })
      });
      alert('Lost item reported successfully!');
      setTab('view');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submitFoundItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadImage(image);
      await fetch(`${API_URL}/lost-found/found`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...foundForm, bookingId: ticketId, userEmail: user?.email || 'guest@example.com', imageUrl })
      });
      alert('Found item reported! Admin will review and publish it soon.');
      setTab('view');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrap s">
      <div className="banner" style={{ borderRadius: '16px', marginBottom: '30px' }}>
        <div className="wrap">
          <h1>Lost & Found</h1>
          <p>Report a lost item, or browse items found by others.</p>
        </div>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn ${tab === 'lost' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setTab('lost'); setStep(1); }}>Report Lost Item</button>
        <button className={`btn ${tab === 'found' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setTab('found'); setStep(1); }}>Report Found Item</button>
        <button className={`btn ${tab === 'view' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('view')}>View Found Items</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {tab === 'lost' && step === 1 && (
        <div className="verify-card">
          <h3>Verify Your Ticket</h3>
          <p className="muted" style={{ marginBottom: '20px' }}>Enter your Ticket Code to report a lost item.</p>
          <form onSubmit={verifyTicket} className="verify-form">
            <input className="field" placeholder="Ticket ID" value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())} required />
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Checking...' : 'Verify'}</button>
          </form>
        </div>
      )}

      {tab === 'lost' && step === 2 && (
        <form className="card register-form" onSubmit={submitLostItem}>
          <h3 className="form-section-title">Lost Item Details</h3>
          <div className="form-grid">
            <div className="input-group"><label>Item Name</label><input className="field" required onChange={e => setLostForm({...lostForm, itemName: e.target.value})} /></div>
            <div className="input-group"><label>Category</label><input className="field" required onChange={e => setLostForm({...lostForm, category: e.target.value})} /></div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea className="field" rows="3" required onChange={e => setLostForm({...lostForm, description: e.target.value})} /></div>
            <div className="input-group"><label>Date Lost</label><input className="field" type="date" required onChange={e => setLostForm({...lostForm, lostDate: e.target.value})} /></div>
            <div className="input-group"><label>Location Lost</label><input className="field" required onChange={e => setLostForm({...lostForm, lostLocation: e.target.value})} /></div>
            <div className="input-group"><label>Contact Phone</label><input className="field" required onChange={e => setLostForm({...lostForm, contactPhone: e.target.value})} /></div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Image (Optional)</label><input className="field" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} /></div>
          </div>
          <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>Submit Report</button>
        </form>
      )}

      {tab === 'found' && step === 1 && (
        <div className="verify-card">
          <h3>Verify Your Ticket</h3>
          <p className="muted" style={{ marginBottom: '20px' }}>Enter your Ticket Code to report a found item.</p>
          <form onSubmit={verifyTicket} className="verify-form">
            <input className="field" placeholder="Ticket ID" value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())} required />
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Checking...' : 'Verify'}</button>
          </form>
        </div>
      )}

      {tab === 'found' && step === 2 && (
        <form className="card register-form" onSubmit={submitFoundItem}>
          <h3 className="form-section-title">Report a Found Item</h3>
          <p className="muted" style={{ marginBottom: '15px' }}>Anyone can report a found item. The Admin will review it before publishing.</p>
          <div className="form-grid">
            <div className="input-group"><label>Item Name</label><input className="field" required onChange={e => setFoundForm({...foundForm, itemName: e.target.value})} /></div>
            <div className="input-group"><label>Category</label><input className="field" required onChange={e => setFoundForm({...foundForm, category: e.target.value})} /></div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea className="field" rows="3" required onChange={e => setFoundForm({...foundForm, description: e.target.value})} /></div>
            <div className="input-group"><label>Date Found</label><input className="field" type="date" required onChange={e => setFoundForm({...foundForm, foundDate: e.target.value})} /></div>
            <div className="input-group"><label>Location Found</label><input className="field" required onChange={e => setFoundForm({...foundForm, foundLocation: e.target.value})} /></div>
            <div className="input-group"><label>Your Name</label><input className="field" required onChange={e => setFoundForm({...foundForm, foundBy: e.target.value})} /></div>
            <div className="input-group"><label>Contact Phone</label><input className="field" required onChange={e => setFoundForm({...foundForm, contactPhone: e.target.value})} /></div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Image (Optional)</label><input className="field" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} /></div>
          </div>
          <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>Submit Report</button>
        </form>
      )}

      {tab === 'view' && (
        <div className="found-grid">
          {foundItems.length === 0 ? <p className="muted">No published found items yet.</p> : foundItems.map(item => (
            <div key={item._id} className="found-card">
              {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />}
              <h3 style={{ color: 'var(--primary)' }}>{item.itemName}</h3>
              <p className="muted">{item.category} • {item.foundLocation || item.lostLocation}</p>
              <p style={{ marginTop: '10px' }}>{item.description}</p>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--mfg)' }}>Found on: {item.foundDate || item.lostDate}</p>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '15px' }}>Claim Item</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
