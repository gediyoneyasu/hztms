import './Card.css';

export default function Card({ children, className = '', lift = false }) {
  return (
    <div className={`card ${lift ? 'lift' : ''} ${className}`}>{children}</div>
  );
}
