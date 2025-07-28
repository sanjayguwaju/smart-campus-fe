import React from 'react';
import { X, User, Mail, GraduationCap, BookOpen, Award, Clock, Users, BarChart3, Shield } from 'lucide-react';
import { StudentByFaculty } from '../../../api/types/users';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentByFaculty | null;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen || !student) return null;

  // Helper function to get display name
  const getDisplayName = (student: StudentByFaculty) => {
    return `${student.firstName} ${student.lastName}`;
  };

  // Helper function to get initials
  const getInitials = (student: StudentByFaculty) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  // Helper function to get enrollment status color
  const getEnrollmentStatusColor = (status: string) => {
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
  };

  // Helper function to get enrollment type color
  const getEnrollmentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full_time':
        return 'bg-blue-100 text-blue-800';
      case 'part_time':
        return 'bg-purple-100 text-purple-800';
      case 'distance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format enrollment type
  const formatEnrollmentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Student Details</h3>
              <p className="text-sm text-gray-500">
                View detailed information for {getDisplayName(student)}
              </p>
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
          {/* Student Avatar and Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-medium text-white">
                {getInitials(student)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{getDisplayName(student)}</h2>
              <p className="text-gray-500">{student.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEnrollmentStatusColor(student.enrollmentStatus)}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {student.enrollmentStatus}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEnrollmentTypeColor(student.enrollmentType)}`}>
                  <Users className="h-3 w-3 mr-1" />
                  {formatEnrollmentType(student.enrollmentType)}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Academic Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{student.totalCredits}</div>
                <div className="text-xs text-gray-500 mt-1">Total Credits</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {student.gpa > 0 ? student.gpa.toFixed(2) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">GPA</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{student.courses.length}</div>
                <div className="text-xs text-gray-500 mt-1">Enrolled Courses</div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">First Name</p>
                  <p className="text-sm font-medium text-gray-900">{student.firstName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Name</p>
                  <p className="text-sm font-medium text-gray-900">{student.lastName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Student ID</p>
                  <p className="text-sm font-medium text-gray-900">{student._id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Enrollment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Enrollment Status</p>
                  <p className="text-sm font-medium text-gray-900">{student.enrollmentStatus}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Enrollment Type</p>
                  <p className="text-sm font-medium text-gray-900">{formatEnrollmentType(student.enrollmentType)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Enrolled Courses ({student.courses.length})
            </h4>
            <div className="space-y-3">
              {student.courses.map((course, index) => (
                <div key={course._id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.code}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Course #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Academic Performance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Credits</p>
                    <p className="text-lg font-semibold text-gray-900">{student.totalCredits}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">GPA</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {student.gpa > 0 ? student.gpa.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
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

export default ViewStudentModal; 