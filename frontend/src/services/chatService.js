import { request } from './api.js';

export const sendChatMessage = (message) =>
  request('/chat', { method: 'POST', body: JSON.stringify({ message }) });
