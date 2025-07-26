import React from 'react';
import { X, User, Mail, Phone, Calendar, Shield, UserCheck, UserX, Building, GraduationCap, Briefcase } from 'lucide-react';
import { UserData } from '../../api/types/users';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!isOpen || !user) return null;

  // Helper function to get display name
  const getDisplayName = (user: UserData) => {
    if (user.displayName && user.displayName !== 'undefined undefined') {
      return user.displayName;
    }
    if (user.fullName && user.fullName !== 'undefined undefined') {
      return user.fullName;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    return user.email;
  };

  // Helper function to get initials
  const getInitials = (user: UserData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return nameParts[0].charAt(0);
    }
    return user.email.charAt(0).toUpperCase();
  };

  // Helper function to get user ID
  const getUserId = (user: UserData) => {
    return user.studentId || user.facultyId || user.employeeId || '-';
  };

  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'faculty':
        return <Briefcase className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <p className="text-sm text-gray-500">
                View detailed information for {getDisplayName(user)}
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
          {/* User Avatar and Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-medium text-white">
                {getInitials(user)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{getDisplayName(user)}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1 capitalize">{user.role}</span>
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.firstName && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">First Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                  </div>
                </div>
              )}
              {user.lastName && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.lastName}</p>
                  </div>
                </div>
              )}
                             {user.phone && (
                 <div className="flex items-center space-x-2">
                   <Phone className="h-4 w-4 text-gray-400" />
                   <div>
                     <p className="text-xs text-gray-500">Phone</p>
                     <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Academic/Professional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Academic/Professional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {getUserId(user) !== '-' && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">ID Number</p>
                    <p className="text-sm font-medium text-gray-900">{getUserId(user)}</p>
                  </div>
                </div>
              )}
              
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {user.lastLogin && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {user.updatedAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
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

export default ViewUserModal; 