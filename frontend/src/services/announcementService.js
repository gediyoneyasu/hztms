import { request } from './api.js';

export const getAnnouncements = () => request('/announcements');
