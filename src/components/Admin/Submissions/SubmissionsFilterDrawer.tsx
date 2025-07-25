import React from 'react';
import { X } from 'lucide-react';

interface SubmissionsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: string;
    assignment: string;
    student: string;
    course: string;
    isLate: boolean | undefined;
    isGraded: boolean | undefined;
  };
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
}

const SubmissionsFilterDrawer: React.FC<SubmissionsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filter Submissions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-700">
            Filter functionality will be implemented here.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
          <button
            onClick={() => onApplyFilters(filters)}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsFilterDrawer; 