import React, { useState, useRef, useEffect } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-away listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Departments', href: '/admin/departments', icon: Building },
    {
      name: 'Programs',
      href: '/admin/programs',
      icon: GraduationCap,
      dropdown: true,
      children: [
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
              <li key={item.name} className="relative">
                {item.dropdown ? (
                  <div ref={dropdownRef}>
                    <div className="flex items-center">
                      <Link
                        to={item.href!}
                        className={`flex-1 flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${isActive(item.href!) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        tabIndex={0}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        className="dropdown-arrow ml-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle Programs Dropdown"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(dropdownOpen === item.name ? null : item.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setDropdownOpen(null);
                        }}
                      >
                        <svg className={`h-4 w-4 transition-transform ${dropdownOpen === item.name ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                    {dropdownOpen === item.name && (
                      <ul className="absolute left-0 mt-2 w-56 bg-white shadow-xl border border-gray-100 rounded-lg z-50 py-2 animate-fade-in">
                        {item.children?.map((child) => (
                          <li key={child.name}>
                            {child.href && (
                              <Link
                                to={child.href}
                                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => setDropdownOpen(null)}
                                tabIndex={0}
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