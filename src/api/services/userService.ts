import { apiClient } from '../config/axios';
import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  UsersResponse, 
  UserResponse,
  CreateUserResponse,
  ResetPasswordResponse
} from '../types/users';

export async function getUsers(params?: { 
  role?: string, 
  page?: number, 
  limit?: number,
  search?: string,
  status?: string,
  department?: string,
  isEmailVerified?: string,
  dateRange?: string
}): Promise<UsersResponse> {
  let url = '/users';
  const query: string[] = [];
  
  if (params?.role) query.push(`role=${params.role}`);
  if (params?.page) query.push(`page=${params.page}`);
  if (params?.limit) query.push(`limit=${params.limit}`);
  if (params?.search) query.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.status) query.push(`status=${params.status}`);
  if (params?.department) query.push(`department=${encodeURIComponent(params.department)}`);
  if (params?.isEmailVerified) query.push(`isEmailVerified=${params.isEmailVerified}`);
  if (params?.dateRange) query.push(`dateRange=${params.dateRange}`);
  
  if (query.length) url += `?${query.join('&')}`;
  const response = await apiClient.get<UsersResponse>(url);
  return response.data.data;
}

export const userService = {
  getUsers,
  async getUser(id: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response.data;
  },
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiClient.post<CreateUserResponse>('/users', userData);
    return response.data;
  },
  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>(`/users/${id}`, userData);
    return response.data;
  },
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data;
  },
  async activateUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{ success: boolean; message: string }>(`/users/${id}/activate`);
    return response.data;
  },
  async deactivateUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{ success: boolean; message: string }>(`/users/${id}/deactivate`);
    return response.data;
  },
  async resetPassword(userId: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
      userId,
      newPassword,
      confirmPassword
    });
    return response.data;
  },
}; 