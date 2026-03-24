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
// Interceptor para renovar el token automáticamente
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Si el token expiró (401)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.refresh_token) {
          throw new Error("No refresh token");
        }

        // Pedir nuevo access token
        const response = await axios.post(
          `${API_BASE}/auth/refresh`,
          {
            refresh_token: user.refresh_token
          }
        );

        const newAccessToken =
          response.data.access_token;

        // Guardar nuevo token
        user.access_token = newAccessToken;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        // Reintentar request original
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        console.log(
          "Refresh token inválido"
        );

        localStorage.removeItem("user");

        window.location.href = "/login";

      }

    }

    return Promise.reject(error);

  }
);
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

export const getUserBookings = () =>
  api.get("/bookings/me");

export default api;