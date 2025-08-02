export interface SubmissionFile {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface CreateSubmissionFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface CriteriaScore {
  _id: string;
  criterion: string;
  maxPoints: number;
  earnedPoints: number;
  feedback: string;
}

export interface SubmissionFeedback {
  general: string;
  strengths: string[];
  improvements: string[];
  rubric: string;
}

export interface PlagiarismCheck {
  isChecked: boolean;
  similarityScore: number;
  flagged: boolean;
  reportUrl?: string;
  checkedAt: string;
}

export interface Verification {
  isVerified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  verificationNotes: string;
}

export interface SubmissionHistory {
  _id: string;
  action: string;
  timestamp: string;
  performedBy: string;
  details: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  course: string;
}

export interface SubmissionData {
  _id: string;
  assignment: Assignment;
  student: User;
  files: SubmissionFile[];
  submissionNumber: number;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'overdue';
  isLate: boolean;
  latePenalty: number;
  grade?: string;
  numericalScore?: number;
  criteriaScores: CriteriaScore[];
  feedback: SubmissionFeedback;
  reviewedBy?: User;
  reviewedAt?: string;
  studentComments?: string;
  instructorNotes?: string;
  plagiarismCheck: PlagiarismCheck;
  verification: Verification;
  submissionHistory: SubmissionHistory[];
  ipAddress: string;
  userAgent: string;
  createdBy: User;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SubmissionsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    submissions: SubmissionData[];
    pagination: PaginationInfo;
  };
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data: SubmissionData;
  timestamp: string;
}

export interface CreateSubmissionRequest {
  assignment: string;
  title: string;
  description: string;
  files: CreateSubmissionFile[];
  submissionType: 'individual' | 'group';
  isDraft: boolean;
  notes?: string;
  studentComments?: string;
}

export interface UpdateSubmissionRequest {
  files?: File[];
  studentComments?: string;
  grade?: string;
  numericalScore?: number;
  criteriaScores?: CriteriaScore[];
  feedback?: SubmissionFeedback;
  instructorNotes?: string;
}

export interface GradeSubmissionRequest {
  grade: string;
  numericalScore: number;
  criteriaScores: CriteriaScore[];
  feedback: SubmissionFeedback;
  instructorNotes?: string;
}

export interface CreateSubmissionResponse {
  success: boolean;
  message: string;
  data: SubmissionData;
  timestamp: string;
} 