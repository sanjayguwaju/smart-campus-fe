import { apiClient } from '../config/axios';

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  author: string;
  coverImage?: string;
  content: string;
  summary: string;
  tags: string[];
  isPublished: boolean;
  status?: 'draft' | 'published' | 'archived';
  credits?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const getBlogs = () => apiClient.get('/blogs');
export const getBlogById = (id: string) => apiClient.get(`/blogs/${id}`);
export const createBlog = (data: FormData) => apiClient.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id: string, data: FormData) => apiClient.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id: string) => apiClient.delete(`/blogs/${id}`); 