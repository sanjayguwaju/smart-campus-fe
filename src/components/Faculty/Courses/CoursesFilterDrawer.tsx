import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

interface FilterState {
  name: string;
  code: string;
  department: string;
  instructor: string;
  semester: string;
  academicYear: string;
  status: string;
}

interface CoursesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  departments: string[];
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const CoursesFilterDrawer: React.FC<CoursesFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  departments
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Select options
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const departmentOptions: SelectOption[] = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  const semesterOptions: SelectOption[] = [
    { value: '', label: 'All Semesters' },
    { value: 'Fall', label: 'Fall' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Summer', label: 'Summer' }
  ];

  const academicYearOptions: SelectOption[] = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({
      name: '',
      code: '',
      department: '',
      instructor: '',
      semester: '',
      academicYear: '',
      status: ''
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  // Custom styles for React Select
  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed -top-5 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Courses</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full">

          {/* Course Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              value={localFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by name..."
            />
          </div>

          {/* Course Code Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              value={localFilters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by code..."
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <Select
              value={departmentOptions.find(option => option.value === localFilters.department)}
              onChange={(option) => handleFilterChange('department', option?.value || '')}
              options={departmentOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select department..."
            />
          </div>

          {/* Instructor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor
            </label>
            <input
              type="text"
              value={localFilters.instructor}
              onChange={(e) => handleFilterChange('instructor', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by instructor..."
            />
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <Select
              value={semesterOptions.find(option => option.value === localFilters.semester)}
              onChange={(option) => handleFilterChange('semester', option?.value || '')}
              options={semesterOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select semester..."
            />
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <Select
              value={academicYearOptions.find(option => option.value === localFilters.academicYear)}
              onChange={(option) => handleFilterChange('academicYear', option?.value || '')}
              options={academicYearOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select year..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusOptions.find(option => option.value === localFilters.status)}
              onChange={(option) => handleFilterChange('status', option?.value || '')}
              options={statusOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select status..."
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="space-y-1">
                {localFilters.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Name: {localFilters.name}</span>
                    <button
                      onClick={() => handleFilterChange('name', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.code && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Code: {localFilters.code}</span>
                    <button
                      onClick={() => handleFilterChange('code', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Department: {localFilters.department}</span>
                    <button
                      onClick={() => handleFilterChange('department', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.instructor && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Instructor: {localFilters.instructor}</span>
                    <button
                      onClick={() => handleFilterChange('instructor', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.semester && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Semester: {localFilters.semester}</span>
                    <button
                      onClick={() => handleFilterChange('semester', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.academicYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Year: {localFilters.academicYear}</span>
                    <button
                      onClick={() => handleFilterChange('academicYear', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Status: {localFilters.status}</span>
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesFilterDrawer; 