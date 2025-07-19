import { apiClient } from "../config/axios";
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentsResponse,
  DepartmentResponse,
  CreateDepartmentResponse,
} from "../types/departments";

export const departmentService = {
  async getDepartments(page = 1, limit = 10, search?: string, filters?: {
    status?: string;
    name?: string;
    dateRange?: string;
  }): Promise<DepartmentsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.name) params.append('name', filters.name);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
    }

    const response = await apiClient.get<DepartmentsResponse>(`/departments?${params.toString()}`);
    return response.data;
  },

  async getDepartment(id: string): Promise<DepartmentResponse> {
    const response = await apiClient.get<DepartmentResponse>(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(departmentData: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
    const response = await apiClient.post<CreateDepartmentResponse>(
      "/departments",
      departmentData
    );
    return response.data;
  },

  async updateDepartment(
    id: string,
    departmentData: UpdateDepartmentRequest
  ): Promise<DepartmentResponse> {
    const response = await apiClient.put<DepartmentResponse>(
      `/departments/${id}`,
      departmentData
    );
    return response.data;
  },

  async deleteDepartment(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/departments/${id}`);
    return response.data;
  },

  async activateDepartment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/departments/${id}/activate`);
    return response.data;
  },

  async deactivateDepartment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/departments/${id}/deactivate`);
    return response.data;
  },
}; 