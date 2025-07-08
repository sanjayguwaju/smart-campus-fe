export interface Course {
  _id: string;
  title: string;
  code: string;
  program: {
    _id: string;
    name: string;
  };
  department: {
    _id: string;
    name: string;
  };
  semester: number;
  semesterTerm: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  creditHours: number;
  maxStudents: number;
  faculty: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    fullName?: string;
    displayName?: string;
  };
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursesResponse {
  data: {
    courses: Course[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

export interface CourseResponse {
  data: {
    course: Course;
  };
}

export interface CreateCourseRequest {
  title: string;
  code: string;
  program: string;
  department: string;
  semester: number;
  semesterTerm: Course['semesterTerm'];
  year: number;
  creditHours: number;
  maxStudents: number;
  faculty: string;
  description: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {} 