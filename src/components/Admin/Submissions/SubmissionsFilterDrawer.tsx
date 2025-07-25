import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

interface FilterState {
  status: string;
  assignment: string;
  student: string;
  course: string;
  isLate: boolean | undefined;
  isGraded: boolean | undefined;
}

interface SubmissionsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  assignments?: string[];
  students?: string[];
  courses?: string[];
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const SubmissionsFilterDrawer: React.FC<SubmissionsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  assignments = [],
  students = [],
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

  const studentOptions: SelectOption[] = [
    { value: '', label: 'All Students' },
    ...(students || []).map(student => ({ value: student, label: student }))
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
      student: '',
      course: '',
      isLate: undefined,
      isGraded: undefined
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '' && value !== undefined);

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
      <div className={`fixed -top-5 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Submissions</h3>
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

          {/* Assignment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment
            </label>
            <Select
              value={assignmentOptions.find(option => option.value === localFilters.assignment)}
              onChange={(option) => handleFilterChange('assignment', option?.value || '')}
              options={assignmentOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select assignment..."
            />
          </div>

          {/* Student Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <Select
              value={studentOptions.find(option => option.value === localFilters.student)}
              onChange={(option) => handleFilterChange('student', option?.value || '')}
              options={studentOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select student..."
            />
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <Select
              value={courseOptions.find(option => option.value === localFilters.course)}
              onChange={(option) => handleFilterChange('course', option?.value || '')}
              options={courseOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select course..."
            />
          </div>

          {/* Late Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Status
            </label>
            <Select
              value={lateOptions.find(option => option.value === String(localFilters.isLate))}
              onChange={(option) => handleFilterChange('isLate', option?.value === 'true' ? true : option?.value === 'false' ? false : undefined)}
              options={lateOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select late status..."
            />
          </div>

          {/* Graded Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grading Status
            </label>
            <Select
              value={gradedOptions.find(option => option.value === String(localFilters.isGraded))}
              onChange={(option) => handleFilterChange('isGraded', option?.value === 'true' ? true : option?.value === 'false' ? false : undefined)}
              options={gradedOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select grading status..."
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="space-y-1">
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
                {localFilters.assignment && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Assignment: {localFilters.assignment}</span>
                    <button
                      onClick={() => handleFilterChange('assignment', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.student && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Student: {localFilters.student}</span>
                    <button
                      onClick={() => handleFilterChange('student', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.course && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Course: {localFilters.course}</span>
                    <button
                      onClick={() => handleFilterChange('course', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.isLate !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Late: {localFilters.isLate ? 'Yes' : 'No'}</span>
                    <button
                      onClick={() => handleFilterChange('isLate', undefined)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.isGraded !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Graded: {localFilters.isGraded ? 'Yes' : 'No'}</span>
                    <button
                      onClick={() => handleFilterChange('isGraded', undefined)}
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

export default SubmissionsFilterDrawer; 