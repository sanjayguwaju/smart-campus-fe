export interface CourseData {
  _id: string;
  name: string;
  title: string;
  code: string;
  description?: string;
  courseType?: string;
  program: string;
  department: string | {
    _id: string;
    name?: string;
    fullName?: string;
  };
  faculty?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    fullName?: string;
    displayName?: string;
    department?: string;
  };
  semester: number;
  semesterTerm?: string;
  year: number;
  creditHours: number;
  maxStudents: number;
  currentEnrollment?: number;
  status: string;
  isActive?: boolean;
  isAvailable?: boolean;
  enrollmentPercentage?: number;
  availableSeats?: number;
  fullName?: string;
  fullLocation?: string;
  
  // Location information
  location?: {
    building: string;
    room: string;
    capacity: number;
  };
  
  // Schedule information
  schedule?: Array<{
    _id: string;
    day: string;
    startTime: string;
    endTime: string;
    type: string;
  }>;
  
  // Syllabus information
  syllabus?: {
    gradingPolicy: {
      assignments: number;
      midterm: number;
      final: number;
      participation: number;
    };
    objectives: string[];
    topics: Array<{
      _id: string;
      week: number;
      title: string;
      description: string;
    }>;
    textbooks: Array<{
      _id: string;
      title: string;
      author: string;
      isbn: string;
      isRequired: boolean;
    }>;
  };
  
  // Legacy fields for backward compatibility
  credits?: number;
  instructor?: string;
  instructorName?: string;
  enrolledStudents?: number;
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

// Faculty assigned courses types
export interface FacultyAssignedCoursesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: CourseData[];
  pagination: PaginationInfo;
}

export interface FacultyAssignedCoursesParams {
  facultyId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    status?: string;
    department?: string;
    semester?: string;
    academicYear?: string;
  };
} 


export interface StudentCoursesParams {
  studentId: string;
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    semester?: number;
    year?: number;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


export interface StudentCoursesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: CourseData[];
  pagination: PaginationInfo;
}
