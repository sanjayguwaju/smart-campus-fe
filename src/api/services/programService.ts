import { apiClient } from "../config/axios";
import { Program, ProgramPayload } from "../types/programs";

export interface ProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
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
};
