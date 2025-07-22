import { apiClient } from "../config/axios";
import { Program, ProgramPayload } from "../types/programs";

export interface ProgramsResponse {
  success: boolean;
  message: string;
  programs: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
}

export interface ProgramResponse {
  success: boolean;
  message: string;
  data: Program;
  timestamp: string;
}

export interface CreateProgramResponse {
  success: boolean;
  message: string;
  data: Program;
  timestamp: string;
}

export async function getPrograms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  level?: string;
}): Promise<ProgramsResponse> {
  let url = "/programs";
  const query: string[] = [];

  if (params?.page) query.push(`page=${params.page}`);
  if (params?.limit) query.push(`limit=${params.limit}`);
  if (params?.search) query.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.department)
    query.push(`department=${encodeURIComponent(params.department)}`);
  if (params?.level) query.push(`level=${params.level}`);

  if (query.length) url += `?${query.join("&")}`;
  const response = await apiClient.get<ProgramsResponse>(url);
  return response.data;
}

// Types for program application
export interface ProgramApplication {
  _id: string;
  student: any;
  program: any;
  campusId: string;
  documents?: { url: string; name: string }[];
  status: 'pending' | 'verified' | 'rejected';
  adminRemarks?: string;
  verifiedBy?: any;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramApplicationResponse {
  success: boolean;
  message: string;
  data: ProgramApplication;
  timestamp: string;
}

export interface ProgramApplicationsResponse {
  success: boolean;
  message: string;
  data: ProgramApplication[];
  timestamp: string;
}

// Submit a new program application
async function submitProgramApplication(payload: {
  program: string;
  campusId: string;
  documents?: { url: string; name: string }[];
}): Promise<ProgramApplicationResponse> {
  const response = await apiClient.post<ProgramApplicationResponse>(
    '/programs/applications',
    payload
  );
  return response.data;
}

// Get program applications (student or admin)
async function getProgramApplications(params?: {
  status?: string;
  program?: string;
}): Promise<ProgramApplicationsResponse> {
  let url = '/programs/applications';
  const query: string[] = [];
  if (params?.status) query.push(`status=${params.status}`);
  if (params?.program) query.push(`program=${params.program}`);
  if (query.length) url += `?${query.join('&')}`;
  const response = await apiClient.get<ProgramApplicationsResponse>(url);
  return response.data;
}

export const programService = {
  getPrograms,
  async getProgramById(id: string): Promise<ProgramResponse> {
    const response = await apiClient.get<ProgramResponse>(`/programs/${id}`);
    return response.data;
  },
  async createProgram(data: ProgramPayload): Promise<CreateProgramResponse> {
    const response = await apiClient.post<CreateProgramResponse>(
      "/programs",
      data
    );
    return response.data;
  },
  async updateProgram(
    id: string,
    data: ProgramPayload
  ): Promise<ProgramResponse> {
    const response = await apiClient.put<ProgramResponse>(
      `/programs/${id}`,
      data
    );
    return response.data;
  },
  async deleteProgram(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/programs/${id}`);
    return response.data;
  },
  async publishProgram(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/programs/${id}/publish`, { isPublished: true });
    return response.data;
  },
  async unpublishProgram(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/programs/${id}/publish`, { isPublished: false });
    return response.data;
  },
  submitProgramApplication,
  getProgramApplications,
};
