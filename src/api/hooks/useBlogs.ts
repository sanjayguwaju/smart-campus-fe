import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as blogService from '../services/blogService';

export const useBlogs = () => {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery({ queryKey: ['blogs'], queryFn: blogService.getBlogs });

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

  const publishBlog = useMutation({
    mutationFn: blogService.publishBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  });

  const unpublishBlog = useMutation({
    mutationFn: blogService.unpublishBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  });

  return { blogsQuery, createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog };
}; 