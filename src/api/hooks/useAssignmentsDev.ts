import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../services/assignmentService';
import { AssignmentFilters, CreateAssignmentRequest, UpdateAssignmentRequest } from '../types/assignments';
import { mockAssignmentsResponse } from '../../data/mockAssignments';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

// Check if we should use mock data
const shouldUseMockData = () => {
  // Use mock data if not authenticated or if in development mode
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  const isDevelopment = import.meta.env.DEV;
  
  return !isAuthenticated || isDevelopment;
};

export const useAssignments = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: AssignmentFilters
) => {
  return useQuery({
    queryKey: ['assignments', page, limit, search, filters],
    queryFn: async () => {
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter mock data based on search and filters
        let filteredAssignments = mockAssignmentsResponse.assignments;
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredAssignments = filteredAssignments.filter(assignment =>
            assignment.title.toLowerCase().includes(searchLower) ||
            assignment.description.toLowerCase().includes(searchLower) ||
            (typeof assignment.course === 'object' && assignment.course.name.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters) {
          if (filters.status) {
            filteredAssignments = filteredAssignments.filter(assignment =>
              assignment.status === filters.status
            );
          }
          if (filters.difficulty) {
            filteredAssignments = filteredAssignments.filter(assignment =>
              assignment.difficulty === filters.difficulty
            );
          }
          if (filters.assignmentType) {
            filteredAssignments = filteredAssignments.filter(assignment =>
              assignment.assignmentType === filters.assignmentType
            );
          }
        }
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAssignments = filteredAssignments.slice(startIndex, endIndex);
        
        return {
          ...mockAssignmentsResponse,
          assignments: paginatedAssignments,
          pagination: {
            ...mockAssignmentsResponse.pagination,
            currentPage: page,
            totalItems: filteredAssignments.length,
            totalPages: Math.ceil(filteredAssignments.length / limit),
            hasNextPage: endIndex < filteredAssignments.length,
            hasPrevPage: page > 1
          }
        };
      }
      
      return assignmentService.getAssignments(page, limit, search, filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const assignment = mockAssignmentsResponse.assignments.find(a => a._id === id);
        if (!assignment) {
          throw new Error('Assignment not found');
        }
        return { success: true, assignment };
      }
      return assignmentService.getAssignment(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAssignmentRequest) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newAssignment = {
          ...data,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statistics: {
            totalSubmissions: 0,
            averageGrade: 0,
            submissionRate: 0,
            onTimeSubmissions: 0,
            lateSubmissions: 0
          }
        };
        return { success: true, assignment: newAssignment };
      }
      return assignmentService.createAssignment(data);
    },
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
    mutationFn: async ({ id, data }: { id: string; data: UpdateAssignmentRequest }) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const updatedAssignment = {
          ...data,
          _id: id,
          updatedAt: new Date().toISOString()
        };
        return { success: true, assignment: updatedAssignment };
      }
      return assignmentService.updateAssignment(id, data);
    },
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
    mutationFn: async (id: string) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { success: true, message: 'Assignment deleted successfully' };
      }
      return assignmentService.deleteAssignment(id);
    },
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

// Export other hooks with mock data support
export const usePublishAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, assignment: { _id: id, status: 'published' } };
      }
      return assignmentService.publishAssignment(id);
    },
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
    mutationFn: async (id: string) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, assignment: { _id: id, status: 'draft' } };
      }
      return assignmentService.unpublishAssignment(id);
    },
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
    mutationFn: async (id: string) => {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, assignment: { _id: id, status: 'submission_closed' } };
      }
      return assignmentService.closeSubmissions(id);
    },
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