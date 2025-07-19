import React from 'react';
import { useDeleteProgram } from '../../../api/hooks/usePrograms';
import { toast } from 'react-hot-toast';

interface DeleteProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: string;
  programName: string;
}

const DeleteProgramModal: React.FC<DeleteProgramModalProps> = ({ isOpen, onClose, programId, programName }) => {
  const { mutateAsync, isPending } = useDeleteProgram();

  const handleDelete = async () => {
    try {
      await mutateAsync(programId);
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete program';
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md animate-fadeIn">
        <div className="flex flex-col items-center p-6">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Delete Program</h2>
          <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>

          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6 flex flex-col items-center">
            <span className="text-base font-medium text-gray-800 mb-1">{programName}</span>
          </div>

          <p className="text-sm text-gray-600 text-center mb-6">
            Are you sure you want to delete this program? This will permanently remove the program and all associated data.
          </p>

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isPending ? 'Deleting...' : 'Delete Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProgramModal; 