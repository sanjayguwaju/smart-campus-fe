import { apiClient } from "../config/axios";
import {
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
  EnrollmentsResponse,
  EnrollmentResponse,
  CreateEnrollmentResponse,
} from "../types/enrollments";

export const enrollmentService = {
  async getEnrollments(page = 1, limit = 10, search?: string, filters?: {
    status?: string;
    enrollmentType?: string;
    academicYear?: string;
    semester?: string;
    program?: string;
    student?: string;
    advisor?: string;
    dateRange?: string;
  }): Promise<EnrollmentsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.enrollmentType) params.append('enrollmentType', filters.enrollmentType);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.program) params.append('program', filters.program);
      if (filters.student) params.append('student', filters.student);
      if (filters.advisor) params.append('advisor', filters.advisor);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
    }

    const response = await apiClient.get<EnrollmentsResponse>(`/enrollments?${params.toString()}`);
    return response.data;
  },

  async getEnrollment(id: string): Promise<EnrollmentResponse> {
    const response = await apiClient.get<EnrollmentResponse>(`/enrollments/${id}`);
    return response.data;
  },

  async createEnrollment(enrollmentData: CreateEnrollmentRequest): Promise<CreateEnrollmentResponse> {
    const response = await apiClient.post<CreateEnrollmentResponse>(
      "/enrollments",
      enrollmentData
    );
    return response.data;
  },

  async updateEnrollment(
    id: string,
    enrollmentData: UpdateEnrollmentRequest
  ): Promise<EnrollmentResponse> {
    const response = await apiClient.put<EnrollmentResponse>(
      `/enrollments/${id}`,
      enrollmentData
    );
    return response.data;
  },

  async deleteEnrollment(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/enrollments/${id}`);
    return response.data;
  },

  async activateEnrollment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/enrollments/${id}/activate`);
    return response.data;
  },

  async deactivateEnrollment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/enrollments/${id}/deactivate`);
    return response.data;
  },

  async suspendEnrollment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/enrollments/${id}/suspend`);
    return response.data;
  },

  async completeEnrollment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/enrollments/${id}/complete`);
    return response.data;
  },
}; 