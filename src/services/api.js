const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

function headers() {
  const token = localStorage.getItem('auth_token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handle(res);
  }
};

export const tecnicosApi = {
  list: async () => handle(await fetch(`${BASE_URL}/tecnicos`, { headers: headers() })),
  create: async (data) => handle(await fetch(`${BASE_URL}/tecnicos`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  update: async (id, data) => handle(await fetch(`${BASE_URL}/tecnicos/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  remove: async (id) => handle(await fetch(`${BASE_URL}/tecnicos/${id}`, { method: 'DELETE', headers: headers() }))
};

export const clientesApi = {
  list: async () => handle(await fetch(`${BASE_URL}/clientes`, { headers: headers() })),
  create: async (data) => handle(await fetch(`${BASE_URL}/clientes`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  update: async (id, data) => handle(await fetch(`${BASE_URL}/clientes/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  remove: async (id) => handle(await fetch(`${BASE_URL}/clientes/${id}`, { method: 'DELETE', headers: headers() }))
};

export const ticketsApi = {
  list: async () => handle(await fetch(`${BASE_URL}/tickets`, { headers: headers() })),
  create: async (data) => handle(await fetch(`${BASE_URL}/tickets`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  update: async (id, data) => handle(await fetch(`${BASE_URL}/tickets/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  remove: async (id) => handle(await fetch(`${BASE_URL}/tickets/${id}`, { method: 'DELETE', headers: headers() }))
};
