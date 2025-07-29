import { apiClient } from "../config/axios";
import {
  SubmissionsResponse,
  SubmissionResponse,
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
  GradeSubmissionRequest,
  CreateSubmissionResponse,
} from "../types/submissions";

export const submissionService = {
  async getSubmissions(
    page = 1, 
    limit = 10, 
    search?: string, 
    filters?: {
      status?: string;
      assignment?: string;
      student?: string;
      course?: string;
      isLate?: boolean;
      isGraded?: boolean;
    }
  ): Promise<SubmissionsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.assignment) params.append('assignment', filters.assignment);
      if (filters.student) params.append('student', filters.student);
      if (filters.course) params.append('course', filters.course);
      if (filters.isLate !== undefined) params.append('isLate', filters.isLate.toString());
      if (filters.isGraded !== undefined) params.append('isGraded', filters.isGraded.toString());
    }

    const response = await apiClient.get<SubmissionsResponse>(`/submissions?${params.toString()}`);
    return response.data;
  },

  async getFacultySubmissions(
    facultyId: string,
    page = 1, 
    limit = 10, 
    search?: string, 
    filters?: {
      status?: string;
      assignment?: string;
      student?: string;
      course?: string;
      isLate?: boolean;
      isGraded?: boolean;
    }
  ): Promise<SubmissionsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.assignment) params.append('assignment', filters.assignment);
      if (filters.student) params.append('student', filters.student);
      if (filters.course) params.append('course', filters.course);
      if (filters.isLate !== undefined) params.append('isLate', filters.isLate.toString());
      if (filters.isGraded !== undefined) params.append('isGraded', filters.isGraded.toString());
    }

    const response = await apiClient.get<SubmissionsResponse>(`/submissions/faculty/${facultyId}?${params.toString()}`);
    return response.data;
  },

  async getSubmission(id: string): Promise<SubmissionResponse> {
    const response = await apiClient.get<SubmissionResponse>(`/submissions/${id}`);
    return response.data;
  },

  async createSubmission(submissionData: CreateSubmissionRequest): Promise<CreateSubmissionResponse> {
    const formData = new FormData();
    formData.append('assignment', submissionData.assignment);
    
    if (submissionData.studentComments) {
      formData.append('studentComments', submissionData.studentComments);
    }
    
    submissionData.files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.post<CreateSubmissionResponse>(
      "/submissions",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async updateSubmission(
    id: string,
    submissionData: UpdateSubmissionRequest
  ): Promise<SubmissionResponse> {
    const formData = new FormData();
    
    if (submissionData.files) {
      submissionData.files.forEach((file) => {
        formData.append('files', file);
      });
    }
    
    if (submissionData.studentComments) {
      formData.append('studentComments', submissionData.studentComments);
    }
    
    if (submissionData.grade) {
      formData.append('grade', submissionData.grade);
    }
    
    if (submissionData.numericalScore !== undefined) {
      formData.append('numericalScore', submissionData.numericalScore.toString());
    }
    
    if (submissionData.criteriaScores) {
      formData.append('criteriaScores', JSON.stringify(submissionData.criteriaScores));
    }
    
    if (submissionData.feedback) {
      formData.append('feedback', JSON.stringify(submissionData.feedback));
    }
    
    if (submissionData.instructorNotes) {
      formData.append('instructorNotes', submissionData.instructorNotes);
    }

    const response = await apiClient.put<SubmissionResponse>(
      `/submissions/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async deleteSubmission(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/submissions/${id}`);
    return response.data;
  },

  async gradeSubmission(
    id: string,
    gradeData: GradeSubmissionRequest
  ): Promise<SubmissionResponse> {
    const response = await apiClient.post<SubmissionResponse>(
      `/submissions/${id}/grade`,
      gradeData
    );
    return response.data;
  },

  async checkPlagiarism(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/submissions/${id}/plagiarism-check`);
    return response.data;
  },

  async verifySubmission(id: string, verificationNotes?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/submissions/${id}/verify`, { verificationNotes });
    return response.data;
  },

  async downloadFile(submissionId: string, fileId: string): Promise<Blob> {
    const response = await apiClient.get(`/submissions/${submissionId}/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 