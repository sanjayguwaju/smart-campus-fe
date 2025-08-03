import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, FileText, Award, Clock, TrendingUp, GraduationCap, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const quickActions = [
    { name: 'My Courses', href: '/student/courses', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'My Grades', href: '/student/grades', icon: Award, color: 'bg-green-500' },
    { name: 'Campus Events', href: '/events', icon: Calendar, color: 'bg-yellow-500' },
    { name: 'Notices', href: '/noticeboard', icon: FileText, color: 'bg-purple-500' },
    { name: 'Academic Calendar', href: '/student/calendar', icon: Clock, color: 'bg-indigo-500' },
    { name: 'Student Services', href: '/student/services', icon: Users, color: 'bg-red-500' },
  ];

  const stats = [
    { name: 'Enrolled Courses', value: '0', change: 'No courses', icon: BookOpen },
    { name: 'GPA', value: 'N/A', change: 'No data', icon: Award },
    { name: 'Credits Earned', value: '0', change: 'No credits', icon: GraduationCap },
    { name: 'Events Attended', value: '0', change: 'No events', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}!</p>
              <p className="text-sm text-gray-500">Student ID: {user?.studentId}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                ← Back to Main Page
              </Link>
              <Link
                to="/student/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                My Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">Updated</span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 