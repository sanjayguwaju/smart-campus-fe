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
import { useState } from 'react';

interface NavigationItem {
  name: string;
  href?: string;
  icon?: any;
  dropdown?: boolean;
  children?: NavigationItem[];
}

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [programsOpen, setProgramsOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Departments', href: '/admin/departments', icon: Building },
    {
      name: 'Programs',
      icon: GraduationCap,
      dropdown: true,
      children: [
        { name: 'Programs', href: '/admin/programs', icon: GraduationCap },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Program Applications', href: '/admin/program-applications', icon: FileText },
      ],
    },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Notices', href: '/admin/notices', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
                {item.dropdown ? (
                  <div>
                    <button
                      type="button"
                      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${programsOpen ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      onClick={() => setProgramsOpen((open) => !open)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      <svg className={`ml-auto h-4 w-4 transition-transform ${programsOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {programsOpen && (
                      <ul className="pl-6 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <li key={child.name}>
                            {child.href && (
                              <Link
                                to={child.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(child.href)
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
                                {child.name}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  item.href && (
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                )}
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