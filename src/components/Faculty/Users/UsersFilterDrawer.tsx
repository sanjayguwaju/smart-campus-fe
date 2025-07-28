import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

interface FilterState {
  role: string;
  status: string;
  searchTerm: string;
  dateRange: string;
  isEmailVerified: string;
}

interface UsersFilterDrawerProps {
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

const UsersFilterDrawer: React.FC<UsersFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Select options
  const roleOptions: SelectOption[] = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'student', label: 'Student' }
  ];

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];



  const emailVerificationOptions: SelectOption[] = [
    { value: '', label: 'All Users' },
    { value: 'verified', label: 'Verified' },
    { value: 'unverified', label: 'Unverified' }
  ];

  const dateRangeOptions: SelectOption[] = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
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
      role: '',
      status: '',
      searchTerm: '',
      dateRange: '',
      isEmailVerified: ''
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
            <h3 className="text-lg font-semibold text-gray-900">Filter Users</h3>
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

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Select
              value={roleOptions.find(option => option.value === localFilters.role)}
              onChange={(option) => handleFilterChange('role', option?.value || '')}
              options={roleOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select role..."
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



          {/* Email Verification Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Verification
            </label>
            <Select
              value={emailVerificationOptions.find(option => option.value === localFilters.isEmailVerified)}
              onChange={(option) => handleFilterChange('isEmailVerified', option?.value || '')}
              options={emailVerificationOptions}
              styles={selectStyles}
              isClearable={false}
              placeholder="Select verification status..."
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Joined Date
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
                {localFilters.role && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Role: {localFilters.role}</span>
                    <button
                      onClick={() => handleFilterChange('role', '')}
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

                {localFilters.isEmailVerified && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Email: {localFilters.isEmailVerified}</span>
                    <button
                      onClick={() => handleFilterChange('isEmailVerified', '')}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {localFilters.dateRange && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Date: {localFilters.dateRange}</span>
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

export default UsersFilterDrawer; 