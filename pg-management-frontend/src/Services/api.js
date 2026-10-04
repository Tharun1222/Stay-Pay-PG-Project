import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8083/api"
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;