import './HowItWorks.css';

const steps = [
  { n: 1, title: 'Choose your route', body: 'Pick from and to, then select a date.' },
  { n: 2, title: 'Select a schedule', body: 'Compare departure times and fares.' },
  { n: 3, title: 'Confirm your seat', body: 'Get a ticket code instantly.' },
];

export default function HowItWorks() {
  return (
    <section className="s how">
      <div className="wrap">
        <div className="sh">
          <div>
            <div className="eyebrow">How it works</div>
            <h2>Reserve in three steps</h2>
          </div>
        </div>

        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className="card step">
              <div className="n">{s.n}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
