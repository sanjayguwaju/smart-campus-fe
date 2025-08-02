export interface CourseGradeData {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
  };
  course: {
    _id: string;
    name: string;
    code: string;
    creditHours: number;
  };
  faculty: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  semester: number;
  academicYear: string;
  finalGrade: string;
  numericalGrade: number;
  gradePoints: number;
  credits: number;
  qualityPoints: number;
  gradingMethod: 'letter' | 'pass_fail' | 'audit';
  assignmentGrades?: Array<{
    assignment: string;
    title: string;
    weight: number;
    grade: number;
    maxPoints: number;
  }>;
  attendance?: number;
  participation?: number;
  facultyComments?: string;
  studentComments?: string;
  status: 'draft' | 'submitted' | 'approved' | 'disputed' | 'final';
  submittedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  submittedAt: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  gradeHistory?: Array<{
    action: string;
    changedBy: string;
    previousGrade?: string;
    newGrade: string;
    comment: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseGradeRequest {
  student: string;
  course: string;
  semester: number;
  academicYear: string;
  finalGrade: string;
  numericalGrade: number;
  credits: number;
  attendance?: number;
  participation?: number;
  facultyComments?: string;
  assignmentGrades?: Array<{
    assignment: string;
    title: string;
    weight: number;
    grade: number;
    maxPoints: number;
  }>;
}

export interface UpdateCourseGradeRequest {
  finalGrade?: string;
  numericalGrade?: number;
  attendance?: number;
  participation?: number;
  facultyComments?: string;
  assignmentGrades?: Array<{
    assignment: string;
    title: string;
    weight: number;
    grade: number;
    maxPoints: number;
  }>;
}

export interface CourseGradeFilters {
  semester?: number;
  academicYear?: string;
  course?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'disputed' | 'final';
}

export interface BulkGradeSubmissionRequest {
  gradeIds: string[];
}

export interface AutoCalculateGradesRequest {
  semester: number;
  academicYear: string;
}

export interface CourseGradesResponse {
  success: boolean;
  message: string;
  data: CourseGradeData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
}

export interface CourseGradeResponse {
  success: boolean;
  message: string;
  data: CourseGradeData;
  timestamp: string;
}

export interface CourseGradeStats {
  totalStudents: number;
  submittedGrades: number;
  draftGrades: number;
  averageGrade: number;
  gradeDistribution: {
    'A+': number;
    'A': number;
    'A-': number;
    'B+': number;
    'B': number;
    'B-': number;
    'C+': number;
    'C': number;
    'C-': number;
    'D+': number;
    'D': number;
    'D-': number;
    'F': number;
  };
} 