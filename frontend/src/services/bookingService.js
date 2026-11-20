import { request } from './api.js';

export const createBooking = (payload) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(payload) });

export const getBookingByCode = (code) => request(`/bookings/${code}`);
