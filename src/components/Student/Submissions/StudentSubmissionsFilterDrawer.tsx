import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

interface StudentSubmissionFilterState {
  status: string;
  assignment: string;
  course: string;
  isLate: boolean | undefined;
  isGraded: boolean | undefined;
}

interface StudentSubmissionsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StudentSubmissionFilterState;
  onApplyFilters: (filters: StudentSubmissionFilterState) => void;
  onClearFilters: () => void;
  assignments?: string[];
  courses?: string[];
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const StudentSubmissionsFilterDrawer: React.FC<StudentSubmissionsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  assignments = [],
  courses = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Select options
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
    { value: 'late', label: 'Late' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const assignmentOptions: SelectOption[] = [
    { value: '', label: 'All Assignments' },
    ...(assignments || []).map(assignment => ({ value: assignment, label: assignment }))
  ];

  const courseOptions: SelectOption[] = [
    { value: '', label: 'All Courses' },
    ...(courses || []).map(course => ({ value: course, label: course }))
  ];

  const lateOptions: SelectOption[] = [
    { value: '', label: 'All Submissions' },
    { value: 'true', label: 'Late Only' },
    { value: 'false', label: 'On Time Only' }
  ];

  const gradedOptions: SelectOption[] = [
    { value: '', label: 'All Submissions' },
    { value: 'true', label: 'Graded Only' },
    { value: 'false', label: 'Not Graded' }
  ];

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
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
      status: '',
      assignment: '',
      course: '',
      isLate: undefined,
      isGraded: undefined
    });
    onClearFilters();
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Submissions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Form */}
        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={statusOptions.find(option => option.value === localFilters.status)}
              onChange={(selectedOption) => handleFilterChange('status', selectedOption?.value || '')}
              styles={selectStyles}
              placeholder="Select Status"
              isSearchable={false}
            />
          </div>

          {/* Assignment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment
            </label>
            <Select
              options={assignmentOptions}
              value={assignmentOptions.find(option => option.value === localFilters.assignment)}
              onChange={(selectedOption) => handleFilterChange('assignment', selectedOption?.value || '')}
              styles={selectStyles}
              placeholder="Select Assignment"
              isSearchable={true}
            />
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <Select
              options={courseOptions}
              value={courseOptions.find(option => option.value === localFilters.course)}
              onChange={(selectedOption) => handleFilterChange('course', selectedOption?.value || '')}
              styles={selectStyles}
              placeholder="Select Course"
              isSearchable={true}
            />
          </div>

          {/* Late Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Timing
            </label>
            <Select
              options={lateOptions}
              value={lateOptions.find(option => option.value === (localFilters.isLate?.toString() || ''))}
              onChange={(selectedOption) => {
                const value = selectedOption?.value;
                handleFilterChange('isLate', value === '' ? undefined : value === 'true');
              }}
              styles={selectStyles}
              placeholder="Select Timing"
              isSearchable={false}
            />
          </div>

          {/* Graded Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grading Status
            </label>
            <Select
              options={gradedOptions}
              value={gradedOptions.find(option => option.value === (localFilters.isGraded?.toString() || ''))}
              onChange={(selectedOption) => {
                const value = selectedOption?.value;
                handleFilterChange('isGraded', value === '' ? undefined : value === 'true');
              }}
              styles={selectStyles}
              placeholder="Select Grading Status"
              isSearchable={false}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionsFilterDrawer;