const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // Server unreachable (e.g. backend turned off)
    throw new ApiError('Could not reach the server. Is the API running?', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some errors) — fine, data stays null
  }

  if (!res.ok) {
    const message =
      (data && (data.error || (data.errors && data.errors.join(' ')))) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.errors);
  }

  return data;
}

export const api = {
  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: { email, password } }),

  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),

  getTasks: (token) => request('/api/tasks', { token }),

  getTask: (id, token) => request(`/api/tasks/${id}`, { token }),

  createTask: (data, token) =>
    request('/api/tasks', { method: 'POST', body: data, token }),

  updateTask: (id, data, token) =>
    request(`/api/tasks/${id}`, { method: 'PUT', body: data, token }),

  deleteTask: (id, token) =>
    request(`/api/tasks/${id}`, { method: 'DELETE', token }),
};

export { ApiError };
