import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { X, Filter } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface ProgramsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    department: string;
    level: string;
    status: string;
    searchTerm: string;
  };
  onApplyFilters: (filters: {
    department: string;
    level: string;
    status: string;
    searchTerm: string;
  }) => void;
  onClearFilters: () => void;
  departmentOptions: { value: string; label: string }[];
}

const ProgramsFilterDrawer: React.FC<ProgramsFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  departmentOptions,
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
      department: '',
      level: '',
      status: '',
      searchTerm: '',
    });
    onClearFilters();
  };

  // Adjust these options as needed for your program filters
  const levelOptions: SelectOption[] = [
    { value: '', label: 'All Levels' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
  ];

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'archived', label: 'Archived' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
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
            {/* Program Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Type
              </label>
              <Select<SelectOption>
                options={levelOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('level', selectedOption?.value || '')
                }
                value={
                  localFilters.level
                    ? levelOptions.find(option => option.value === localFilters.level)
                    : null
                }
                placeholder="Select program type"
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
                Department
              </label>
              <Select<SelectOption>
                options={departmentOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('department', selectedOption?.value || '')
                }
                value={
                  localFilters.department
                    ? departmentOptions.find(option => option.value === localFilters.department)
                    : null
                }
                placeholder="Select department"
                styles={selectStyles}
                className="w-full"
                isClearable={false}
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Term
              </label>
              <input
                type="text"
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Search programs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

export default ProgramsFilterDrawer; 