import React from 'react';
import { X, Filter, Calendar, User, BookOpen, GraduationCap } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

interface EnrollmentsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: string;
    enrollmentType: string;
    academicYear: string;
    semester: string;
    program: string;
    student: string;
    advisor: string;
    dateRange: string;
  };
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
}

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
  const [localFilters, setLocalFilters] = React.useState(filters);

  // Custom styles for react-select
  const selectStyles: StylesConfig<SelectOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
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
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    })
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
    const clearedFilters = {
      status: '',
      enrollmentType: '',
      academicYear: '',
      semester: '',
      program: '',
      student: '',
      advisor: '',
      dateRange: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Filter className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Filter Enrollments</h2>
              <p className="text-sm text-gray-600">Refine your search results</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Status
              </label>
              <Select
                value={localFilters.status ? { value: localFilters.status, label: localFilters.status.charAt(0).toUpperCase() + localFilters.status.slice(1) } : null}
                onChange={(option) => handleFilterChange('status', option?.value || '')}
                placeholder="Select status..."
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'completed', label: 'Completed' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Enrollment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                Enrollment Type
              </label>
              <Select
                value={localFilters.enrollmentType ? { value: localFilters.enrollmentType, label: localFilters.enrollmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) } : null}
                onChange={(option) => handleFilterChange('enrollmentType', option?.value || '')}
                placeholder="Select enrollment type..."
                options={[
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'part_time', label: 'Part Time' },
                  { value: 'distance_learning', label: 'Distance Learning' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                Academic Year
              </label>
              <Select
                value={localFilters.academicYear ? { value: localFilters.academicYear, label: localFilters.academicYear } : null}
                onChange={(option) => handleFilterChange('academicYear', option?.value || '')}
                placeholder="Select academic year..."
                options={[
                  { value: '2024-2025', label: '2024-2025' },
                  { value: '2023-2024', label: '2023-2024' },
                  { value: '2022-2023', label: '2022-2023' },
                  { value: '2021-2022', label: '2021-2022' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                Semester
              </label>
              <Select
                value={localFilters.semester ? { value: localFilters.semester, label: `Semester ${localFilters.semester}` } : null}
                onChange={(option) => handleFilterChange('semester', option?.value || '')}
                placeholder="Select semester..."
                options={[
                  { value: '1', label: 'Semester 1' },
                  { value: '2', label: 'Semester 2' },
                  { value: '3', label: 'Semester 3' },
                  { value: '4', label: 'Semester 4' },
                  { value: '5', label: 'Semester 5' },
                  { value: '6', label: 'Semester 6' },
                  { value: '7', label: 'Semester 7' },
                  { value: '8', label: 'Semester 8' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Program Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-indigo-600" />
                Program
              </label>
              <Select
                value={localFilters.program ? { value: localFilters.program, label: localFilters.program } : null}
                onChange={(option) => handleFilterChange('program', option?.value || '')}
                placeholder="Select program..."
                options={[
                  { value: 'Bachelor of Computer Science', label: 'Bachelor of Computer Science' },
                  { value: 'Bachelor of Engineering', label: 'Bachelor of Engineering' },
                  { value: 'Master of Business Administration', label: 'Master of Business Administration' },
                  { value: 'Bachelor of Arts', label: 'Bachelor of Arts' },
                  { value: 'Bachelor of Science', label: 'Bachelor of Science' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Student Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-orange-600" />
                Student
              </label>
              <Select
                value={localFilters.student ? { value: localFilters.student, label: localFilters.student } : null}
                onChange={(option) => handleFilterChange('student', option?.value || '')}
                placeholder="Search by student..."
                options={[
                  { value: 'John Doe', label: 'John Doe' },
                  { value: 'Jane Smith', label: 'Jane Smith' },
                  { value: 'Mike Johnson', label: 'Mike Johnson' },
                  { value: 'Sarah Wilson', label: 'Sarah Wilson' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Advisor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-teal-600" />
                Advisor
              </label>
              <Select
                value={localFilters.advisor ? { value: localFilters.advisor, label: localFilters.advisor } : null}
                onChange={(option) => handleFilterChange('advisor', option?.value || '')}
                placeholder="Search by advisor..."
                options={[
                  { value: 'Dr. Smith', label: 'Dr. Smith' },
                  { value: 'Dr. Johnson', label: 'Dr. Johnson' },
                  { value: 'Dr. Brown', label: 'Dr. Brown' },
                  { value: 'Dr. Davis', label: 'Dr. Davis' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-red-600" />
                Date Range
              </label>
              <Select
                value={localFilters.dateRange ? { value: localFilters.dateRange, label: localFilters.dateRange } : null}
                onChange={(option) => handleFilterChange('dateRange', option?.value || '')}
                placeholder="Select date range..."
                options={[
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'last_7_days', label: 'Last 7 days' },
                  { value: 'last_30_days', label: 'Last 30 days' },
                  { value: 'last_90_days', label: 'Last 90 days' },
                  { value: 'this_year', label: 'This year' },
                  { value: 'last_year', label: 'Last year' }
                ]}
                styles={selectStyles}
                isClearable
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">
                {Object.values(filters).filter(value => value !== '').length} active filter(s)
              </span>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsFilterDrawer; 