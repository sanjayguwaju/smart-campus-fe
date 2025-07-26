import React from 'react';
import { X, UserCheck, CheckCircle } from 'lucide-react';
import { UserData } from '../../api/types/users';

interface ActivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserData | null;
  isLoading?: boolean;
}

const ActivateUserModal: React.FC<ActivateUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activate User</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to activate this user?
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
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">
                {user.firstName && user.lastName 
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : user.email.charAt(0).toUpperCase()
                }
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {user.displayName || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
              </h4>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Activation</p>
                <p className="text-sm text-green-700 mt-1">
                  Activating this user will restore their access to the system. 
                  They will be able to log in and use their account normally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Activating...
              </>
            ) : (
              'Activate User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateUserModal; 