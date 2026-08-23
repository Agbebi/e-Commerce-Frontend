import axios from "axios";

const baseURL = "https://e-commerce-backend-8j28.onrender.com";
const devUrl = "http://localhost:3000";

const API = axios.create({
  baseURL: baseURL, // Use devUrl for local development, change to baseURL for production
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove default Content-Type for FormData requests
API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export default API;
