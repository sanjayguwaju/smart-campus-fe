import { apiClient } from '../config/axios';
import {
  DepartmentResponse,
  DepartmentsResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '../types/departments';

interface GetDepartmentsParams {
  search?: string;
}

const departmentService = {
  // Get all departments
  getDepartments: async ({ search }: GetDepartmentsParams = {}): Promise<DepartmentsResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    const response = await apiClient.get<DepartmentsResponse>('/departments', { params });
    return response.data.data;
  },

  // Get department by ID
  getDepartmentById: async (id: string): Promise<DepartmentResponse> => {
    const response = await apiClient.get<DepartmentResponse>(`/departments/${id}`);
    return response.data;
  },

  // Create department
  createDepartment: async (data: CreateDepartmentRequest): Promise<DepartmentResponse> => {
    const response = await apiClient.post<DepartmentResponse>('/departments', data);
    return response.data;
  },

  // Update department
  updateDepartment: async (id: string, data: UpdateDepartmentRequest): Promise<DepartmentResponse> => {
    const response = await apiClient.put<DepartmentResponse>(`/departments/${id}`, data);
    return response.data;
  },

  // Delete department
  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};

export { departmentService }; 