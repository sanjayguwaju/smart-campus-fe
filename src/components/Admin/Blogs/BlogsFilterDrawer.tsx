import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { X, Filter, Calendar, Tag, User } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface BlogsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    author: string;
    status: string;
    tags: string;
    searchTerm: string;
    dateRange: string;
    featured: string;
  };
  onApplyFilters: (filters: {
    author: string;
    status: string;
    tags: string;
    searchTerm: string;
    dateRange: string;
    featured: string;
  }) => void;
  onClearFilters: () => void;
}

const BlogsFilterDrawer: React.FC<BlogsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Custom styles for react-select
  const selectStyles: StylesConfig<SelectOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      borderRadius: '8px',
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
      borderRadius: '8px',
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
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      author: '',
      status: '',
      tags: '',
      searchTerm: '',
      dateRange: '',
      featured: '',
    });
    onClearFilters();
  };

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  const dateRangeOptions: SelectOption[] = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const featuredOptions: SelectOption[] = [
    { value: '', label: 'All Posts' },
    { value: 'featured', label: 'Featured Only' },
    { value: 'not-featured', label: 'Not Featured' },
  ];

  const tagOptions: SelectOption[] = [
    { value: '', label: 'All Tags' },
    { value: 'academic', label: 'Academic' },
    { value: 'research', label: 'Research' },
    { value: 'student-life', label: 'Student Life' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'events', label: 'Events' },
    { value: 'technology', label: 'Technology' },
    { value: 'campus-news', label: 'Campus News' },
  ];

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
      <div
        className={`fixed -top-5 right-0 h-screen w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {/* Search Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Search blog posts..."
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Author
              </label>
              <input
                type="text"
                value={localFilters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Filter by author..."
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select<SelectOption>
                options={statusOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('status', selectedOption?.value || '')
                }
                value={
                  statusOptions.find(option => option.value === localFilters.status) || null
                }
                styles={selectStyles}
                placeholder="Select status"
                isClearable
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                Tags
              </label>
              <Select<SelectOption>
                options={tagOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('tags', selectedOption?.value || '')
                }
                value={
                  tagOptions.find(option => option.value === localFilters.tags) || null
                }
                styles={selectStyles}
                placeholder="Select tag"
                isClearable
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <Select<SelectOption>
                options={dateRangeOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('dateRange', selectedOption?.value || '')
                }
                value={
                  dateRangeOptions.find(option => option.value === localFilters.dateRange) || null
                }
                styles={selectStyles}
                placeholder="Select date range"
                isClearable
              />
            </div>

            {/* Featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Status
              </label>
              <Select<SelectOption>
                options={featuredOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('featured', selectedOption?.value || '')
                }
                value={
                  featuredOptions.find(option => option.value === localFilters.featured) || null
                }
                styles={selectStyles}
                placeholder="Select featured status"
                isClearable
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsFilterDrawer; 