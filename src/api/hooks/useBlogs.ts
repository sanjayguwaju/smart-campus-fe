import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as blogService from '../services/blogService';

export const useBlogs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  author?: string;
  tags?: string;
}) => {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogService.getBlogs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2000, // Poll every 2 seconds for live updates
  });

  const createBlog = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FormData }) => blogService.updateBlog(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  });

  const deleteBlog = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  });

  return { blogsQuery, createBlog, updateBlog, deleteBlog };
}; 