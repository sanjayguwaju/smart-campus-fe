export interface CourseData {
  _id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  department: string;
  instructor?: string;
  semester: string;
  academicYear: string;
  maxStudents: number;
  enrolledStudents: number;
  isActive: boolean;
  imageUrl?: string;
  images?: Array<{
    url: string;
    caption?: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  description?: string;
  credits: number;
  department: string;
  program: string;
  instructor?: string;
  semester: string;
  academicYear: string;
  maxStudents: number;
  imageUrl?: string;
}

export interface UpdateCourseRequest {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  department?: string;
  program?: string;
  instructor?: string;
  semester?: string;
  academicYear?: string;
  maxStudents?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: CourseData[];
  pagination: PaginationInfo;
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: CourseData;
  timestamp: string;
}

export interface CreateCourseResponse {
  success: boolean;
  message: string;
  data: CourseData;
  timestamp: string;
} 