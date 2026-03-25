// app/services/api.ts
const API_BASE_URL = 'http://oixaf-189-235-159-67.a.free.pinggy.link/api';

export let TOKEN: string | null = null;

export const setToken = (token: string) => {
  TOKEN = token;
};

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();
  setToken(data.token);
  return data.token;
};

export const register = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  if (!res.ok) throw new Error('Register failed');
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) throw new Error('Error fetching tareas');
    return await response.json();
  },

  getTarea: async (id: number): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
    return await response.json();
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(tarea),
    });

    if (!response.ok) throw new Error('Error creating tarea');
    return await response.json();
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(tarea),
    });

    if (!response.ok) throw new Error(`Error updating tarea ${id}`);
    return await response.json();
  },

  deleteTarea: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
  },
};