import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Plus, BookOpen, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  semester: string;
  grade: string;
  percentage: number;
  credits: number;
  gpa: number;
  status: 'pass' | 'fail' | 'incomplete';
  lastUpdated: string;
}

const AdminGrades: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Dummy data
  const grades: Grade[] = [
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'John Doe',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      semester: 'Fall 2024',
      grade: 'A',
      percentage: 92,
      credits: 3,
      gpa: 4.0,
      status: 'pass',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      semester: 'Fall 2024',
      grade: 'B+',
      percentage: 87,
      credits: 4,
      gpa: 3.3,
      status: 'pass',
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      courseCode: 'ENG101',
      courseName: 'English Composition',
      semester: 'Fall 2024',
      grade: 'C',
      percentage: 72,
      credits: 3,
      gpa: 2.0,
      status: 'pass',
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      studentId: 'STU004',
      studentName: 'Sarah Wilson',
      courseCode: 'PHYS101',
      courseName: 'Physics I',
      semester: 'Fall 2024',
      grade: 'F',
      percentage: 45,
      credits: 4,
      gpa: 0.0,
      status: 'fail',
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      studentId: 'STU005',
      studentName: 'David Brown',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      semester: 'Fall 2024',
      grade: 'A-',
      percentage: 89,
      credits: 3,
      gpa: 3.7,
      status: 'pass',
      lastUpdated: '2024-01-11'
    }
  ];

  const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024'];
  const courses = ['CS101', 'MATH201', 'ENG101', 'PHYS101', 'CS201'];
  const statuses = ['pass', 'fail', 'incomplete'];

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || grade.semester === selectedSemester;
    const matchesCourse = selectedCourse === 'all' || grade.courseCode === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || grade.status === selectedStatus;
    
    return matchesSearch && matchesSemester && matchesCourse && matchesStatus;
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A-':
        return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
      case 'B-':
        return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C':
      case 'C-':
        return 'text-yellow-600 bg-yellow-100';
      case 'D+':
      case 'D':
      case 'D-':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-100';
      case 'fail':
        return 'text-red-600 bg-red-100';
      case 'incomplete':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = [
    { name: 'Total Students', value: '1,234', icon: Users, change: '+5%', trend: 'up' },
    { name: 'Average GPA', value: '3.2', icon: TrendingUp, change: '+0.1', trend: 'up' },
    { name: 'Pass Rate', value: '87%', icon: BookOpen, change: '+2%', trend: 'up' },
    { name: 'Failing Students', value: '156', icon: TrendingDown, change: '-3%', trend: 'down' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
              <p className="text-gray-600">Manage and view student academic performance</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Grades
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </button>
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="ml-auto">
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students, courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Student Grades</h3>
            <p className="text-sm text-gray-500">Showing {filteredGrades.length} of {grades.length} records</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                        <div className="text-sm text-gray-500">{grade.studentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grade.courseCode}</div>
                        <div className="text-sm text-gray-500">{grade.courseName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.gpa.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(grade.status)}`}>
                        {grade.status.charAt(0).toUpperCase() + grade.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGrades; 