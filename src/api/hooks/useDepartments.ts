import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../services/departmentService";
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "../types/departments";

export const useDepartments = (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    name?: string;
    dateRange?: string;
  }
) => {
  return useQuery({
    queryKey: ["departments", page, limit, search, filters],
    queryFn: () => departmentService.getDepartments(page, limit, search, filters),
    select: (response) => {
      return {
        departments: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
  });
};

export const useDepartmentData = (id: string) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentService.getDepartment(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentData: CreateDepartmentRequest) =>
      departmentService.createDepartment(departmentData),
    onSuccess: () => {
      // Invalidate and refetch departments list
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      departmentData,
    }: {
      id: string;
      departmentData: UpdateDepartmentRequest;
    }) => departmentService.updateDepartment(id, departmentData),
    onSuccess: (data, variables) => {
      // Update specific department in cache
      queryClient.setQueryData(["departments", variables.id], data);
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["departments", deletedId] });
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useActivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.activateDepartment(id),
    onSuccess: (_, departmentId) => {
      // Invalidate specific department and departments list
      queryClient.invalidateQueries({ queryKey: ["departments", departmentId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeactivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.deactivateDepartment(id),
    onSuccess: (_, departmentId) => {
      // Invalidate specific department and departments list
      queryClient.invalidateQueries({ queryKey: ["departments", departmentId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}; 