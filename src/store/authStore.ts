import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@campus.edu',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'faculty@campus.edu',
    name: 'Dr. Sarah Johnson',
    role: 'faculty',
    department: 'Computer Science',
    employeeId: 'FAC001',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'student@campus.edu',
    name: 'John Smith',
    role: 'student',
    department: 'Computer Science',
    studentId: 'STU2024001',
    createdAt: new Date(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const res = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) return false;
          const data = await res.json();
          set({ user: data.data.user, token: data.data.token, isAuthenticated: true });
          return true;
        } catch (err) {
          return false;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      register: async (userData) => {
        try {
          const res = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          if (!res.ok) return false;
          const data = await res.json();
          set({ user: data.user, token: data.token, isAuthenticated: true });
          return true;
        } catch (err) {
          return false;
        }
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);