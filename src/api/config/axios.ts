import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

console.log("=== AXIOS CONFIG ===");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Environment:", import.meta.env);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    console.log("=== REQUEST INTERCEPTOR ===");
    console.log("URL:", config.url);
    console.log("Base URL:", config.baseURL);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Method:", config.method);
    console.log("Data:", config.data);
    console.log("Has token:", !!accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("=== RESPONSE SUCCESS ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    return response;
  },
  (error) => {
    console.error("=== RESPONSE ERROR ===");
    console.error("Status:", error?.response?.status);
    console.error("Data:", error?.response?.data);
    console.error("Message:", error?.message);

    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
