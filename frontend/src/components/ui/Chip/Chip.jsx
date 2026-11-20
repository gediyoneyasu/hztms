import './Chip.css';

export default function Chip({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'on' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
