import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/departmentService';
import { UpdateDepartmentRequest } from '../types/departments';

// Get all departments
export const useDepartments = (search?: string) => {
  return useQuery({
    queryKey: ['departments', search],
    queryFn: () => departmentService.getDepartments({ search }),
    select: (response) => response,
  });
};

// Get single department
export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentService.getDepartmentById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Create department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

// Update department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) => 
      departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

// Delete department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}; 