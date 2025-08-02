import { apiClient } from '../config/axios';

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  author: string;
  coverImage?: {
    url: string;
    alt?: string;
    caption?: string;
  };
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

export const getBlogs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  author?: string;
  tags?: string;
}) => {
  let url = '/blogs';
  const query: string[] = [];
  if (params?.page) query.push(`page=${params.page}`);
  if (params?.limit) query.push(`limit=${params.limit}`);
  if (params?.search) query.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.status) query.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.author) query.push(`author=${encodeURIComponent(params.author)}`);
  if (params?.tags) query.push(`tags=${encodeURIComponent(params.tags)}`);
  if (query.length) url += `?${query.join('&')}`;
  return apiClient.get(url);
};
export const getBlogById = (id: string) => apiClient.get(`/blogs/${id}`);
export const createBlog = (data: FormData) => apiClient.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id: string, data: FormData) => apiClient.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id: string) => apiClient.delete(`/blogs/${id}`); 