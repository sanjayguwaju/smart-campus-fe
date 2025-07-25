import { apiClient } from "../config/axios";
import { Notice, NoticesResponse, NoticeResponse } from "../types/notices";

export const noticeService = {
  async getNotices(params?: any): Promise<NoticesResponse> {
    const response = await apiClient.get("/notices", { params });
    return response.data;
  },
  async getNoticeById(id: string): Promise<NoticeResponse> {
    const response = await apiClient.get(`/notices/${id}`);
    return response.data;
  },
  async createNotice(data: Partial<Notice>): Promise<NoticeResponse> {
    const response = await apiClient.post("/notices", data);
    return response.data;
  },
  async updateNotice(
    id: string,
    data: Partial<Notice>
  ): Promise<NoticeResponse> {
    const response = await apiClient.put(`/notices/${id}`, data);
    return response.data;
  },
  async deleteNotice(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/notices/${id}`);
    return response.data;
  },

  // Publish notice by updating status field
  async publishNotice(
    id: string
  ): Promise<{ success: boolean; message: string }> {

    const response = await apiClient.put(`/notices/${id}`, {
      status: "published",
    });
    return response.data;
  },

  // Unpublish notice by updating status field
  async unpublishNotice(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/notices/${id}`, { status: "draft" });
    return response.data;
  },
};
