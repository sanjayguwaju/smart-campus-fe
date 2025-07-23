import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Home,
  Users,
  Building,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  BarChart3,
  Settings,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Departments', href: '/admin/departments', icon: Building },
    { name: 'Programs', href: '/admin/programs', icon: GraduationCap },
    // Courses is now a child of Programs
    { name: 'Courses', href: '/admin/courses', icon: BookOpen, child: true },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Notices', href: '/admin/notices', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Program Applications', href: '/admin/program-applications', icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${item.child ? 'pl-8' : ''} ${isActive(item.href)
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
        <AdminHeader 
          user={user}
          navigation={navigation}
          isActive={isActive}
          logout={logout}
        />

        {/* Page content */}
        <main className="p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 