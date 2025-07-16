import React from 'react';

interface DeleteProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  programName: string;
}

const DeleteProgramModal: React.FC<DeleteProgramModalProps> = ({ isOpen, onClose, onDelete, programName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Delete Program</h2>
        <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{programName}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProgramModal; 