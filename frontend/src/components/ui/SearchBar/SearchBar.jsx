import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ className = '', onSearch }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (onSearch) return onSearch(q);
    if (q.trim()) navigate(`/routes?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={submit}>
      <input
        type="text"
        placeholder="Search routes…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" aria-label="Search">🔍</button>
    </form>
  );
}
