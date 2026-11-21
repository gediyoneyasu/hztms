const PRODUCTION_API = 'https://hztms-backend.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

function resolveApiUrl() {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const onLocalhost = host === 'localhost' || host === '127.0.0.1';
  const configured = import.meta.env.VITE_API_URL;

  if (onLocalhost) return configured || LOCAL_API;
  if (configured && !String(configured).includes('localhost')) return configured;
  return PRODUCTION_API;
}

export const API_URL = resolveApiUrl();
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

export const ROUTE_OPTIONS = ['Hossana', 'Addis Ababa', 'Hawassa', 'Wolkite', 'Butajira'];
