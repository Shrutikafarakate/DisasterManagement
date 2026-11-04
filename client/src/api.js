import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// 🔹 AUTOMATICALLY ATTACH TOKEN TO EVERY REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function logout() {
  localStorage.removeItem("token");
}


export default api;