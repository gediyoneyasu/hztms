import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';
import './Booking.css';

const STEPS = ['Search', 'Buses', 'Seats', 'Details', 'Payment', 'Ticket'];

export default function Booking() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const formatStation = (station) => {
    if (!station) return 'Hossana';
    const s = station.toLowerCase();
    if (s.includes('hossana')) return station;
    if (s.includes('aroge') || s.includes('adissu') || s.includes('adisu')) return `Hossana - ${station}`;
    return station;
  };

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [allSchedules, setAllSchedules] = useState([]);

  // Initialize search with URL params if they exist
  const [search, setSearch] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
    passengers: 1,
  });

  const [available, setAvailable] = useState([]);
  const [searching, setSearching] = useState(false);

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [passenger, setPassenger] = useState({ name: '', phone: '' });
  const [payment, setPayment] = useState('Telebirr');

  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Load schedules from Admin
  useEffect(() => {
    fetch(`${API_URL}/schedules`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setAllSchedules(list);

        // If no URL params, auto-select the first available route
        if (!searchParams.get('from') && list.length > 0) {
          setSearch(prev => ({
            ...prev,
            from: list[0].from || 'Hossana',
            to: list[0].to
          }));
        }
      })
      .catch(err => console.error("Failed to load schedules", err));
  }, [searchParams]);

  // 2. Dynamic From/To dropdowns
  const fromCities = useMemo(() => {
    return [...new Set(allSchedules.map(s => s.from || 'Hossana'))];
  }, [allSchedules]);

  const toCities = useMemo(() => {
    return [...new Set(
      allSchedules
        .filter(s => (s.from || 'Hossana') === search.from)
        .map(s => s.to)
    )];
  }, [allSchedules, search.from]);

  // Ensure "To" is valid when "From" changes
  useEffect(() => {
    if (toCities.length > 0 && !toCities.includes(search.to)) {
      setSearch(prev => ({ ...prev, to: toCities[0] }));
    }
  }, [toCities, search.to]);

  const totalPrice = useMemo(
    () => (bus ? Number(bus.price) * selectedSeats.length : 0),
    [bus, selectedSeats]
  );

  const seats = useMemo(() => {
    if (!bus) return [];
    const total = 40;
    const taken = bus.takenSeats || [];
    return Array.from({ length: total }, (_, i) => ({
      id: i + 1,
      label: `${Math.ceil((i + 1) / 4)}${['A', 'B', 'C', 'D'][i % 4]}`,
      taken: taken.includes(i + 1),
    }));
  }, [bus]);

  // 5. SEARCH BUSES
  const searchBuses = (e) => {
    e.preventDefault();
    setError('');
    setSearching(true);
    
    const matches = allSchedules.filter(s =>
      (!s.from || s.from === search.from) &&
      s.to === search.to &&
      (s.status || 'Confirmed') !== 'Cancelled'
    );
    
    setAvailable(matches);
    setStep(1);
    setSearching(false);
  };

  // 7. SELECT BUS
  const chooseBus = (b) => {
    setBus(b);
    setSelectedSeats([]);
    setStep(2);
  };

  // 8. SELECT SEAT
  const toggleSeat = (seat) => {
    if (seat.taken) return;
    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) return prev.filter(id => id !== seat.id);
      if (prev.length >= Number(search.passengers)) return prev;
      return [...prev, seat.id];
    });
  };

  // 9. PASSENGER DETAILS
  const submitPassenger = (e) => {
    e.preventDefault();
    if (selectedSeats.length !== Number(search.passengers)) {
      setError(`Please select exactly ${search.passengers} seat(s).`);
      return;
    }
    setError('');
    setStep(4);
  };

  // 10 + 11. PAYMENT & CONFIRM
  const payAndConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: bus._id,
          userEmail: user?.email || 'guest@example.com',
          passengerName: passenger.name,
          userEmail: user?.email || 'guest@example.com',
          phone: passenger.phone,
          seats: Number(search.passengers),
          seatLabels: selectedSeats.map(id => seats.find(s => s.id === id)?.label).filter(Boolean),
          paymentMethod: payment,
          travelDate: search.date,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setBooking({
        ...data,
        bus,
        seats: selectedSeats.map(id => seats.find(s => s.id === id)?.label).filter(Boolean),
        travelDate: search.date,
        from: search.from,
        to: search.to,
        payment,
      });
      setStep(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setBus(null);
    setAvailable([]);
    setSelectedSeats([]);
    setPassenger({ name: '', phone: '' });
    setPayment('Telebirr');
    setBooking(null);
    setError('');
  };

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>{lang === 'am' ? 'የአውቶቡስ ትኬት ያስይዙ' : 'Book Your Bus Ticket'}</h1>
          <p>{lang === 'am' ? 'ፈልግ፣ መቀመጫ ምረጥ፣ ክፈል እና ኢ-ቲኬትህን በቅጽበት አግኝ።' : 'Search, pick your seat, pay, and get your e-ticket instantly.'}</p>
        </div>
      </div>

      <div className="wrap s">
        <ol className="steps">
          {STEPS.map((label, i) => (
            <li key={label} className={i === step ? 'on' : i < step ? 'done' : ''}>
              <span>{i + 1}</span>
              <small>{label}</small>
            </li>
          ))}
        </ol>

        {error && <div className="booking-error">{error}</div>}

        {step === 0 && (
          <form className="card booking-form" onSubmit={searchBuses}>
            <h2>{t('search')}</h2>
            <div className="grid-2">
              <div className="field-wrap">
                <label className="field-label">1. {t('from')}</label>
                <select className="field" value={search.from} onChange={e => setSearch({ ...search, from: e.target.value })}>
                  {fromCities.map(c => <option key={c} value={c}>{formatStation(c)}</option>)}
                </select>
              </div>
              <div className="field-wrap">
                <label className="field-label">2. {t('to')}</label>
                <select className="field" value={search.to} onChange={e => setSearch({ ...search, to: e.target.value })}>
                  {toCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-wrap">
                <label className="field-label">3. {t('date')}</label>
                <input className="field" type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })} required />
              </div>
              <div className="field-wrap">
                <label className="field-label">4. Passengers</label>
                <select className="field" value={search.passengers} onChange={e => setSearch({ ...search, passengers: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary booking-submit" type="submit" disabled={searching}>
              {searching ? 'Searching…' : '5. Search Buses'}
            </button>
          </form>
        )}

        {step === 1 && (
          <div>
            <h2 className="section-title">6. Available Buses</h2>
            {available.length === 0 ? (
              <p className="muted">No buses found for {search.from} → {search.to} on {search.date}. Try another date or route.</p>
            ) : (
              <div className="bus-list">
                {available.map(b => (
                  <div key={b._id} className="bus-card">
                    <div className="bus-info">
                      <div className="bus-name">
                        <b>{b.busId}</b>
                        <span className="chip">{b.type || 'Standard'}</span>
                      </div>
                      <div className="bus-route">
                        <span><b>{b.departure}</b> Depart</span>
                        <span>→</span>
                        <span><b>{b.arrival}</b> Arrive</span>
                      </div>
                      <div className="bus-meta">
                        <span>{(b.from || 'Hossana')} → {b.to}</span>
                      </div>
                    </div>
                    <div className="bus-price">
                      <div className="price">ETB {b.price}</div>
                      <button className="btn btn-primary" onClick={() => chooseBus(b)}>7. Select Bus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(0)}>← Back to Search</button>
            </div>
          </div>
        )}

        {step === 2 && bus && (
          <div>
            <h2 className="section-title">8. Available Seats — pick {search.passengers}</h2>
            <p className="muted">
              Bus {bus.busId} · {bus.departure} – {bus.arrival} · ETB {bus.price} per seat
            </p>
            <div className="seat-layout">
              <div className="driver">🚌 Driver</div>
              <div className="seat-grid">
                {seats.map(s => (
                  <button
                    key={s.id}
                    className={`seat ${s.taken ? 'taken' : ''} ${selectedSeats.includes(s.id) ? 'picked' : ''}`}
                    onClick={() => toggleSeat(s)}
                    disabled={s.taken}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="legend">
              <span><i className="seat" /> Available</span>
              <span><i className="seat picked" /> Selected</span>
              <span><i className="seat taken" /> Taken</span>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back to Buses</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} disabled={selectedSeats.length !== Number(search.passengers)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="card booking-form" onSubmit={submitPassenger}>
            <h2>9. Passenger Details</h2>
            <div className="field-wrap">
              <label className="field-label">Full name</label>
              <input className="field" required value={passenger.name} onChange={e => setPassenger({ ...passenger, name: e.target.value })} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Phone number</label>
              <input className="field" required value={passenger.phone} onChange={e => setPassenger({ ...passenger, phone: e.target.value })} />
            </div>
            <div className="booking-summary">
              <div className="row"><span>Route</span><b>{search.from} → {search.to}</b></div>
              <div className="row"><span>Date</span><b>{search.date}</b></div>
              <div className="row"><span>Bus</span><b>{bus.busId} ({bus.departure} – {bus.arrival})</b></div>
              <div className="row"><span>Seats</span><b>{selectedSeats.map(id => seats.find(s => s.id === id)?.label).join(', ')}</b></div>
              <div className="row total"><span>Total</span><b>ETB {totalPrice}</b></div>
            </div>
            <div className="step-actions">
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back to Seats</button>
              <button type="submit" className="btn btn-primary">Continue to Payment →</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="card booking-form">
            <h2>10. Payment</h2>
            <p className="muted">Amount due: <b>ETB {totalPrice}</b></p>
            <div className="pay-options">
              {['Telebirr', 'Chapa', 'Cash on Board'].map(p => (
                <label key={p} className={`pay-option ${payment === p ? 'on' : ''}`}>
                  <input type="radio" name="pay" value={p} checked={payment === p} onChange={() => setPayment(p)} />
                  <span>{p}</span>
                </label>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={payAndConfirm} disabled={submitting}>
                {submitting ? 'Processing…' : 'Pay & Confirm'}
              </button>
            </div>
          </div>
        )}

        {step === 5 && booking && (
          <div className="card booking-form ticket-wrap">
            <div className="confirm-badge">11. Booking Confirmed!</div>
            <h2>12. Your E-Ticket</h2>
            <div className="eticket">
              <div className="eticket-left">
                <div className="eticket-ref">Ref: <b>{booking.ticketCode}</b></div>
                <div className="eticket-row"><span>From</span><b>{booking.from}</b></div>
                <div className="eticket-row"><span>To</span><b>{booking.to}</b></div>
                <div className="eticket-row"><span>Date</span><b>{booking.travelDate}</b></div>
                <div className="eticket-row"><span>Departure</span><b>{booking.bus?.departure}</b></div>
                <div className="eticket-row"><span>Bus</span><b>{booking.bus?.busId}</b></div>
                <div className="eticket-row"><span>Seats</span><b>{booking.seats.join(', ')}</b></div>
                <div className="eticket-row"><span>Passenger</span><b>{booking.passengerName}</b></div>
                <div className="eticket-row"><span>Payment</span><b>{booking.payment}</b></div>
                <div className="eticket-row total"><span>Total</span><b>ETB {totalPrice}</b></div>
              </div>
              <div className="eticket-right">
                <QRCodeSVG
                  value={`HZTMS|${booking.ticketCode}|${booking.passengerName}|${booking.from}-${booking.to}|${booking.travelDate}`}
                  size={180}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
                <small>Scan at the gate</small>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
              <button className="btn btn-primary" onClick={reset}>New Booking</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



