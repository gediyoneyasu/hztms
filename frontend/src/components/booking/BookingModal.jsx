import { useState, useEffect } from 'react';
import Modal from '../ui/Modal/Modal.jsx';
import Field from '../ui/Field/Field.jsx';
import Ticket from './Ticket.jsx';
import Toast from '../ui/Toast/Toast.jsx';
import { createBooking } from '../../services/bookingService.js';
import './BookingModal.css';

export default function BookingModal({ schedule, open, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const close = () => {
    setName('');
    setPhone('');
    setSeats(1);
    setCode(null);
    onClose();
  };

  const confirm = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await createBooking({
        scheduleId: schedule._id,
        passengerName: name,
        phone: phone,
        seats: Number(seats)
      });
      setCode(res.ticketCode);
      setShowToast(true);
      
      // Close toast and modal after 3.5 seconds
      setTimeout(() => {
        setShowToast(false);
        close();
      }, 3500);

    } catch (err) {
      alert('Failed to book: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={close}>
        {!code ? (
          <>
            <h3>Confirm your booking</h3>
            <p className="muted booking-meta">
              {schedule?.from} → {schedule?.to} · {schedule?.departure} · ETB {schedule?.price}
            </p>

            <div className="row">
              <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="row">
              <Field label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </div>
            <div className="row">
              <Field label="Seats" type="number" min="1" max="5" value={seats} onChange={(e) => setSeats(e.target.value)} />
            </div>

            <button className="btn btn-primary booking-full" onClick={confirm} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm reservation'}
            </button>
            <button className="btn btn-outline booking-full" onClick={close}>
              Cancel
            </button>
          </>
        ) : (
          <Ticket
            code={code}
            name={name}
            seats={seats}
            schedule={schedule}
            onDone={close}
          />
        )}
      </Modal>

      <Toast 
        message="Booking confirmed! Check your ticket." 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
}
