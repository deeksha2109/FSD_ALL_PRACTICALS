// Simple API client using fetch with JWT support
const API_BASE = ''; // use vite proxy: '' so requests go to /api

export const getToken = () => localStorage.getItem('auth_token') || '';
export const setToken = (t) => localStorage.setItem('auth_token', t || '');
export const clearToken = () => localStorage.removeItem('auth_token');

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = (data && data.message) || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export const authApi = {
  signup: (payload) => api.post('/auth/signup', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const bookingApi = {
  create: (payload) => api.post('/bookings', payload),
};

export const carsApi = {
  list: () => api.get('/cars'),
  seed: () => api.post('/cars/seed', {}),
};

export const adminApi = {
  listBookings: () => api.get('/admin/bookings'),
  approveBooking: (id) => api.patch(`/admin/bookings/${id}/approve`, {}),
  rejectBooking: (id) => api.patch(`/admin/bookings/${id}/reject`, {}),
};
