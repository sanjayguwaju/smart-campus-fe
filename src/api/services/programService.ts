import { apiClient } from '../config/axios';
import { Program } from '../types/programs';

export const getPrograms = () => apiClient.get('/programs');
export const getProgramById = (id: string) => apiClient.get(`/programs/${id}`);
export const createProgram = (data: any) => apiClient.post('/programs', data);
export const updateProgram = (id: string, data: any) => apiClient.put(`/programs/${id}`, data);
export const deleteProgram = (id: string) => apiClient.delete(`/programs/${id}`);
export const publishProgram = (id: string) => apiClient.put(`/programs/${id}/publish`, { isPublished: true });
export const unpublishProgram = (id: string) => apiClient.put(`/programs/${id}/publish`, { isPublished: false }); 