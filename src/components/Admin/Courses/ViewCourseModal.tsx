import React from 'react';
import { X, BookOpen, Users, UserCheck, Calendar, BarChart2, Building } from 'lucide-react';
import { CourseData } from '../../../api/types/courses';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | null;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                {course.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
              <p className="text-gray-500">{course.code}</p>
              <div className="mt-2 text-gray-700 text-sm">
                {course.description || 'No description provided.'}
              </div>
            </div>
          </div>

          {/* Statistics & Status */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium text-gray-900">{typeof course.department === 'object' && course.department !== null ? (course.department as any).name : course.department || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Program</p>
                <p className="text-sm font-medium text-gray-900">{typeof course.program === 'object' && course.program !== null ? (course.program as any).name : course.program || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Max Students</p>
                <p className="text-sm font-medium text-gray-900">{course.maxStudents}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Enrolled Students</p>
                <p className="text-sm font-medium text-gray-900">{course.enrolledStudents}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-sm font-medium ${course.isActive ? 'text-green-700' : 'text-red-700'}`}>{course.isActive ? 'Active' : 'Inactive'}</p>
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
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Semester</p>
                <p className="text-sm font-medium text-gray-900">{course.semester}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Semester Term</p>
                <p className="text-sm font-medium text-gray-900">{course.semesterTerm || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Academic Year</p>
                <p className="text-sm font-medium text-gray-900">{course.academicYear}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Instructor</p>
                <p className="text-sm font-medium text-gray-900">{course.instructorName || (course.faculty && (course.faculty as any).firstName ? `${(course.faculty as any).firstName} ${(course.faculty as any).lastName}` : (typeof course.instructor === 'string' ? course.instructor : 'N/A'))}</p>
              </div>
            </div>
          </div>

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