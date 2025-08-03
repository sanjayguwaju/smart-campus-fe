import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, FileText, Clock, Award, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const quickActions = [
    { name: 'My Courses', href: '/faculty/courses', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Student List', href: '/faculty/students', icon: Users, color: 'bg-green-500' },
    { name: 'Create Event', href: '/faculty/events', icon: Calendar, color: 'bg-yellow-500' },
    { name: 'Grade Management', href: '/faculty/grades', icon: Award, color: 'bg-indigo-500' },
  ];

  const stats = [
    { name: 'My Courses', value: '4', change: '+1', icon: BookOpen },
    { name: 'Total Students', value: '156', change: '+12', icon: Users },
    { name: 'Office Hours', value: '8', change: 'This week', icon: Clock },
    { name: 'Department Events', value: '3', change: '+2', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}!</p>

            </div>
            <div className="flex space-x-3">
              <Link
                to="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                ← Back to Main Page
              </Link>
              <Link
                to="/faculty/profile"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-5">
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
                       className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                     >
                       <div className="flex flex-col items-center text-center">
                         <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                           <action.icon className="h-6 w-6 text-blue-600" />
                         </div>
                         <h3 className="mt-4 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                           {action.name}
                         </h3>
                         <div className="mt-2 w-8 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                       </div>
                     </Link>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard; 