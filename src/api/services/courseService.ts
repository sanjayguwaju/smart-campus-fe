import { apiClient } from "../config/axios";
import {
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesResponse,
  CourseResponse,
  CreateCourseResponse,
  FacultyAssignedCoursesResponse,
  FacultyAssignedCoursesParams,
  StudentCoursesResponse,
  StudentCoursesParams,
  ActualStudentCoursesResponse
} from "../types/courses";

export const courseService = {
  async getCourses(page = 1, limit = 10, search?: string, filters?: {
    status?: string;
    department?: string;
    instructor?: string;
    semester?: string;
    academicYear?: string;
  }): Promise<CoursesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);
    }

    const response = await apiClient.get<CoursesResponse>(`/courses?${params.toString()}`);
    return response.data;
  },

  async getCourse(id: string): Promise<CourseResponse> {
    const response = await apiClient.get<CourseResponse>(`/courses/${id}`);
    return response.data;
  },

  async createCourse(courseData: CreateCourseRequest): Promise<CreateCourseResponse> {
    // Find instructor name from instructorOptions if available
    let instructorName = '';
    if (courseData.instructor && (window as any).instructorOptions) {
      const found = (window as any).instructorOptions.find((opt: { value: string; label: string }) => opt.value === courseData.instructor);
      if (found) instructorName = found.label;
    }
    const mappedData = {
      ...courseData,
      name: courseData.name,
      title: courseData.name,
      faculty: courseData.instructor,
      instructorName,
      creditHours: courseData.credits,
      semester: Number(courseData.semester), // only send semester
      year: courseData.academicYear ? parseInt(courseData.academicYear.split('-')[0], 10) : undefined,
    };
    // Only delete fields that are not needed by the backend
    delete (mappedData as any).instructor;
    delete (mappedData as any).credits;
    delete (mappedData as any).academicYear;
    const response = await apiClient.post<CreateCourseResponse>(
      "/courses",
      mappedData
    );
    return response.data;
  },

  async updateCourse(
    id: string,
    courseData: UpdateCourseRequest
  ): Promise<CourseResponse> {
    // Find instructor name from instructorOptions if available
    let instructorName = '';
    if (courseData.instructor && (window as any).instructorOptions) {
      const found = (window as any).instructorOptions.find((opt: { value: string; label: string }) => opt.value === courseData.instructor);
      if (found) instructorName = found.label;
    }
    const mappedData = {
      ...courseData,
      name: courseData.name,
      title: courseData.name,
      faculty: courseData.instructor,
      instructorName,
      creditHours: courseData.credits,
      semester: Number(courseData.semester), // ensure number
      year: courseData.academicYear ? parseInt(courseData.academicYear.split('-')[0], 10) : undefined,
    };
    delete (mappedData as any).instructor;
    delete (mappedData as any).credits;
    delete (mappedData as any).academicYear;
    const response = await apiClient.put<CourseResponse>(
      `/courses/${id}`,
      mappedData
    );
    return response.data;
  },

  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/courses/${id}`);
    return response.data;
  },

  async activateCourse(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/courses/${id}/activate`);
    return response.data;
  },

  async deactivateCourse(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/courses/${id}/deactivate`);
    return response.data;
  },

  async getFacultyAssignedCourses({
    facultyId,
    page = 1,
    limit = 10,
    search,
    filters,
  }: FacultyAssignedCoursesParams): Promise<FacultyAssignedCoursesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);
    }

    const response = await apiClient.get<FacultyAssignedCoursesResponse>(
      `/courses/faculty/${facultyId}?${params.toString()}`
    );
    return response.data;
  },

async getStudentCourses({
  studentId,
  page = 1,
  limit = 10,
  filters,
  sortBy,
  sortOrder,
}: StudentCoursesParams): Promise<ActualStudentCoursesResponse> {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (filters?.status) params.append("status", filters.status);
  if (filters?.semester) params.append("semester", filters.semester.toString());
  if (filters?.year) params.append("year", filters.year.toString());

  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const response = await apiClient.get<ActualStudentCoursesResponse>(
    `courses/student/${studentId}/courses?${params.toString()}`
  );

  return response.data;
}

  
}; 