import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { X, Filter, Calendar, MapPin, Star } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface EventsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    eventType: string;
    status: string;
    category: string;
    searchTerm: string;
    dateRange: string;
    featured: string;
    location: string;
  };
  onApplyFilters: (filters: {
    eventType: string;
    status: string;
    category: string;
    searchTerm: string;
    dateRange: string;
    featured: string;
    location: string;
  }) => void;
  onClearFilters: () => void;
}

const EventsFilterDrawer: React.FC<EventsFilterDrawerProps> = ({
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
      eventType: '',
      status: '',
      category: '',
      searchTerm: '',
      dateRange: '',
      featured: '',
      location: '',
    });
    onClearFilters();
  };

  const eventTypeOptions: SelectOption[] = [
    { value: '', label: 'All Types' },
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' },
    { value: 'social', label: 'Social' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
    { value: 'postponed', label: 'Postponed' },
  ];

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'admin', label: 'Admin' },
    { value: 'public', label: 'Public' },
    { value: 'invitation-only', label: 'Invitation Only' },
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
    { value: '', label: 'All Events' },
    { value: 'featured', label: 'Featured Only' },
    { value: 'not-featured', label: 'Not Featured' },
  ];

  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Locations' },
    { value: 'central-campus', label: 'Central Campus' },
    { value: 'north-campus', label: 'North Campus' },
    { value: 'south-campus', label: 'South Campus' },
    { value: 'online', label: 'Online' },
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
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <Select<SelectOption>
                options={eventTypeOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('eventType', selectedOption?.value || '')
                }
                value={
                  localFilters.eventType
                    ? eventTypeOptions.find(option => option.value === localFilters.eventType)
                    : null
                }
                placeholder="Select event type"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
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
                  localFilters.status
                    ? statusOptions.find(option => option.value === localFilters.status)
                    : null
                }
                placeholder="Select status"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select<SelectOption>
                options={categoryOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('category', selectedOption?.value || '')
                }
                value={
                  localFilters.category
                    ? categoryOptions.find(option => option.value === localFilters.category)
                    : null
                }
                placeholder="Select category"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
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
                  localFilters.dateRange
                    ? dateRangeOptions.find(option => option.value === localFilters.dateRange)
                    : null
                }
                placeholder="Select date range"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
              />
            </div>

            {/* Featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1" />
                Featured Events
              </label>
              <Select<SelectOption>
                options={featuredOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('featured', selectedOption?.value || '')
                }
                value={
                  localFilters.featured
                    ? featuredOptions.find(option => option.value === localFilters.featured)
                    : null
                }
                placeholder="Select featured filter"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <Select<SelectOption>
                options={locationOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('location', selectedOption?.value || '')
                }
                value={
                  localFilters.location
                    ? locationOptions.find(option => option.value === localFilters.location)
                    : null
                }
                placeholder="Select location"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3 flex-shrink-0">
            <button
              onClick={handleApply}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsFilterDrawer; 