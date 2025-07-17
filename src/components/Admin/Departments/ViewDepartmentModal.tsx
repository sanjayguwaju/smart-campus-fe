import React from 'react';
import { X, Building } from 'lucide-react';
import { DepartmentData } from '../../../api/types/departments';

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentData | null;
}

const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  if (!isOpen || !department) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Department Details</h2>
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
            <span className="font-semibold text-gray-700">Name:</span> {department.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Code:</span> {department.code}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Description:</span> {department.description || 'N/A'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Head of Department:</span> {department.headOfDepartment || 'N/A'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Faculty Count:</span> {department.facultyCount}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Student Count:</span> {department.studentCount}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span> {department.isActive ? 'Active' : 'Inactive'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span> {new Date(department.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Updated At:</span> {new Date(department.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentModal; 