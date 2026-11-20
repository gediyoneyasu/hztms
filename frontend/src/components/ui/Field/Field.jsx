import './Field.css';

export default function Field({ label, className = '', ...rest }) {
  return (
    <div className="field-wrap">
      {label && <label className="field-label">{label}</label>}
      <input className={`field ${className}`} {...rest} />
    </div>
  );
}
