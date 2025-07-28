import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "../services/enrollmentService";
import { CreateEnrollmentRequest, UpdateEnrollmentRequest } from "../types/enrollments";

export const useEnrollments = (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    enrollmentType?: string;
    academicYear?: string;
    semester?: string;
    program?: string;
    student?: string;
    advisor?: string;
    dateRange?: string;
  }
) => {
  return useQuery({
    queryKey: ["enrollments", page, limit, search, filters],
    queryFn: () => enrollmentService.getEnrollments(page, limit, search, filters),
    select: (response) => {
      return {
        enrollments: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
  });
};

export const useEnrollmentData = (id: string) => {
  return useQuery({
    queryKey: ["enrollments", id],
    queryFn: () => enrollmentService.getEnrollment(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentData: CreateEnrollmentRequest) =>
      enrollmentService.createEnrollment(enrollmentData),
    onSuccess: () => {
      // Invalidate and refetch enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      enrollmentData,
    }: {
      id: string;
      enrollmentData: UpdateEnrollmentRequest;
    }) => enrollmentService.updateEnrollment(id, enrollmentData),
    onSuccess: (data, variables) => {
      // Update specific enrollment in cache
      queryClient.setQueryData(["enrollments", variables.id], data);
      // Invalidate enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.deleteEnrollment(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["enrollments", deletedId] });
      // Invalidate enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useActivateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.activateEnrollment(id),
    onSuccess: (_, enrollmentId) => {
      // Invalidate specific enrollment and enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments", enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useDeactivateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.deactivateEnrollment(id),
    onSuccess: (_, enrollmentId) => {
      // Invalidate specific enrollment and enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments", enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useSuspendEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.suspendEnrollment(id),
    onSuccess: (_, enrollmentId) => {
      // Invalidate specific enrollment and enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments", enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useCompleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.completeEnrollment(id),
    onSuccess: (_, enrollmentId) => {
      // Invalidate specific enrollment and enrollments list
      queryClient.invalidateQueries({ queryKey: ["enrollments", enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}; 