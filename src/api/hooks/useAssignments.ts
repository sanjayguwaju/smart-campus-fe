import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../services/assignmentService';
import { AssignmentFilters, CreateAssignmentRequest, UpdateAssignmentRequest } from '../types/assignments';
import { toast } from 'react-hot-toast';

export const useAssignments = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: AssignmentFilters
) => {
  return useQuery({
    queryKey: ['assignments', page, limit, search, filters],
    queryFn: () => assignmentService.getAssignments(page, limit, search, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMyCourseAssignments = (
  studentId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: AssignmentFilters
) => {
  return useQuery({
    queryKey: ['my-course-assignments', studentId, page, limit, search, filters],
    queryFn: () => assignmentService.getMyCourseAssignments(studentId, page, limit, search, filters),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};


export const useFacultyAssignments = (
  facultyId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: AssignmentFilters
) => {
  return useQuery({
    queryKey: ['faculty-assignments', facultyId, page, limit, search, filters],
    queryFn: () => assignmentService.getFacultyAssignments(facultyId, page, limit, search, filters),
    enabled: !!facultyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => assignmentService.createAssignment(data),
    onSuccess: (data) => {
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error: any) => {
      console.error('Failed to create assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    },
  });
};

export const useCreateFacultyAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => assignmentService.createFacultyAssignment(data),
    onSuccess: (data) => {
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error: any) => {
      console.error('Failed to create assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) =>
      assignmentService.updateAssignment(id, data),
    onSuccess: (data, variables) => {
      toast.success('Assignment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
    onError: (error: any) => {
      console.error('Failed to update assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: (data) => {
      toast.success('Assignment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    },
  });
};

export const usePublishAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.publishAssignment(id),
    onSuccess: (data, variables) => {
      toast.success('Assignment published successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables] });
    },
    onError: (error: any) => {
      console.error('Failed to publish assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to publish assignment');
    },
  });
};

export const useUnpublishAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.unpublishAssignment(id),
    onSuccess: (data, variables) => {
      toast.success('Assignment unpublished successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables] });
    },
    onError: (error: any) => {
      console.error('Failed to unpublish assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to unpublish assignment');
    },
  });
};

export const useCloseSubmissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.closeSubmissions(id),
    onSuccess: (data, variables) => {
      toast.success('Submissions closed successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables] });
    },
    onError: (error: any) => {
      console.error('Failed to close submissions:', error);
      toast.error(error.response?.data?.message || 'Failed to close submissions');
    },
  });
};

export const useUploadAssignmentFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      assignmentService.uploadFile(id, file),
    onSuccess: (data, variables) => {
      toast.success('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
    onError: (error: any) => {
      console.error('Failed to upload file:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });
};

export const useDeleteAssignmentFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fileId }: { id: string; fileId: string }) =>
      assignmentService.deleteFile(id, fileId),
    onSuccess: (data, variables) => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
    onError: (error: any) => {
      console.error('Failed to delete file:', error);
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });
}; 