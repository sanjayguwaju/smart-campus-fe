import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Home,
  BookOpen,
  Award,
  Calendar,
  FileText,
  Clock,
  Users,
  GraduationCap,
  LogOut,
  Beaker,
  User,
} from 'lucide-react';

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'My Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Assignments', href: '/student/assignments', icon: BookOpen },
    { name: 'Submissions', href: '/student/submissions', icon: FileText },
    { name: 'Grades', href: '/student/grades', icon: Award },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                ← Back to Main Page
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || user?.fullName || 'Student'}</p>
                  <p className="text-xs text-gray-500">Student ID: {user?.id || 'N/A'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {(user?.displayName || user?.fullName || 'S').charAt(0)}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout; 