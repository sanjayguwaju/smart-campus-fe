import { User } from '../api/types/auth';

export type UserRole = 'admin' | 'faculty' | 'student';

/**
 * Check if the current user has a specific role
 * @param user - The user object from auth store
 * @param role - The role to check for
 * @returns boolean indicating if user has the specified role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role;
};

/**
 * Check if the current user has any of the specified roles
 * @param user - The user object from auth store
 * @param roles - Array of roles to check for
 * @returns boolean indicating if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  return user?.role ? roles.includes(user.role) : false;
};

/**
 * Check if the current user is an admin
 * @param user - The user object from auth store
 * @returns boolean indicating if user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Check if the current user is a faculty member
 * @param user - The user object from auth store
 * @returns boolean indicating if user is a faculty member
 */
export const isFaculty = (user: User | null): boolean => {
  return hasRole(user, 'faculty');
};

/**
 * Check if the current user is a student
 * @param user - The user object from auth store
 * @returns boolean indicating if user is a student
 */
export const isStudent = (user: User | null): boolean => {
  return hasRole(user, 'student');
};

/**
 * Check if the current user is staff (admin or faculty)
 * @param user - The user object from auth store
 * @returns boolean indicating if user is staff
 */
export const isStaff = (user: User | null): boolean => {
  return hasAnyRole(user, ['admin', 'faculty']);
};

/**
 * Get the current user's role
 * @param user - The user object from auth store
 * @returns the user's role or null if no user
 */
export const getUserRole = (user: User | null): UserRole | null => {
  return user?.role || null;
};

/**
 * Check if user can perform a specific action based on role
 * @param user - The user object from auth store
 * @param action - The action to check permissions for
 * @returns boolean indicating if user can perform the action
 */
export const canPerformAction = (user: User | null, action: string): boolean => {
  if (!user) return false;
  
  const rolePermissions: Record<UserRole, string[]> = {
    admin: [
      'manage_users',
      'manage_courses',
      'manage_assignments',
      'manage_submissions',
      'view_analytics',
      'manage_system'
    ],
    faculty: [
      'manage_courses',
      'manage_assignments',
      'grade_submissions',
      'view_students',
      'manage_office_hours'
    ],
    student: [
      'submit_assignments',
      'view_grades',
      'view_courses',
      'view_assignments'
    ]
  };

  return rolePermissions[user.role]?.includes(action) || false;
}; 