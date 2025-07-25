import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

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
    return response;
  },
  (error) => {
    // Don't redirect to login for public endpoints
    const publicEndpoints = ["/programs", "/events", "/notices", "/blog"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !isPublicEndpoint) {
      // Clear auth data and redirect to login only for protected endpoints
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
