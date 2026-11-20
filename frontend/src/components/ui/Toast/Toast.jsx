import './Toast.css';

export default function Toast({ message, show, onClose }) {
  if (!show) return null;
  return (
    <div className="toast-popup">
      <span>✅ {message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}
