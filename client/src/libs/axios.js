import axios from "axios";
const createAxios = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});
// Add an interceptor to attach the token from local storage (if available)
createAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // adjust based on where you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default createAxios;
