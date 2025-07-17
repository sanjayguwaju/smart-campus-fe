import { apiClient } from "../config/axios";
import {
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesResponse,
  CourseResponse,
  CreateCourseResponse,
} from "../types/courses";

export const courseService = {
  async getCourses(page = 1, limit = 10, search?: string, filters?: {
    status?: string;
    department?: string;
    instructor?: string;
    semester?: string;
    academicYear?: string;
  }): Promise<CoursesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);
    }

    const response = await apiClient.get<CoursesResponse>(`/courses?${params.toString()}`);
    return response.data;
  },

  async getCourse(id: string): Promise<CourseResponse> {
    const response = await apiClient.get<CourseResponse>(`/courses/${id}`);
    return response.data;
  },

  async createCourse(courseData: CreateCourseRequest): Promise<CreateCourseResponse> {
    const response = await apiClient.post<CreateCourseResponse>(
      "/courses",
      courseData
    );
    return response.data;
  },

  async updateCourse(
    id: string,
    courseData: UpdateCourseRequest
  ): Promise<CourseResponse> {
    const response = await apiClient.put<CourseResponse>(
      `/courses/${id}`,
      courseData
    );
    return response.data;
  },

  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/courses/${id}`);
    return response.data;
  },

  async activateCourse(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/courses/${id}/activate`);
    return response.data;
  },

  async deactivateCourse(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/courses/${id}/deactivate`);
    return response.data;
  },
}; 