export const API_PATH = process.env.VITE_APP_API_URL ?? 'http://localhost:8080/';
export const JWT_TOKEN = '_JWT';
export const USER_COOKIE = '_USER';

export const ENUM_INCIDENT_STATUSES = {
  open: 'OPEN',
  inProgress: 'IN_PROGRESS',
  resolved: 'RESOLVED',
  closed: 'CLOSED',
};
