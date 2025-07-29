import { apiClient } from '../config/axios';
import {
  AssignmentData,
  AssignmentResponse,
  AssignmentsResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  AssignmentFilters
} from '../types/assignments';

const BASE_URL = '/assignments';

export const assignmentService = {
  // Get all assignments with pagination and filters
  getAssignments: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: AssignmentFilters
  ): Promise<AssignmentsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters?.title && { title: filters.title }),
      ...(filters?.course && { course: filters.course }),
      ...(filters?.faculty && { faculty: filters.faculty }),
      ...(filters?.assignmentType && { assignmentType: filters.assignmentType }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.dueDateRange && { dueDateRange: filters.dueDateRange }),
      ...(filters?.tags && { tags: filters.tags })
    });

    const response = await apiClient.get(`${BASE_URL}?${params}`);
    return response.data;
  },
   
  // Get assignments for logged-in student’s courses
  getMyCourseAssignments: async (
    studentId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: AssignmentFilters
  ): Promise<AssignmentsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters?.title && { title: filters.title }),
      ...(filters?.course && { course: filters.course }),
      ...(filters?.faculty && { faculty: filters.faculty }),
      ...(filters?.assignmentType && { assignmentType: filters.assignmentType }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.dueDateRange && { dueDateRange: filters.dueDateRange }),
      ...(filters?.tags && { tags: filters.tags })
    });

    const response = await apiClient.get(`${BASE_URL}/student/${studentId}/my-courses-assignments?${params.toString()}`);
    return response.data;
  },

  // Get assignments for a specific faculty
  getFacultyAssignments: async (
    facultyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: AssignmentFilters
  ): Promise<AssignmentsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters?.title && { title: filters.title }),
      ...(filters?.course && { course: filters.course }),
      ...(filters?.assignmentType && { assignmentType: filters.assignmentType }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.dueDateRange && { dueDateRange: filters.dueDateRange }),
      ...(filters?.tags && { tags: filters.tags })
    });

    const response = await apiClient.get(`${BASE_URL}/faculty/${facultyId}?${params}`);
    return response.data;
  },

  // Get assignment by ID
  getAssignment: async (id: string): Promise<AssignmentResponse> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new assignment
  createAssignment: async (data: CreateAssignmentRequest): Promise<AssignmentResponse> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // Create faculty assignment (faculty-course endpoint)
  createFacultyAssignment: async (data: CreateAssignmentRequest): Promise<AssignmentResponse> => {
    const response = await apiClient.post(`${BASE_URL}/faculty-course`, data);
    return response.data;
  },

  // Update assignment
  updateAssignment: async (id: string, data: UpdateAssignmentRequest): Promise<AssignmentResponse> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Publish assignment
  publishAssignment: async (id: string): Promise<AssignmentResponse> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/publish`);
    return response.data;
  },

  // Unpublish assignment
  unpublishAssignment: async (id: string): Promise<AssignmentResponse> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/unpublish`);
    return response.data;
  },

  // Close submissions
  closeSubmissions: async (id: string): Promise<AssignmentResponse> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/close-submissions`);
    return response.data;
  },

  // Get assignment statistics
  getAssignmentStatistics: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.get(`${BASE_URL}/${id}/statistics`);
    return response.data;
  },

  // Upload assignment file
  uploadFile: async (id: string, file: File): Promise<{ success: boolean; data: any }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`${BASE_URL}/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete assignment file
  deleteFile: async (id: string, fileId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}/files/${fileId}`);
    return response.data;
  }
}; 