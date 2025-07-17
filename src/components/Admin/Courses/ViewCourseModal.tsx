import React from 'react';
import { X, BookOpen } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Name:</span> {course.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Code:</span> {course.code}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Description:</span> {course.description || 'N/A'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Credits:</span> {course.credits}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Department:</span> {course.department}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Instructor:</span> {course.instructor || 'N/A'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Semester:</span> {course.semester}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Academic Year:</span> {course.academicYear}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Max Students:</span> {course.maxStudents}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Enrolled Students:</span> {course.enrolledStudents}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span> {course.isActive ? 'Active' : 'Inactive'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span> {new Date(course.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Updated At:</span> {new Date(course.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal; 