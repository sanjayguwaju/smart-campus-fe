import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useCourses } from '../../../api/hooks/useCourses';
import { useUsers } from '../../../api/hooks/useUsers';
import { AssignmentFilters } from '../../../api/types/assignments';
import { CourseData } from '../../../api/types/courses';
import { UserData } from '../../../api/types/users';

interface AssignmentsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AssignmentFilters;
  onApplyFilters: (filters: AssignmentFilters) => void;
  onClearFilters: () => void;
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const AssignmentsFilterDrawer: React.FC<AssignmentsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState<AssignmentFilters>(filters);

  // Hooks
  const { data: coursesData } = useCourses(1, 100);
  const { data: usersData } = useUsers(1, 100, '', { role: 'faculty' });

  const courses = coursesData?.courses || [];
  const faculty = usersData?.users || [];

  // Select options
  const courseOptions: SelectOption[] = [
    { value: '', label: 'All Courses' },
    ...courses.map((course: CourseData) => ({
      value: course._id,
      label: `${course.code} - ${course.name}`
    }))
  ];

  const facultyOptions: SelectOption[] = [
    { value: '', label: 'All Faculty' },
    ...faculty.map((user: UserData) => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName}`
    }))
  ];

  const assignmentTypeOptions: SelectOption[] = [
    { value: '', label: 'All Types' },
    { value: 'Homework', label: 'Homework' },
    { value: 'Project', label: 'Project' },
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Exam', label: 'Exam' },
    { value: 'Lab', label: 'Lab' },
    { value: 'Presentation', label: 'Presentation' }
  ];

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'submission_closed', label: 'Submission Closed' },
    { value: 'grading', label: 'Grading' },
    { value: 'completed', label: 'Completed' }
  ];

  const difficultyOptions: SelectOption[] = [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const dueDateRangeOptions: SelectOption[] = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' },
    { value: 'month', label: 'Due This Month' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  // Async load options for courses
  const loadCourseOptions = (inputValue: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        const filtered = courseOptions.filter(course =>
          course.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  // Async load options for faculty
  const loadFacultyOptions = (inputValue: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        const filtered = facultyOptions.filter(faculty =>
          faculty.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  // Reset local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof AssignmentFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: AssignmentFilters = {
      title: '',
      course: '',
      faculty: '',
      assignmentType: '',
      status: '',
      difficulty: '',
      dueDateRange: '',
      tags: ''
    };
    setLocalFilters(clearedFilters);
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
            <h3 className="text-lg font-semibold text-gray-900">Filter Assignments</h3>
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
          {/* Course Filter - Async Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <AsyncSelect
              value={courseOptions.find(option => option.value === localFilters.course)}
              onChange={(option) => handleInputChange('course', option?.value || '')}
              loadOptions={loadCourseOptions}
              styles={selectStyles}
              isClearable
              placeholder="Search courses..."
              noOptionsMessage={() => "No courses found"}
              loadingMessage={() => "Loading courses..."}
              cacheOptions
              defaultOptions
            />
          </div>

          {/* Faculty Filter - Async Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faculty
            </label>
            <AsyncSelect
              value={facultyOptions.find(option => option.value === localFilters.faculty)}
              onChange={(option) => handleInputChange('faculty', option?.value || '')}
              loadOptions={loadFacultyOptions}
              styles={selectStyles}
              isClearable
              placeholder="Search faculty..."
              noOptionsMessage={() => "No faculty found"}
              loadingMessage={() => "Loading faculty..."}
              cacheOptions
              defaultOptions
            />
          </div>

          {/* Assignment Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Type
            </label>
            <Select
              value={assignmentTypeOptions.find(option => option.value === localFilters.assignmentType)}
              onChange={(option) => handleInputChange('assignmentType', option?.value || '')}
              options={assignmentTypeOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select assignment type..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusOptions.find(option => option.value === localFilters.status)}
              onChange={(option) => handleInputChange('status', option?.value || '')}
              options={statusOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select status..."
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <Select
              value={difficultyOptions.find(option => option.value === localFilters.difficulty)}
              onChange={(option) => handleInputChange('difficulty', option?.value || '')}
              options={difficultyOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select difficulty..."
            />
          </div>

          {/* Due Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date Range
            </label>
            <Select
              value={dueDateRangeOptions.find(option => option.value === localFilters.dueDateRange)}
              onChange={(option) => handleInputChange('dueDateRange', option?.value || '')}
              options={dueDateRangeOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select date range..."
            />
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={localFilters.tags || ''}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by tags..."
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="space-y-1">
                {localFilters.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Title: {localFilters.title}</span>
                    <button
                      onClick={() => handleInputChange('title', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.course && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Course: {courseOptions.find(opt => opt.value === localFilters.course)?.label}</span>
                    <button
                      onClick={() => handleInputChange('course', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.faculty && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Faculty: {facultyOptions.find(opt => opt.value === localFilters.faculty)?.label}</span>
                    <button
                      onClick={() => handleInputChange('faculty', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.assignmentType && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Type: {localFilters.assignmentType}</span>
                    <button
                      onClick={() => handleInputChange('assignmentType', '')}
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
                      onClick={() => handleInputChange('status', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.difficulty && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Difficulty: {localFilters.difficulty}</span>
                    <button
                      onClick={() => handleInputChange('difficulty', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.dueDateRange && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Date Range: {localFilters.dueDateRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <button
                      onClick={() => handleInputChange('dueDateRange', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.tags && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Tags: {localFilters.tags}</span>
                    <button
                      onClick={() => handleInputChange('tags', '')}
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

export default AssignmentsFilterDrawer; 