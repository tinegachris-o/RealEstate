import axios from "axios";

const baseURL = "http://localhost:8000/api" || import.meta.env.VITE_API_URL;

const createAxios = axios.create({
  baseURL,
  withCredentials: true,
});

// Add an interceptor to attach the token from local storage (if available)
createAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default createAxios;
