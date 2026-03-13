import axios from 'axios'; // importando a biblioteca axios

const API_BASE = "http://127.0.0.1:8000/api";// Definimos la url de la api

const api = axios.create({ baseURL: API_BASE });// Creamos la instancia de la api

// Interceptor para enviar el token automáticamente
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

// funciones de tu API
export const getFlights = (params) =>
  api.get("/search", { params });

export const getHotels = (params) =>
  api.get("/search", { params });

export const getTours = (params) =>
  api.get("/search", { params });

export const searchTravel = (params) =>
  api.get("/search", { params });

export const getPackage = (origin, destination) =>
  api.get("/packages", { params: { origin, destination } });

export const getRecommendations = (userId) =>
  api.get("/recommendations", { params: { user_id: userId } });

export const createBooking = (data) =>
  api.post("/bookings/", data);

export default api;