export interface DepartmentData {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: string;
  facultyCount: number;
  studentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  headOfDepartment?: string;
  isActive?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DepartmentsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: DepartmentData[];
  pagination: PaginationInfo;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: DepartmentData;
  timestamp: string;
}

export interface CreateDepartmentResponse {
  success: boolean;
  message: string;
  data: DepartmentData;
  timestamp: string;
} 