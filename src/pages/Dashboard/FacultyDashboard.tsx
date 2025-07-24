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
    { name: 'Post Notice', href: '/faculty/notices', icon: FileText, color: 'bg-purple-500' },
    { name: 'Grade Management', href: '/faculty/grades', icon: Award, color: 'bg-indigo-500' },
    { name: 'Office Hours', href: '/faculty/office-hours', icon: Clock, color: 'bg-red-500' },
  ];

  const stats = [
    { name: 'My Courses', value: '4', change: '+1', icon: BookOpen },
    { name: 'Total Students', value: '156', change: '+12', icon: Users },
    { name: 'Office Hours', value: '8', change: 'This week', icon: Clock },
    { name: 'Department Events', value: '3', change: '+2', icon: Calendar },
  ];

  const upcomingEvents = [
    { title: 'Department Meeting', date: '2024-03-15', time: '14:00', type: 'meeting' },
    { title: 'Student Consultation', date: '2024-03-16', time: '10:00', type: 'consultation' },
    { title: 'Faculty Workshop', date: '2024-03-18', time: '15:30', type: 'workshop' },
  ];

  const recentStudents = [
    { name: 'John Smith', course: 'CS101', grade: 'A', lastActivity: '2 hours ago' },
    { name: 'Sarah Johnson', course: 'CS201', grade: 'B+', lastActivity: '1 day ago' },
    { name: 'Mike Davis', course: 'CS101', grade: 'A-', lastActivity: '2 days ago' },
  ];

  const departmentNotices = [
    { title: 'Faculty Meeting Schedule', priority: 'high', date: '2024-03-14' },
    { title: 'Research Grant Deadline', priority: 'medium', date: '2024-03-12' },
    { title: 'Department Newsletter', priority: 'low', date: '2024-03-10' },
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
                to="/faculty/profile"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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
          <div className="lg:col-span-2">
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

          {/* Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Students</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{student.grade}</p>
                      <p className="text-xs text-gray-500">{student.lastActivity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Notices */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Department Notices</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {departmentNotices.map((notice, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                      <p className="text-sm text-gray-500">{notice.date}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      notice.priority === 'high' ? 'bg-red-100 text-red-800' :
                      notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {notice.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard; 