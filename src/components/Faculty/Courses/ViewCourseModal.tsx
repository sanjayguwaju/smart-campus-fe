import React from 'react';
import { X, BookOpen, Users, UserCheck, Calendar, BarChart2, Building, MapPin, Clock, FileText, GraduationCap } from 'lucide-react';
import { CourseData } from '../../../api/types/courses';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | null;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;
  
  const getStatusBadgeColor = (status: string, isActive?: boolean) => {
    if (status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'inactive':
          return 'bg-red-100 text-red-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
              <p className="text-sm text-gray-500">View detailed information for {course.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-medium text-white">
                {course.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{course.name || 'Unnamed Course'}</h2>
              <p className="text-gray-500">{course.code || 'No Code'}</p>
              <div className="mt-2 text-gray-700 text-sm">
                {course.description || 'No description provided.'}
              </div>
              {course.courseType && (
                <div className="mt-1">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {course.courseType}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(course.status, course.isActive)}`}>
              {course.status || (course.isActive ? 'Active' : 'Inactive')}
            </span>
          </div>

          {/* Basic Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium text-gray-900">
                  {typeof course.department === 'object' && course.department !== null 
                    ? (course.department as any).name || (course.department as any).fullName
                    : course.department || 'N/A'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Program</p>
                <p className="text-sm font-medium text-gray-900">
                  {typeof course.program === 'object' && course.program !== null 
                    ? (course.program as any).name 
                    : course.program || 'N/A'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Credits</p>
                <p className="text-sm font-medium text-gray-900">{course.creditHours ?? course.credits ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Semester</p>
                <p className="text-sm font-medium text-gray-900">
                  {course.semester}{course.semesterTerm ? ` (${course.semesterTerm})` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Academic Year</p>
                <p className="text-sm font-medium text-gray-900">{course.year}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Instructor</p>
                <p className="text-sm font-medium text-gray-900">
                  {course.faculty && typeof course.faculty === 'object' && 'firstName' in course.faculty
                    ? course.faculty.fullName || `${course.faculty.firstName} ${course.faculty.lastName}`
                    : course.instructorName || 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment & Location */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Enrollment</p>
                <p className="text-sm font-medium text-gray-900">
                  {course.currentEnrollment !== undefined && course.maxStudents !== undefined
                    ? `${course.currentEnrollment}/${course.maxStudents}`
                    : course.enrolledStudents !== undefined && course.maxStudents !== undefined
                      ? `${course.enrolledStudents}/${course.maxStudents}`
                      : 'N/A'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {course.fullLocation || (course.location ? `${course.location.building} - Room ${course.location.room}` : 'N/A')}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          {course.schedule && course.schedule.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </h4>
              <div className="space-y-2">
                {course.schedule.map((session, index) => (
                  <div key={session._id || index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">{session.day}</span>
                      <span className="text-sm text-gray-600">{session.startTime} - {session.endTime}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {session.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus */}
          {course.syllabus && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Syllabus
              </h4>
              
              {/* Grading Policy */}
              {course.syllabus.gradingPolicy && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Grading Policy</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">Assignments:</span>
                      <span className="ml-1 font-medium">{course.syllabus.gradingPolicy.assignments}%</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">Midterm:</span>
                      <span className="ml-1 font-medium">{course.syllabus.gradingPolicy.midterm}%</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">Final:</span>
                      <span className="ml-1 font-medium">{course.syllabus.gradingPolicy.final}%</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">Participation:</span>
                      <span className="ml-1 font-medium">{course.syllabus.gradingPolicy.participation}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Objectives */}
              {course.syllabus.objectives && course.syllabus.objectives.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Course Objectives</h5>
                  <ul className="space-y-1">
                    {course.syllabus.objectives.map((objective, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics */}
              {course.syllabus.topics && course.syllabus.topics.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Course Topics</h5>
                  <div className="space-y-2">
                    {course.syllabus.topics.map((topic) => (
                      <div key={topic._id} className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900">Week {topic.week}</span>
                          <span className="text-xs text-gray-500">{topic.title}</span>
                        </div>
                        <p className="text-xs text-gray-600">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textbooks */}
              {course.syllabus.textbooks && course.syllabus.textbooks.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Required Textbooks</h5>
                  <div className="space-y-2">
                    {course.syllabus.textbooks.map((book) => (
                      <div key={book._id} className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900">{book.title}</span>
                          <span className={`text-xs px-2 py-1 rounded ${book.isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {book.isRequired ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Author: {book.author}</p>
                        {book.isbn && <p className="text-xs text-gray-600">ISBN: {book.isbn}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">{new Date(course.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="text-sm font-medium text-gray-900">{new Date(course.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal; 