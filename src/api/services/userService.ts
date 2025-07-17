import { apiClient } from "../config/axios";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
  UserResponse,
  CreateUserResponse,
  ResetPasswordResponse,
} from "../types/users";

export const userService = {
  async getUsers(page = 1, limit = 10, search?: string, filters?: {
    role?: string;
    status?: string;
    department?: string;
    isEmailVerified?: string;
    dateRange?: string;
  }): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      if (filters.isEmailVerified) params.append('isEmailVerified', filters.isEmailVerified);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
    }

    const response = await apiClient.get<UsersResponse>(`/users?${params.toString()}`);
    return response.data;
  },

  async getUser(id: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiClient.post<CreateUserResponse>(
      "/users",
      userData
    );
    return response.data;
  },

  async verifyUser(userId: string): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>(
      `/users/${userId}/verify`
    );
    return response.data;
  },

  async unverifyUser(userId: string): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>(
      `/users/${userId}/unverify`
    );
    return response.data;
  },

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>(
      `/users/${id}`,
      userData
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/users/${id}`);
    return response.data;
  },

  async activateUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/users/${id}/activate`);
    return response.data;
  },

  async deactivateUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/users/${id}/deactivate`);
    return response.data;
  },

  async resetPassword(
    userId: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      {
        userId,
        newPassword,
        confirmPassword,
      }
    );
    return response.data;
  },
};
