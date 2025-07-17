import { apiClient } from '../config/axios';
import { LoginRequest, LoginResponse, User, RegisterRequest } from '../types/auth';

// Registration response interface
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
  timestamp: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/auth/profile');
    return response.data.data;
  },

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh');
    return response.data;
  },
};

export const resetPasswordRequest = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/reset-password-request', { email });
    return response.data.success;
  } catch (error) {
    console.error('Reset password request failed:', error);
    throw error;
  }
}; 