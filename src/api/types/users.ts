export interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string; // For legacy users
  email: string;
  role: "admin" | "faculty" | "student";
  department?: string;
  phone?: string;
  avatar?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isVerified: boolean; // Admin verification status
  lastLogin?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  displayName: string;
  id: string;
  studentId?: string;
  facultyId?: string;
  employeeId?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "faculty" | "student";
  department?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "admin" | "faculty" | "student";
  department?: string;
  phone?: string;
  isActive?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: UserData[];
  pagination: PaginationInfo;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
  timestamp: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: UserData;
  timestamp: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: UserData;
  timestamp: string;
}
