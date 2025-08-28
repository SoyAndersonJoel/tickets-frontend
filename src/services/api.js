// APIs usando Firebase
import { tecnicosService, clientesService, ticketsService } from '../firebase/services';
import { authService } from '../firebase/auth';

// Función para simular delay (opcional, para testing)
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (email, password) => {
    await delay();
    return authService.login(email, password);
  }
};

export const tecnicosApi = {
  list: async () => {
    await delay();
    return tecnicosService.list();
  },
  create: async (data) => {
    await delay();
    return tecnicosService.create(data);
  },
  update: async (id, data) => {
    await delay();
    return tecnicosService.update(id, data);
  },
  remove: async (id) => {
    await delay();
    return tecnicosService.remove(id);
  }
};

export const clientesApi = {
  list: async () => {
    await delay();
    return clientesService.list();
  },
  create: async (data) => {
    await delay();
    return clientesService.create(data);
  },
  update: async (id, data) => {
    await delay();
    return clientesService.update(id, data);
  },
  remove: async (id) => {
    await delay();
    return clientesService.remove(id);
  }
};

export const ticketsApi = {
  list: async () => {
    await delay();
    return ticketsService.list();
  },
  create: async (data) => {
    await delay();
    const ticketData = {
      ...data,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    return ticketsService.create(ticketData);
  },
  update: async (id, data) => {
    await delay();
    return ticketsService.update(id, data);
  },
  remove: async (id) => {
    await delay();
    return ticketsService.remove(id);
  }
};
