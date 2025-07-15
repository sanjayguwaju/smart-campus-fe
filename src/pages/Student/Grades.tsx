import React from 'react';
import { Award, TrendingUp, BookOpen, User, Calendar } from 'lucide-react';
import { studentGrades } from '../../data/studentDummyData';

const Grades: React.FC = () => {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.3) return 'text-blue-600';
    if (gpa >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateOverallGPA = () => {
    const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.gpa * grade.credits), 0);
    const totalCredits = studentGrades.reduce((sum, grade) => sum + grade.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const overallGPA = calculateOverallGPA();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600 mt-2">Fall 2024 Semester</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall GPA</p>
          <p className={`text-3xl font-bold ${getGPAColor(parseFloat(overallGPA))}`}>
            {overallGPA}
          </p>
        </div>
      </div>

      {/* GPA Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Credits</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentGrades.reduce((sum, grade) => sum + grade.credits, 0)}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Courses</p>
              <p className="text-2xl font-bold text-green-600">
                {studentGrades.length}
              </p>
            </div>
            <Award className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">A Grades</p>
              <p className="text-2xl font-bold text-purple-600">
                {studentGrades.filter(grade => grade.grade.startsWith('A')).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Semester</p>
              <p className="text-2xl font-bold text-orange-600">Fall 2024</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Course Grades</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentGrades.map((grade) => (
                <tr key={grade.courseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {grade.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {grade.courseId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{grade.instructor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getGPAColor(grade.gpa)}`}>
                      {grade.gpa.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {studentGrades.filter(grade => grade.grade.startsWith('A')).length}
            </div>
            <div className="text-sm text-gray-600">A Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {studentGrades.filter(grade => grade.grade.startsWith('B')).length}
            </div>
            <div className="text-sm text-gray-600">B Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {studentGrades.filter(grade => grade.grade.startsWith('C')).length}
            </div>
            <div className="text-sm text-gray-600">C Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {studentGrades.filter(grade => grade.grade.startsWith('D') || grade.grade.startsWith('F')).length}
            </div>
            <div className="text-sm text-gray-600">D/F Grades</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades; 