const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

// Datos mock para desarrollo sin backend
let mockTecnicos = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '12345678',
    fecha_nacimiento: '1990-05-15',
    genero: 'Masculino',
    ciudad: 'Bogotá',
    direccion: 'Calle 123 #45-67',
    telefono: '3001234567',
    email: 'juan.perez@email.com'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    cedula: '87654321',
    fecha_nacimiento: '1988-12-20',
    genero: 'Femenino',
    ciudad: 'Medellín',
    direccion: 'Carrera 80 #12-34',
    telefono: '3007654321',
    email: 'maria.gonzalez@email.com'
  }
];

let mockClientes = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    cedula: '11111111',
    fecha_nacimiento: '1985-03-10',
    genero: 'Masculino',
    ciudad: 'Cali',
    direccion: 'Avenida 6 #15-20',
    telefono: '3009876543',
    email: 'carlos.rodriguez@email.com'
  }
];

let mockTickets = [
  {
    id: '1',
    titulo: 'Problema con impresora',
    descripcion: 'La impresora no funciona correctamente',
    estado: 'Abierto',
    prioridad: 'Media',
    fecha_creacion: '2025-08-28',
    cliente_id: '1',
    tecnico_id: '1'
  }
];

// Función para simular delay de red
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

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
  list: async () => {
    await delay();
    return [...mockTecnicos];
  },
  create: async (data) => {
    await delay();
    const newItem = { ...data, id: (mockTecnicos.length + 1).toString() };
    mockTecnicos.push(newItem);
    return newItem;
  },
  update: async (id, data) => {
    await delay();
    const index = mockTecnicos.findIndex(item => item.id === id);
    if (index >= 0) {
      mockTecnicos[index] = { ...data, id };
      return mockTecnicos[index];
    }
    throw new Error('Técnico no encontrado');
  },
  remove: async (id) => {
    await delay();
    const index = mockTecnicos.findIndex(item => item.id === id);
    if (index >= 0) {
      mockTecnicos.splice(index, 1);
      return { success: true };
    }
    throw new Error('Técnico no encontrado');
  }
};

export const clientesApi = {
  list: async () => {
    await delay();
    return [...mockClientes];
  },
  create: async (data) => {
    await delay();
    const newItem = { ...data, id: (mockClientes.length + 1).toString() };
    mockClientes.push(newItem);
    return newItem;
  },
  update: async (id, data) => {
    await delay();
    const index = mockClientes.findIndex(item => item.id === id);
    if (index >= 0) {
      mockClientes[index] = { ...data, id };
      return mockClientes[index];
    }
    throw new Error('Cliente no encontrado');
  },
  remove: async (id) => {
    await delay();
    const index = mockClientes.findIndex(item => item.id === id);
    if (index >= 0) {
      mockClientes.splice(index, 1);
      return { success: true };
    }
    throw new Error('Cliente no encontrado');
  }
};

export const ticketsApi = {
  list: async () => {
    await delay();
    return [...mockTickets];
  },
  create: async (data) => {
    await delay();
    const newItem = { 
      ...data, 
      id: (mockTickets.length + 1).toString(),
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    mockTickets.push(newItem);
    return newItem;
  },
  update: async (id, data) => {
    await delay();
    const index = mockTickets.findIndex(item => item.id === id);
    if (index >= 0) {
      mockTickets[index] = { ...data, id };
      return mockTickets[index];
    }
    throw new Error('Ticket no encontrado');
  },
  remove: async (id) => {
    await delay();
    const index = mockTickets.findIndex(item => item.id === id);
    if (index >= 0) {
      mockTickets.splice(index, 1);
      return { success: true };
    }
    throw new Error('Ticket no encontrado');
  }
};
