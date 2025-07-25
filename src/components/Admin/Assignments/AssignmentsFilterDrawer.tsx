import React, { useState, useEffect } from 'react';
import { X, Filter, Calendar } from 'lucide-react';
import Select from 'react-select';
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
  const courseOptions: SelectOption[] = courses.map((course: CourseData) => ({
    value: course._id,
    label: `${course.code} - ${course.name}`
  }));

  const facultyOptions: SelectOption[] = faculty.map((user: UserData) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName}`
  }));

  const assignmentTypeOptions: SelectOption[] = [
    { value: 'Homework', label: 'Homework' },
    { value: 'Project', label: 'Project' },
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Exam', label: 'Exam' },
    { value: 'Lab', label: 'Lab' },
    { value: 'Presentation', label: 'Presentation' }
  ];

  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'submission_closed', label: 'Submission Closed' },
    { value: 'grading', label: 'Grading' },
    { value: 'completed', label: 'Completed' }
  ];

  const difficultyOptions: SelectOption[] = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const dueDateRangeOptions: SelectOption[] = [
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' },
    { value: 'month', label: 'Due This Month' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Assignments</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title
            </label>
            <input
              type="text"
              value={localFilters.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by title..."
            />
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <Select
              value={courseOptions.find(option => option.value === localFilters.course)}
              onChange={(option) => handleInputChange('course', option?.value || '')}
              options={courseOptions}
              placeholder="Select course"
              isClearable
            />
          </div>

          {/* Faculty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faculty
            </label>
            <Select
              value={facultyOptions.find(option => option.value === localFilters.faculty)}
              onChange={(option) => handleInputChange('faculty', option?.value || '')}
              options={facultyOptions}
              placeholder="Select faculty"
              isClearable
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
              placeholder="Select assignment type"
              isClearable
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
              placeholder="Select status"
              isClearable
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
              placeholder="Select difficulty"
              isClearable
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
              placeholder="Select date range"
              isClearable
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by tags..."
            />
          </div>

          {/* Filter Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsFilterDrawer; 