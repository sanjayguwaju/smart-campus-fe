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
    { name: 'Enrolled Courses', value: '5', change: 'Current Semester', icon: BookOpen },
    { name: 'GPA', value: '3.8', change: '+0.2', icon: Award },
    { name: 'Credits Earned', value: '78', change: '+12', icon: GraduationCap },
    { name: 'Events Attended', value: '12', change: '+3', icon: Calendar },
  ];

  const currentCourses = [
    { code: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Sarah Johnson', grade: 'A-', progress: 85 },
    { code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Michael Brown', grade: 'B+', progress: 78 },
    { code: 'ENG101', name: 'English Composition', instructor: 'Dr. Emily Davis', grade: 'A', progress: 92 },
    { code: 'PHYS101', name: 'Physics I', instructor: 'Prof. Robert Wilson', grade: 'B', progress: 70 },
  ];

  const upcomingEvents = [
    { title: 'Tech Workshop', date: '2024-03-15', time: '14:00', location: 'CS Lab 101' },
    { title: 'Student Council Meeting', date: '2024-03-16', time: '16:00', location: 'Student Center' },
    { title: 'Career Fair', date: '2024-03-20', time: '10:00', location: 'Auditorium' },
  ];

  const recentNotices = [
    { title: 'Exam Schedule Released', priority: 'high', date: '2024-03-14' },
    { title: 'Library Extended Hours', priority: 'medium', date: '2024-03-12' },
    { title: 'Student ID Renewal', priority: 'low', date: '2024-03-10' },
  ];

  const academicProgress = [
    { semester: 'Fall 2023', gpa: 3.7, credits: 15 },
    { semester: 'Spring 2024', gpa: 3.8, credits: 12 },
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
                to="/student/profile"
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
                        <p className="text-xs text-gray-400">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Current Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Current Courses</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentCourses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.code} - {course.name}</p>
                        <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{course.grade}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notices & Academic Progress */}
          <div className="space-y-6">
            {/* Recent Notices */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Notices</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentNotices.map((notice, index) => (
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

            {/* Academic Progress */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Academic Progress</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {academicProgress.map((semester, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{semester.semester}</p>
                        <p className="text-sm text-gray-500">{semester.credits} credits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">GPA: {semester.gpa}</p>
                      </div>
                    </div>
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

export default StudentDashboard; 