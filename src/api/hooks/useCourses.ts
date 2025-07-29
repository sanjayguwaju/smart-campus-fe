import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/courseService";
import { CreateCourseRequest, UpdateCourseRequest, StudentCoursesParams, ActualStudentCoursesResponse } from "../types/courses";

export const useCourses = (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    department?: string;
    instructor?: string;
    semester?: string;
    academicYear?: string;
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ["courses", page, limit, search, filters],
    queryFn: () => courseService.getCourses(page, limit, search, filters),
    select: (response) => {
      return {
        courses: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes - cache time (formerly cacheTime)
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401) {
          return false;
        }
      }
      // Only retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useCourseData = (id: string) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseService.getCourse(id),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes - cache time (formerly cacheTime)
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401) {
          return false;
        }
      }
      // Only retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseRequest) =>
      courseService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string;
      courseData: UpdateCourseRequest;
    }) => courseService.updateCourse(id, courseData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["courses", variables.id], data);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ["courses", deletedId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useActivateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.activateCourse(id),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeactivateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.deactivateCourse(id),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useAssignedFacultyCourses = (
  facultyId: string,
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    department?: string;
    semester?: string;
    academicYear?: string;
  }
) => {
  return useQuery({
    queryKey: ["faculty-assigned-courses", facultyId, page, limit, search, filters],
    queryFn: () => courseService.getFacultyAssignedCourses({
      facultyId,
      page,
      limit,
      search,
      filters,
    }),
    select: (response) => {
      return {
        courses: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
    enabled: !!facultyId,
  });
};


export const useStudentCourses = (
  studentId: string,
  page = 1,
  limit = 10,
  filters?: StudentCoursesParams["filters"],
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  return useQuery({
    queryKey: ["student-courses", studentId, page, limit, filters, sortBy, sortOrder],
    queryFn: () =>
      courseService.getStudentCourses({
        studentId,
        page,
        limit,
        filters,
        sortBy,
        sortOrder,
      }),
    select: (response: ActualStudentCoursesResponse) => ({
      courses: response.data,
      pagination: response.pagination,
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
    }),
    enabled: !!studentId,
  });
};



