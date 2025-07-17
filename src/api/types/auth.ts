export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  timestamp: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  department?: string;
  phone?: string;
  avatar?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isVerified: boolean; // Admin verification status
  lastLogin: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  displayName: string;
  id: string;
}

// Registration request interface
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
  department: string;
  studentId?: string;
  employeeId?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
} 