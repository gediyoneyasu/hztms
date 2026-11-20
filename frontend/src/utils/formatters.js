export const formatCurrency = (n) => `ETB ${Number(n).toLocaleString()}`;

export const generateTicketCode = () =>
  'HZ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
