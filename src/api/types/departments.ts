export interface DepartmentData {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  status: 'active' | 'inactive';
  facultyCount?: number;
  studentCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  fullAddress?: string;
  id: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  headOfDepartment?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  status?: 'active' | 'inactive';
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