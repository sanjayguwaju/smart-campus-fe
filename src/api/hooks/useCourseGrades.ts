import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseGradeService } from '../services/courseGradeService';
import { CourseGradeFilters, CreateCourseGradeRequest, UpdateCourseGradeRequest, BulkGradeSubmissionRequest, AutoCalculateGradesRequest } from '../types/courseGrades';
import { toast } from 'react-hot-toast';

// Get faculty course grades
export const useFacultyCourseGrades = (
  page = 1,
  limit = 10,
  filters?: CourseGradeFilters
) => {
  return useQuery({
    queryKey: ['faculty-course-grades', page, limit, filters],
    queryFn: () => courseGradeService.getFacultyCourseGrades(page, limit, filters),
    select: (response) => ({
      grades: response.data,
      pagination: response.pagination,
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
    }),
  });
};

// Get student grades
export const useStudentGrades = (
  page = 1,
  limit = 10,
  filters?: CourseGradeFilters
) => {
  return useQuery({
    queryKey: ['student-grades', page, limit, filters],
    queryFn: () => courseGradeService.getStudentGrades(page, limit, filters),
    select: (response) => ({
      grades: response.data,
      pagination: response.pagination,
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
    }),
  });
};

// Get course grades by course
export const useCourseGradesByCourse = (
  courseId: string,
  page = 1,
  limit = 10,
  filters?: CourseGradeFilters,
  enabled = true
) => {
  return useQuery({
    queryKey: ['course-grades', courseId, page, limit, filters],
    queryFn: () => courseGradeService.getCourseGradesByCourse(courseId, page, limit, filters),
    select: (response) => ({
      grades: response.data,
      pagination: response.pagination,
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
    }),
    enabled: !!courseId && enabled,
  });
};

// Get single course grade
export const useCourseGrade = (gradeId: string, enabled = true) => {
  return useQuery({
    queryKey: ['course-grade', gradeId],
    queryFn: () => courseGradeService.getCourseGrade(gradeId),
    select: (response) => ({
      grade: response.data,
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
    }),
    enabled: !!gradeId && enabled,
  });
};

// Create course grade mutation
export const useCreateCourseGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseGradeRequest) => courseGradeService.createCourseGrade(data),
    onSuccess: (response) => {
      toast.success('Grade created successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty-course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grades'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create grade');
    },
  });
};

// Update course grade mutation
export const useUpdateCourseGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gradeId, data }: { gradeId: string; data: UpdateCourseGradeRequest }) =>
      courseGradeService.updateCourseGrade(gradeId, data),
    onSuccess: (response) => {
      toast.success('Grade updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty-course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grade'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update grade');
    },
  });
};

// Delete course grade mutation
export const useDeleteCourseGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gradeId: string) => courseGradeService.deleteCourseGrade(gradeId),
    onSuccess: (response) => {
      toast.success('Grade deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty-course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grades'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete grade');
    },
  });
};

// Bulk submit grades mutation
export const useBulkSubmitGrades = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: BulkGradeSubmissionRequest }) =>
      courseGradeService.bulkSubmitGrades(courseId, data),
    onSuccess: (response) => {
      toast.success('Grades submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty-course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grades'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit grades');
    },
  });
};

// Auto calculate grades mutation
export const useAutoCalculateGrades = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: AutoCalculateGradesRequest }) =>
      courseGradeService.autoCalculateGrades(courseId, data),
    onSuccess: (response) => {
      toast.success('Grades calculated successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty-course-grades'] });
      queryClient.invalidateQueries({ queryKey: ['course-grades'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to calculate grades');
    },
  });
};

// Get course grade statistics
export const useCourseGradeStats = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: ['course-grade-stats', courseId],
    queryFn: () => courseGradeService.getCourseGradeStats(courseId),
    select: (response) => ({
      stats: response.data,
      success: response.success,
      message: response.message,
    }),
    enabled: !!courseId && enabled,
  });
}; 