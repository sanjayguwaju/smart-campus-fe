export interface Department {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}

// The actual API returns an array of departments directly
export type DepartmentsResponse = Department[];

// For pagination if needed in future
export interface PaginatedDepartmentsResponse {
  success: boolean;
  message: string;
  data: {
    departments: Department[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
} 