import { useState } from 'react';
import Chip from '../../components/ui/Chip/Chip.jsx';
import BookingModal from '../../components/booking/BookingModal.jsx';
import './Schedules.css';

const schedules = [
  { id: 'HZ-101', from: 'Hossana', to: 'Addis Ababa', dep: '06:00', arr: '10:30', price: 450, status: 'Boarding' },
  { id: 'HZ-102', from: 'Hossana', to: 'Addis Ababa', dep: '09:00', arr: '13:30', price: 450, status: 'Available' },
  { id: 'HZ-201', from: 'Hossana', to: 'Hawassa', dep: '07:30', arr: '10:45', price: 300, status: 'Full' },
  { id: 'HZ-202', from: 'Hossana', to: 'Hawassa', dep: '13:00', arr: '16:15', price: 300, status: 'Available' },
  { id: 'HZ-301', from: 'Hossana', to: 'Wolkite', dep: '08:00', arr: '10:45', price: 250, status: 'Boarding' },
];

const filters = ['All routes', 'Addis Ababa', 'Hawassa', 'Wolkite'];

export default function Schedules() {
  const [filter, setFilter] = useState('All routes');
  const [active, setActive] = useState(null);

  const rows =
    filter === 'All routes'
      ? schedules
      : schedules.filter((s) => s.to === filter);

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <h1>Bus Schedules</h1>
          <p>Live departures from Hossana Bus Station. Fares are per passenger, one way.</p>
        </div>
      </div>

      <section className="s wrap">
        <div className="chips">
          {filters.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Bus</th><th>Route</th><th>Departure</th><th>Arrival</th>
                <th>Fare</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.id}</b></td>
                  <td>{r.from} → {r.to}</td>
                  <td>{r.dep}</td>
                  <td>{r.arr}</td>
                  <td className="price">ETB {r.price}</td>
                  <td><span className={`st ${r.status}`}>{r.status}</span></td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setActive(r)}
                      disabled={r.status === 'Full'}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <BookingModal
        schedule={active}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
