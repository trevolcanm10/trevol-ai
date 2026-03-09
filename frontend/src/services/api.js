import axios from 'axios'; // importando a biblioteca axios

const API_BASE = "http://127.0.0.1:8000/api";// Definimos la url de la api

export const getFlights = (params) =>
  axios.get(`${API_BASE}/search`, { params });// Traemos los vuelos

export const getHotels = (params) =>
  axios.get(`${API_BASE}/search`, { params });// Traemos los hoteles

export const getTours = (params) =>
  axios.get(`${API_BASE}/search`, { params });// Traemos los tours

export const searchTravel = (params) =>
  axios.get(`${API_BASE}/search`, { params });// Traemos los viajes


export const getPackage = (origin, destination) =>
  axios.get(`${API_BASE}/packages`, { params: { origin, destination } });// Traemos el paquete

export const getRecommendations = (userId) =>
  axios.get(`${API_BASE}/recommendations`, { params: { user_id: userId } });// Traemos las recomendaciones

export const createBooking = (data) =>
  axios.post(`${API_BASE}/bookings`, data);// Creamos la reserva