import { API_URL } from '../utils/constants.js';

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with ${res.status}`);
  }

  return res.json();
}
