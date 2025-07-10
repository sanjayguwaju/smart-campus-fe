import { apiClient } from '../config/axios';
import { Course, CoursesResponse, CourseResponse, CreateCourseRequest, UpdateCourseRequest } from '../types/courses';

export const courseService = {
  // Get all courses with pagination
  async getCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CoursesResponse> {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  // Get course by id
  async getCourseById(id: string): Promise<CourseResponse> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Create course
  async createCourse(data: CreateCourseRequest): Promise<CourseResponse> {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  // Update course
  async updateCourse(id: string, data: UpdateCourseRequest): Promise<CourseResponse> {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  }
}; 