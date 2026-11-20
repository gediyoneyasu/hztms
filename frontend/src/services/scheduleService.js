import { request } from './api.js';

export const getSchedules = (params = '') => request(`/schedules${params}`);
export const getScheduleById = (id) => request(`/schedules/${id}`);
