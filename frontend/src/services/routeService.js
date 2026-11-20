import { request } from './api.js';

export const getRoutes = () => request('/routes');
