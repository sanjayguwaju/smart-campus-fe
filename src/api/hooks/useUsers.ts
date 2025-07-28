import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { CreateUserRequest, UpdateUserRequest, StudentsByFacultyParams } from "../types/users";

export const useUsers = (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    role?: string;
    status?: string;
    department?: string;
    isEmailVerified?: string;
    dateRange?: string;
  }
) => {
  return useQuery({
    queryKey: ["users", page, limit, search, filters],
    queryFn: () => userService.getUsers(page, limit, search, filters),
    select: (response) => {
      return {
        users: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
  });
};

export const useUserData = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUser(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) =>
      userService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.verifyUser(userId),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUnverifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unverifyUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useStudentsByFaculty = (
  facultyId: string,
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    enrollmentStatus?: string;
    enrollmentType?: string;
    dateRange?: string;
  }
) => {
  return useQuery({
    queryKey: ["students-by-faculty", facultyId, page, limit, search, filters],
    queryFn: () => userService.getStudentsByFaculty({
      facultyId,
      page,
      limit,
      search,
      filters,
    }),
    select: (response) => {
      return {
        students: response.data,
        pagination: response.pagination.pagination,
        summary: response.pagination.summary,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
    enabled: !!facultyId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserRequest;
    }) => userService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Update specific user in cache
      queryClient.setQueryData(["users", variables.id], data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["users", deletedId] });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.activateUser(id),
    onSuccess: (_, userId) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deactivateUser(id),
    onSuccess: (_, userId) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
      confirmPassword,
    }: {
      userId: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const response = await userService.resetPassword(
        userId,
        newPassword,
        confirmPassword
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
