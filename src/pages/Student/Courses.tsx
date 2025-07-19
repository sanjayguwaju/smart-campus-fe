import React from 'react';
import { Clock, MapPin, User, GraduationCap, FileText } from 'lucide-react';
import { studentCourses } from '../../data/studentDummyData';
import { students } from '../../data/programMockData';

const Courses: React.FC = () => {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // For demo, use the first student from programMockData
  const student = students[0];
  const courseHistory = student.courseHistory;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Fall 2024 Semester</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Credits</p>
          <p className="text-2xl font-bold text-blue-600">
            {studentCourses.reduce((sum, course) => sum + course.credits, 0)}
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentCourses.map((course) => (
          <div key={course.courseId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Course Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className="text-sm text-gray-500">• {course.credits} credits</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.courseId}</p>
                </div>
                {course.grade && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Current Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </p>
                  </div>
                )}
              </div>

              {/* Course Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{course.room}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{course.department}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Materials
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" /> Course History
        </h3>
        {courseHistory.length === 0 ? (
          <div className="text-gray-400 italic">No course history yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseHistory.map(h => (
              <div key={h.courseId + h.semester} className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-green-900">{h.courseId}</div>
                  <div className="text-xs text-gray-500">Semester {h.semester} • {h.year}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(h.grade)}`}>{h.grade}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 