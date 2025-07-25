import { X, Filter } from "lucide-react";
import { useState } from "react";
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';

interface FilterState {
  status: string;
  searchTerm: string;
  category: string;
  priority: string;
  dateRange: string;
}

interface NoticeFilterDrawerProps {
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

const NoticeFilterDrawer: React.FC<NoticeFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Select options
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' }
  ];

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'staff', label: 'Staff' }
  ];

  const priorityOptions: SelectOption[] = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const dateRangeOptions: SelectOption[] = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Mock data for async select (search term suggestions)
  const mockSearchSuggestions = [
    { value: 'exam schedule', label: 'Exam Schedule' },
    { value: 'holiday notice', label: 'Holiday Notice' },
    { value: 'registration deadline', label: 'Registration Deadline' },
    { value: 'faculty meeting', label: 'Faculty Meeting' },
    { value: 'student orientation', label: 'Student Orientation' },
    { value: 'library hours', label: 'Library Hours' },
    { value: 'campus maintenance', label: 'Campus Maintenance' },
    { value: 'academic calendar', label: 'Academic Calendar' },
    { value: 'graduation ceremony', label: 'Graduation Ceremony' },
    { value: 'sports event', label: 'Sports Event' }
  ];

  // Async load options for search suggestions
  const loadSearchOptions = (inputValue: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        const filtered = mockSearchSuggestions.filter(suggestion =>
          suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      status: '',
      searchTerm: '',
      category: '',
      priority: '',
      dateRange: '',
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
            <h3 className="text-lg font-semibold text-gray-900">Filter Notices</h3>
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

          {/* Search Term Filter - Async Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <AsyncSelect
              value={localFilters.searchTerm ? { value: localFilters.searchTerm, label: localFilters.searchTerm } : null}
              onChange={(option) => handleFilterChange('searchTerm', option?.value || '')}
              loadOptions={loadSearchOptions}
              styles={selectStyles}
              isClearable
              placeholder="Search notices..."
              noOptionsMessage={() => "No suggestions found"}
              loadingMessage={() => "Loading suggestions..."}
              cacheOptions
              defaultOptions
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

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={categoryOptions.find(option => option.value === localFilters.category)}
              onChange={(option) => handleFilterChange('category', option?.value || '')}
              options={categoryOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select category..."
            />
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={priorityOptions.find(option => option.value === localFilters.priority)}
              onChange={(option) => handleFilterChange('priority', option?.value || '')}
              options={priorityOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select priority..."
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
                {localFilters.searchTerm && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Search: {localFilters.searchTerm}</span>
                    <button
                      onClick={() => handleFilterChange('searchTerm', '')}
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
                {localFilters.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Category: {localFilters.category}</span>
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.priority && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Priority: {localFilters.priority}</span>
                    <button
                      onClick={() => handleFilterChange('priority', '')}
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
              onClick={handleClear}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
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

export default NoticeFilterDrawer;
