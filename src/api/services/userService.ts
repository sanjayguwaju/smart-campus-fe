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
  async getUsers(page = 1, limit = 10): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>(
      `/users?page=${page}&limit=${limit}`
    );
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
