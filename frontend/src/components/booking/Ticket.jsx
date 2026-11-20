export default function Ticket({ code, name, seats, schedule, onDone }) {
  return (
    <>
      <h3>Booking confirmed 🎉</h3>
      <p className="muted booking-meta">
        {schedule?.from} → {schedule?.to} · {schedule?.dep}
      </p>

      <div className="ticket-box">
        <div className="muted" style={{ fontSize: 12 }}>Ticket code</div>
        <div className="ticket-code">{code}</div>
        <div style={{ marginTop: 8, fontSize: 14 }}>
          {name} · {seats} seat(s)
        </div>
      </div>

      <button className="btn btn-dark booking-full" onClick={onDone}>
        Done
      </button>

      <style>{`
        .ticket-box {
          border: 2px dashed var(--border);
          border-radius: 12px;
          padding: 18px;
          text-align: center;
          margin-top: 14px;
        }
        .ticket-code {
          font-family: monospace;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--primary);
        }
      `}</style>
    </>
  );
}
