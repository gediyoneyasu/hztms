import { useState } from 'react';
import Field from '../../components/ui/Field/Field.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import { API_URL } from '../../utils/constants.js';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSent(true);
    } catch (err) { alert('Failed to send message'); }
  };

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>Contact Us</h1>
          <p>We&apos;re here to help with bookings, lost items, and complaints.</p>
        </div>
      </div>

      <section className="s wrap contact">
        <form className="form card contact-form" onSubmit={submit}>
          <Field label="Full name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Field label="Email" type="email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <div className="field-wrap">
            <label className="field-label">Message</label>
            <textarea className="field" rows="5" required onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          </div>
          <button className="btn btn-primary" type="submit">Send message</button>
        </form>
      </section>

      <Modal open={sent} onClose={() => setSent(false)}>
        <h3>Message sent</h3>
        <p className="muted" style={{ marginTop: 8 }}>Thank you — our team will reply within 24 hours.</p>
        <button className="btn btn-dark booking-full" onClick={() => setSent(false)}>Close</button>
      </Modal>
    </>
  );
}
