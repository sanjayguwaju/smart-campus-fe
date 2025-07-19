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
  status: string;
  credits?: string;
  attachments?: string[];
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getBlogs = () => apiClient.get('/blogs');
export const getBlogById = (id: string) => apiClient.get(`/blogs/${id}`);
export const createBlog = (data: FormData) => apiClient.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id: string, data: FormData) => apiClient.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id: string) => apiClient.delete(`/blogs/${id}`);

// Publish blog
export const publishBlog = (id: string) => apiClient.put(`/blogs/${id}/publish`, { isPublished: true });

// Unpublish blog
export const unpublishBlog = (id: string) => apiClient.put(`/blogs/${id}/publish`, { isPublished: false }); 