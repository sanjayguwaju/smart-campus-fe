export interface AssignmentFile {
  _id?: string;
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface AssignmentRequirements {
  maxFileSize: number;
  allowedFileTypes: string[];
  maxSubmissions: number;
  allowLateSubmission: boolean;
  latePenalty: number;
}

export interface GradingCriterion {
  _id?: string;
  id?: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface AssignmentStatistics {
  totalSubmissions: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  averageScore: number;
}

export interface AssignmentData {
  _id: string;
  id?: string;
  title: string;
  description: string;
  course: string | { _id: string; name: string; code: string };
  faculty: string | { _id: string; firstName: string; lastName: string; fullName: string };
  assignmentType: string;
  dueDate: string;
  extendedDueDate?: string;
  files: AssignmentFile[];
  requirements: AssignmentRequirements;
  gradingCriteria: GradingCriterion[];
  totalPoints: number;
  status: 'draft' | 'published' | 'submission_closed' | 'grading' | 'completed';
  isVisible: boolean;
  statistics: AssignmentStatistics;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  timeRemaining?: string;
  submissionRate?: number;
  averageGrade?: string;
}

export interface AssignmentFilters {
  title?: string;
  course?: string;
  faculty?: string;
  assignmentType?: string;
  status?: string;
  difficulty?: string;
  dueDateRange?: string;
  tags?: string;
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: AssignmentData;
}

export interface AssignmentsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    assignments: AssignmentData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  course: string;
  faculty: string;
  assignmentType: string;
  dueDate: string;
  extendedDueDate?: string;
  files?: AssignmentFile[];
  requirements: AssignmentRequirements;
  gradingCriteria: GradingCriterion[];
  totalPoints: number;
  status: 'draft' | 'published' | 'submission_closed' | 'grading' | 'completed';
  isVisible: boolean;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number;
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {
  _id: string;
} 