import { apiClient } from '../config/axios';
 
export const getDepartments = () => apiClient.get('/departments');
export const getDepartmentById = (id: string) => apiClient.get(`/departments/${id}`);
export const createDepartment = (data: any) => apiClient.post('/departments', data);
export const updateDepartment = (id: string, data: any) => apiClient.put(`/departments/${id}`, data);
export const deleteDepartment = (id: string) => apiClient.delete(`/departments/${id}`); 