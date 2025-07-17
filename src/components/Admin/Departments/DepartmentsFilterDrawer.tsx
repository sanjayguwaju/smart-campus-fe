import React from 'react';
import { X } from 'lucide-react';

interface DepartmentsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    name?: string;
    code?: string;
    headOfDepartment?: string;
    status?: string;
  };
  setFilters: (filters: DepartmentsFilterDrawerProps['filters']) => void;
}

const DepartmentsFilterDrawer: React.FC<DepartmentsFilterDrawerProps> = ({ isOpen, onClose, filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white w-80 max-w-full h-full shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filter Departments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Search by name"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={filters.code || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Search by code"
            />
          </div>
          <div>
            <label htmlFor="headOfDepartment" className="block text-sm font-medium text-gray-700 mb-1">Head of Department</label>
            <input
              type="text"
              id="headOfDepartment"
              name="headOfDepartment"
              value={filters.headOfDepartment || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Search by head of department"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentsFilterDrawer; 