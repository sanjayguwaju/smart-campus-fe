export interface Course {
  _id: string;
  name: string;
  code: string;
  creditHours: number;
  fullName: string;
  isAvailable: boolean;
  enrollmentPercentage: number;
  availableSeats: number | null;
  fullLocation: string;
  id: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  displayName: string;
  age: number | null;
  fullAddress: string;
  identifier: string;
  id: string;
}

export interface Program {
  _id: string;
  name: string;
}

export interface Scholarship {
  type: string;
  amount: number;
  description: string;
}

export interface AuditTrailEntry {
  action: string;
  performedBy: string;
  details: string;
  _id: string;
  timestamp: string;
  id: string;
}

export interface StatusSummary {
  isActive: boolean;
  isCompleted: boolean;
  isGraduated: boolean;
  isSuspended: boolean;
  isDropped: boolean;
}

export interface EnrollmentData {
  _id: string;
  student: User;
  program: Program;
  semester: number;
  academicYear: string;
  courses: Course[];
  status: string;
  enrollmentType: string;
  totalCredits: number;
  gpa: number;
  cgpa: number;
  academicStanding: string;
  financialStatus: string;
  advisor: User;
  notes: string;
  documents: any[];
  auditTrail: AuditTrailEntry[];
  createdBy: User;
  lastModifiedBy: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  enrollmentDuration: number;
  currentSemester: string;
  academicPeriod: string;
  statusSummary: StatusSummary;
  scholarship?: Scholarship;
  id: string;
}

export interface CreateEnrollmentRequest {
  student: string;
  program: string;
  semester: number;
  academicYear: string;
  courses: string[];
  status: string;
  enrollmentType: string;
  notes?: string;
  scholarship?: {
    type: string;
    amount: number;
    description: string;
  };
}

export interface UpdateEnrollmentRequest {
  student?: string;
  program?: string;
  semester?: number;
  academicYear?: string;
  courses?: string[];
  status?: string;
  enrollmentType?: string;
  notes?: string;
  scholarship?: {
    type: string;
    amount: number;
    description: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EnrollmentsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: EnrollmentData[];
  pagination: PaginationInfo;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: EnrollmentData;
  timestamp: string;
}

export interface CreateEnrollmentResponse {
  success: boolean;
  message: string;
  data: EnrollmentData;
  timestamp: string;
} 