import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, BookOpen, Calendar, Filter } from 'lucide-react';

interface Grade {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
  year: string;
  grade: string;
  gradePoints: number;
  credits: number;
  instructor: string;
  assignmentBreakdown: {
    assignments: number;
    midterm: number;
    final: number;
    participation: number;
  };
}

interface SemesterGPA {
  semester: string;
  year: string;
  gpa: number;
  credits: number;
  courses: number;
}

const StudentGrades: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const dummyGrades: Grade[] = [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      semester: 'Fall',
      year: '2024',
      grade: 'A-',
      gradePoints: 3.7,
      credits: 3,
      instructor: 'Dr. Sarah Johnson',
      assignmentBreakdown: {
        assignments: 85,
        midterm: 88,
        final: 92,
        participation: 90
      }
    },
    {
      id: '2',
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      semester: 'Fall',
      year: '2024',
      grade: 'B+',
      gradePoints: 3.3,
      credits: 4,
      instructor: 'Prof. Michael Chen',
      assignmentBreakdown: {
        assignments: 78,
        midterm: 82,
        final: 85,
        participation: 88
      }
    },
    {
      id: '3',
      courseCode: 'ENG102',
      courseName: 'Academic Writing',
      semester: 'Fall',
      year: '2024',
      grade: 'A',
      gradePoints: 4.0,
      credits: 3,
      instructor: 'Dr. Emily Rodriguez',
      assignmentBreakdown: {
        assignments: 92,
        midterm: 88,
        final: 95,
        participation: 94
      }
    },
    {
      id: '4',
      courseCode: 'PHYS101',
      courseName: 'Physics I',
      semester: 'Spring',
      year: '2024',
      grade: 'B',
      gradePoints: 3.0,
      credits: 4,
      instructor: 'Dr. Robert Kim',
      assignmentBreakdown: {
        assignments: 75,
        midterm: 78,
        final: 82,
        participation: 85
      }
    },
    {
      id: '5',
      courseCode: 'HIST201',
      courseName: 'World History',
      semester: 'Spring',
      year: '2024',
      grade: 'A-',
      gradePoints: 3.7,
      credits: 3,
      instructor: 'Dr. Lisa Thompson',
      assignmentBreakdown: {
        assignments: 88,
        midterm: 85,
        final: 90,
        participation: 92
      }
    },
    {
      id: '6',
      courseCode: 'CHEM101',
      courseName: 'General Chemistry',
      semester: 'Spring',
      year: '2024',
      grade: 'B+',
      gradePoints: 3.3,
      credits: 4,
      instructor: 'Dr. James Wilson',
      assignmentBreakdown: {
        assignments: 80,
        midterm: 83,
        final: 87,
        participation: 85
      }
    }
  ];

  const semesterGPAs: SemesterGPA[] = [
    { semester: 'Fall', year: '2024', gpa: 3.67, credits: 10, courses: 3 },
    { semester: 'Spring', year: '2024', gpa: 3.5, credits: 11, courses: 3 }
  ];

  const filteredGrades = selectedSemester === 'all' 
    ? dummyGrades 
    : dummyGrades.filter(grade => `${grade.semester} ${grade.year}` === selectedSemester);

  const overallGPA = dummyGrades.reduce((sum, grade) => sum + grade.gradePoints, 0) / dummyGrades.length;
  const totalCredits = dummyGrades.reduce((sum, grade) => sum + grade.credits, 0);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGPATrend = () => {
    if (semesterGPAs.length < 2) return 'stable';
    const current = semesterGPAs[semesterGPAs.length - 1].gpa;
    const previous = semesterGPAs[semesterGPAs.length - 2].gpa;
    return current > previous ? 'up' : current < previous ? 'down' : 'stable';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Grades</h1>
          <p className="text-gray-600">Track your academic performance and GPA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                <p className="text-2xl font-bold text-gray-900">{overallGPA.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">GPA Trend</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {getGPATrend() === 'up' ? '↗' : getGPATrend() === 'down' ? '↘' : '→'}
                  </p>
                  <span className="ml-2 text-sm text-gray-600 capitalize">{getGPATrend()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{dummyGrades.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Semester GPA Chart */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Semester GPA Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {semesterGPAs.map((semester) => (
                <div key={`${semester.semester}-${semester.year}`} className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {semester.semester} {semester.year}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">{semester.gpa.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {semester.credits} credits • {semester.courses} courses
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Grade History</h3>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Semesters</option>
                  {semesterGPAs.map((semester) => (
                    <option key={`${semester.semester}-${semester.year}`} value={`${semester.semester} ${semester.year}`}>
                      {semester.semester} {semester.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr 
                    key={grade.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedGrade(grade)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grade.courseName}</div>
                        <div className="text-sm text-gray-500">{grade.courseCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.semester} {grade.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.gradePoints.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Detail Modal */}
        {selectedGrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedGrade.courseName}</h2>
                    <p className="text-lg text-gray-600">{selectedGrade.courseCode}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Semester</p>
                          <p className="text-gray-900">{selectedGrade.semester} {selectedGrade.year}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Instructor</p>
                          <p className="text-gray-900">{selectedGrade.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Credits</p>
                          <p className="text-gray-900">{selectedGrade.credits}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Grade Summary</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Final Grade</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(selectedGrade.grade)}`}>
                            {selectedGrade.grade}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">GPA Points</p>
                          <p className="text-gray-900">{selectedGrade.gradePoints.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Assignments</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedGrade.assignmentBreakdown.assignments}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Midterm</p>
                        <p className="text-2xl font-bold text-yellow-600">{selectedGrade.assignmentBreakdown.midterm}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Final</p>
                        <p className="text-2xl font-bold text-green-600">{selectedGrade.assignmentBreakdown.final}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Participation</p>
                        <p className="text-2xl font-bold text-purple-600">{selectedGrade.assignmentBreakdown.participation}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedGrade(null)}
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

export default StudentGrades; 