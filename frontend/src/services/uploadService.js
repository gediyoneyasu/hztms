import { API_URL } from '../utils/constants.js';

export async function uploadImage(file) {
  const body = new FormData();
  body.append('image', file);

  const res = await fetch(`${API_URL}/uploads`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Image upload failed');
  return data.url;
}
