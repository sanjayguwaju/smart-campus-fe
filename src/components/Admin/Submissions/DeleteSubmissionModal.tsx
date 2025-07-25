import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  submissionTitle: string;
  isDeleting: boolean;
}

const DeleteSubmissionModal: React.FC<DeleteSubmissionModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  submissionTitle,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delete Submission</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-6">
            You are about to delete the submission for <strong>{submissionTitle}</strong>. 
            This will permanently remove all associated files and data.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Submission'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubmissionModal; 