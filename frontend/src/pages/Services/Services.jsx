import './Services.css';

const services = [
  { icon: '🎫', title: 'Seat Reservation', body: 'Book online or at the station counter.' },
  { icon: '🔍', title: 'Lost & Found', body: 'Report lost items and check found property.' },
  { icon: '📝', title: 'Complaints', body: 'File a complaint and track its resolution.' },
  { icon: '🚶', title: 'Walk-in Booking', body: 'Same-day tickets subject to availability.' },
];

export default function Services() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>Our Services</h1>
          <p>Everything you need for a smooth journey.</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="grid">
          {services.map((s) => (
            <article key={s.title} className="card lift svc-card">
              <div className="svc-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
