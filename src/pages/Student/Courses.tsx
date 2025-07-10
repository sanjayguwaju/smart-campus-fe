import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, Users, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  progress: number;
  grade?: string;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
  assignments: number;
  completedAssignments: number;
}

const StudentCourses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');

  const dummyCourses: Course[] = [
    {
      id: '1',
      code: 'CS101',
      name: 'Introduction to Computer Science',
      instructor: 'Dr. Sarah Johnson',
      credits: 3,
      schedule: 'Mon, Wed, Fri 9:00 AM - 10:15 AM',
      room: 'Science Hall 201',
      progress: 75,
      grade: 'A-',
      status: 'active',
      description: 'Fundamental concepts of computer science including algorithms, data structures, and programming principles.',
      assignments: 8,
      completedAssignments: 6
    },
    {
      id: '2',
      code: 'MATH201',
      name: 'Calculus II',
      instructor: 'Prof. Michael Chen',
      credits: 4,
      schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
      room: 'Math Building 105',
      progress: 60,
      status: 'active',
      description: 'Advanced calculus topics including integration techniques, series, and applications.',
      assignments: 10,
      completedAssignments: 6
    },
    {
      id: '3',
      code: 'ENG102',
      name: 'Academic Writing',
      instructor: 'Dr. Emily Rodriguez',
      credits: 3,
      schedule: 'Mon, Wed 2:00 PM - 3:15 PM',
      room: 'Humanities Hall 302',
      progress: 100,
      grade: 'A',
      status: 'completed',
      description: 'Advanced academic writing skills with focus on research papers and critical analysis.',
      assignments: 6,
      completedAssignments: 6
    },
    {
      id: '4',
      code: 'PHYS101',
      name: 'Physics I',
      instructor: 'Dr. Robert Kim',
      credits: 4,
      schedule: 'Tue, Thu 1:00 PM - 2:30 PM',
      room: 'Physics Lab 401',
      progress: 0,
      status: 'upcoming',
      description: 'Introduction to classical mechanics, thermodynamics, and wave phenomena.',
      assignments: 0,
      completedAssignments: 0
    }
  ];

  const filteredCourses = dummyCourses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Track your academic progress and course information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{dummyCourses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyCourses.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">GPA</p>
                <p className="text-2xl font-bold text-gray-900">3.75</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyCourses.reduce((sum, course) => sum + course.credits, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'completed', 'upcoming'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {course.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {course.room}
                  </div>
                </div>

                {course.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className={`font-medium ${getProgressColor(course.progress)}`}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          course.progress >= 80 ? 'bg-green-600' : course.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {course.grade && (
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="font-medium text-gray-900">Grade: {course.grade}</span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Assignments: {course.completedAssignments}/{course.assignments}</span>
                    <span>{course.credits} credits</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                    <p className="text-lg text-gray-600">{selectedCourse.code}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Instructor</p>
                        <p className="text-gray-900">{selectedCourse.instructor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Credits</p>
                        <p className="text-gray-900">{selectedCourse.credits}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Schedule</p>
                        <p className="text-gray-900">{selectedCourse.schedule}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Room</p>
                        <p className="text-gray-900">{selectedCourse.room}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedCourse.description}</p>
                  </div>

                  {selectedCourse.status === 'active' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Overall Progress</span>
                          <span className={`font-medium ${getProgressColor(selectedCourse.progress)}`}>
                            {selectedCourse.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              selectedCourse.progress >= 80 ? 'bg-green-600' : selectedCourse.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedCourse.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Assignments completed: {selectedCourse.completedAssignments}/{selectedCourse.assignments}
                      </div>
                    </div>
                  )}

                  {selectedCourse.grade && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Grade</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">{selectedCourse.grade}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses; 