import { apiClient } from '../config/axios';
import {
  CourseGradeData,
  CreateCourseGradeRequest,
  UpdateCourseGradeRequest,
  CourseGradeFilters,
  CourseGradesResponse,
  CourseGradeResponse,
  BulkGradeSubmissionRequest,
  AutoCalculateGradesRequest
} from '../types/courseGrades';

const BASE_URL = '/course-grades';

export const courseGradeService = {
  // Get course grades by faculty
  getFacultyCourseGrades: async (
    page = 1,
    limit = 10,
    filters?: CourseGradeFilters
  ): Promise<CourseGradesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.semester && { semester: filters.semester.toString() }),
      ...(filters?.academicYear && { academicYear: filters.academicYear }),
      ...(filters?.course && { course: filters.course }),
      ...(filters?.status && { status: filters.status })
    });

    const response = await apiClient.get(`${BASE_URL}/faculty?${params}`);
    return response.data;
  },

  // Get course grades by course
  getCourseGradesByCourse: async (
    courseId: string,
    page = 1,
    limit = 10,
    filters?: CourseGradeFilters
  ): Promise<CourseGradesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.semester && { semester: filters.semester.toString() }),
      ...(filters?.academicYear && { academicYear: filters.academicYear }),
      ...(filters?.status && { status: filters.status })
    });

    const response = await apiClient.get(`${BASE_URL}/course/${courseId}?${params}`);
    return response.data;
  },

  // Get course grade by ID
  getCourseGrade: async (gradeId: string): Promise<CourseGradeResponse> => {
    const response = await apiClient.get(`${BASE_URL}/${gradeId}`);
    return response.data;
  },

  // Create new course grade
  createCourseGrade: async (data: CreateCourseGradeRequest): Promise<CourseGradeResponse> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // Update course grade
  updateCourseGrade: async (
    gradeId: string,
    data: UpdateCourseGradeRequest
  ): Promise<CourseGradeResponse> => {
    const response = await apiClient.put(`${BASE_URL}/${gradeId}`, data);
    return response.data;
  },

  // Delete course grade
  deleteCourseGrade: async (gradeId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${BASE_URL}/${gradeId}`);
    return response.data;
  },

  // Bulk submit grades
  bulkSubmitGrades: async (
    courseId: string,
    data: BulkGradeSubmissionRequest
  ): Promise<{ success: boolean; message: string; data: CourseGradeData[] }> => {
    const response = await apiClient.post(`${BASE_URL}/bulk-submit/${courseId}`, data);
    return response.data;
  },

  // Auto calculate grades
  autoCalculateGrades: async (
    courseId: string,
    data: AutoCalculateGradesRequest
  ): Promise<{ success: boolean; message: string; data: CourseGradeData[] }> => {
    const response = await apiClient.post(`${BASE_URL}/auto-calculate/${courseId}`, data);
    return response.data;
  },

  // Get grade statistics for a course
  getCourseGradeStats: async (courseId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      totalStudents: number;
      submittedGrades: number;
      draftGrades: number;
      averageGrade: number;
      gradeDistribution: Record<string, number>;
    };
  }> => {
    const response = await apiClient.get(`${BASE_URL}/stats/${courseId}`);
    return response.data;
  }
}; 