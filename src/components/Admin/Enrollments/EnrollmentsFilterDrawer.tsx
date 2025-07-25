import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';

interface FilterState {
  status: string;
  enrollmentType: string;
  academicYear: string;
  semester: string;
  program: string;
  student: string;
  advisor: string;
  dateRange: string;
}

interface EnrollmentsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const EnrollmentsFilterDrawer: React.FC<EnrollmentsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Select options
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'completed', label: 'Completed' }
  ];

  const enrollmentTypeOptions: SelectOption[] = [
    { value: '', label: 'All Types' },
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'distance_learning', label: 'Distance Learning' }
  ];

  const academicYearOptions: SelectOption[] = [
    { value: '', label: 'All Years' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' }
  ];

  const semesterOptions: SelectOption[] = [
    { value: '', label: 'All Semesters' },
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' }
  ];

  const programOptions: SelectOption[] = [
    { value: '', label: 'All Programs' },
    { value: 'Bachelor of Computer Science', label: 'Bachelor of Computer Science' },
    { value: 'Bachelor of Engineering', label: 'Bachelor of Engineering' },
    { value: 'Master of Business Administration', label: 'Master of Business Administration' },
    { value: 'Bachelor of Arts', label: 'Bachelor of Arts' },
    { value: 'Bachelor of Science', label: 'Bachelor of Science' }
  ];

  const dateRangeOptions: SelectOption[] = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'last_90_days', label: 'Last 90 days' },
    { value: 'this_year', label: 'This year' },
    { value: 'last_year', label: 'Last year' }
  ];

  // Mock data for async select
  const mockStudents = [
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Jane Smith', label: 'Jane Smith' },
    { value: 'Mike Johnson', label: 'Mike Johnson' },
    { value: 'Sarah Wilson', label: 'Sarah Wilson' },
    { value: 'David Brown', label: 'David Brown' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'Michael Wilson', label: 'Michael Wilson' },
    { value: 'Lisa Anderson', label: 'Lisa Anderson' },
    { value: 'Robert Taylor', label: 'Robert Taylor' },
    { value: 'Jennifer Martinez', label: 'Jennifer Martinez' }
  ];

  const mockAdvisors = [
    { value: 'Dr. Smith', label: 'Dr. Smith' },
    { value: 'Dr. Johnson', label: 'Dr. Johnson' },
    { value: 'Dr. Brown', label: 'Dr. Brown' },
    { value: 'Dr. Davis', label: 'Dr. Davis' },
    { value: 'Dr. Wilson', label: 'Dr. Wilson' },
    { value: 'Dr. Anderson', label: 'Dr. Anderson' },
    { value: 'Dr. Taylor', label: 'Dr. Taylor' },
    { value: 'Dr. Martinez', label: 'Dr. Martinez' },
    { value: 'Dr. Garcia', label: 'Dr. Garcia' },
    { value: 'Dr. Rodriguez', label: 'Dr. Rodriguez' }
  ];

  // Async load options for students
  const loadStudentOptions = (inputValue: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        const filtered = mockStudents.filter(student =>
          student.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  // Async load options for advisors
  const loadAdvisorOptions = (inputValue: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        const filtered = mockAdvisors.filter(advisor =>
          advisor.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

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
      status: '',
      enrollmentType: '',
      academicYear: '',
      semester: '',
      program: '',
      student: '',
      advisor: '',
      dateRange: ''
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
            <h3 className="text-lg font-semibold text-gray-900">Filter Enrollments</h3>
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

          {/* Enrollment Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment Type
            </label>
            <Select
              value={enrollmentTypeOptions.find(option => option.value === localFilters.enrollmentType)}
              onChange={(option) => handleFilterChange('enrollmentType', option?.value || '')}
              options={enrollmentTypeOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select enrollment type..."
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
              placeholder="Select academic year..."
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

          {/* Program Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program
            </label>
            <Select
              value={programOptions.find(option => option.value === localFilters.program)}
              onChange={(option) => handleFilterChange('program', option?.value || '')}
              options={programOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select program..."
            />
          </div>

          {/* Student Filter - Async Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <AsyncSelect
              value={localFilters.student ? { value: localFilters.student, label: localFilters.student } : null}
              onChange={(option) => handleFilterChange('student', option?.value || '')}
              loadOptions={loadStudentOptions}
              styles={selectStyles}
              isClearable
              placeholder="Search by student..."
              noOptionsMessage={() => "No students found"}
              loadingMessage={() => "Loading students..."}
              cacheOptions
              defaultOptions
            />
          </div>

          {/* Advisor Filter - Async Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advisor
            </label>
            <AsyncSelect
              value={localFilters.advisor ? { value: localFilters.advisor, label: localFilters.advisor } : null}
              onChange={(option) => handleFilterChange('advisor', option?.value || '')}
              loadOptions={loadAdvisorOptions}
              styles={selectStyles}
              isClearable
              placeholder="Search by advisor..."
              noOptionsMessage={() => "No advisors found"}
              loadingMessage={() => "Loading advisors..."}
              cacheOptions
              defaultOptions
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Select
              value={dateRangeOptions.find(option => option.value === localFilters.dateRange)}
              onChange={(option) => handleFilterChange('dateRange', option?.value || '')}
              options={dateRangeOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select date range..."
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
                {localFilters.enrollmentType && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Type: {localFilters.enrollmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <button
                      onClick={() => handleFilterChange('enrollmentType', '')}
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
                {localFilters.program && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Program: {localFilters.program}</span>
                    <button
                      onClick={() => handleFilterChange('program', '')}
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
                {localFilters.advisor && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Advisor: {localFilters.advisor}</span>
                    <button
                      onClick={() => handleFilterChange('advisor', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.dateRange && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Date Range: {localFilters.dateRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <button
                      onClick={() => handleFilterChange('dateRange', '')}
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

export default EnrollmentsFilterDrawer; 