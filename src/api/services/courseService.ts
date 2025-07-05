import { apiClient } from '../config/axios';

export const getCourses = () => apiClient.get('/courses');
export const getCourseById = (id: string) => apiClient.get(`/courses/${id}`);
export const createCourse = (data: any) => apiClient.post('/courses', data);
export const updateCourse = (id: string, data: any) => apiClient.put(`/courses/${id}`, data);
export const deleteCourse = (id: string) => apiClient.delete(`/courses/${id}`); 