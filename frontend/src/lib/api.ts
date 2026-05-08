import axios from 'axios';

// Usar variable de entorno si existe (para producción en Vercel/Hostinger), sino usar local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStats = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  const response = await api.get(`/stats?${params.toString()}`);
  return response.data;
};

// --- CATEGORIAS EGRESO ---
export const getCategoriasEgreso = async () => {
  const response = await api.get('/categorias-egreso');
  return response.data;
};

export const createCategoriaEgreso = async (data: any) => {
  const response = await api.post('/categorias-egreso', data);
  return response.data;
};

export const updateCategoriaEgreso = async (id: number, data: any) => {
  const response = await api.put(`/categorias-egreso/${id}`, data);
  return response.data;
};

export const deleteCategoriaEgreso = async (id: number) => {
  const response = await api.delete(`/categorias-egreso/${id}`);
  return response.data;
};

// --- CONFIGURACION ---
export const getConfiguracion = async () => {
  const response = await api.get('/configuracion');
  return response.data;
};

export const updateConfiguracion = async (data: any) => {
  const response = await api.put('/configuracion', data);
  return response.data;
};

// --- LOTES ---
export const getLotes = async () => {
  const response = await api.get('/lotes');
  return response.data;
};

export const createLote = async (data: any) => {
  const response = await api.post('/lotes', data);
  return response.data;
};

export const updateLote = async (id: number, data: any) => {
  const response = await api.put(`/lotes/${id}`, data);
  return response.data;
};

export const deleteLote = async (id: number) => {
  const response = await api.delete(`/lotes/${id}`);
  return response.data;
};

// --- PRODUCTOS ---
export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

export const createProducto = async (data: any) => {
  const response = await api.post('/productos', data);
  return response.data;
};

export const updateProducto = async (id: number, data: any) => {
  const response = await api.put(`/productos/${id}`, data);
  return response.data;
};

export const deleteProducto = async (id: number) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

// --- INGRESOS ---
export const getIngresos = async () => {
  const response = await api.get('/ingresos');
  return response.data;
};

export const createIngreso = async (data: any) => {
  const response = await api.post('/ingresos', data);
  return response.data;
};

export const updateIngreso = async (id: number, data: any) => {
  const response = await api.put(`/ingresos/${id}`, data);
  return response.data;
};

export const deleteIngreso = async (id: number) => {
  const response = await api.delete(`/ingresos/${id}`);
  return response.data;
};

// --- EGRESOS ---
export const getEgresos = async () => {
  const response = await api.get('/egresos');
  return response.data;
};

export const createEgreso = async (data: any) => {
  const response = await api.post('/egresos', data);
  return response.data;
};

export const updateEgreso = async (id: number, data: any) => {
  const response = await api.put(`/egresos/${id}`, data);
  return response.data;
};

export const deleteEgreso = async (id: number) => {
  const response = await api.delete(`/egresos/${id}`);
  return response.data;
};

export default api;
