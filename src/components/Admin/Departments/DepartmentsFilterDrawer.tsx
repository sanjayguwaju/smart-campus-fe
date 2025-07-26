import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { X, Filter, Building, MapPin, User, Hash } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface DepartmentsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    name: string;
    code: string;
    status: string;
    location: string;
  };
  onApplyFilters: (filters: {
    name: string;
    code: string;
    status: string;
    location: string;
  }) => void;
  onClearFilters: () => void;
}

const DepartmentsFilterDrawer: React.FC<DepartmentsFilterDrawerProps> = ({
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
      name: '',
      code: '',
      status: '',
      location: '',
    });
    onClearFilters();
  };

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Locations' },
    { value: 'kathmandu', label: 'Kathmandu' },
    { value: 'pokhara', label: 'Pokhara' },
    { value: 'biratnagar', label: 'Biratnagar' },
    { value: 'lalitpur', label: 'Lalitpur' },
    { value: 'bhaktapur', label: 'Bhaktapur' },
    { value: 'online', label: 'Online' },
  ];

  const departmentTypeOptions: SelectOption[] = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'management', label: 'Management' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'law', label: 'Law' },
    { value: 'arts-sciences', label: 'Arts & Sciences' },
    { value: 'education', label: 'Education' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'forestry', label: 'Forestry' },
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
        <div className="flex flex-col h-full">
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
            {/* Department Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-1" />
                Department Type
              </label>
              <Select<SelectOption>
                options={departmentTypeOptions}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('name', selectedOption?.value || '')
                }
                value={
                  localFilters.name
                    ? departmentTypeOptions.find(option => option.value === localFilters.name)
                    : null
                }
                placeholder="Select department type"
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

            {/* Department Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4 inline mr-1" />
                Department Code
              </label>
              <Select<SelectOption>
                options={[
                  { value: '', label: 'All Codes' },
                  { value: 'CS', label: 'CS - Computer Science' },
                  { value: 'ENG', label: 'ENG - Engineering' },
                  { value: 'MGT', label: 'MGT - Management' },
                  { value: 'MED', label: 'MED - Medicine' },
                  { value: 'LAW', label: 'LAW - Law' },
                  { value: 'ARTS', label: 'ARTS - Arts & Sciences' },
                  { value: 'EDU', label: 'EDU - Education' },
                  { value: 'ARCH', label: 'ARCH - Architecture' },
                  { value: 'AGRI', label: 'AGRI - Agriculture' },
                  { value: 'FOR', label: 'FOR - Forestry' },
                ]}
                onChange={(selectedOption: SelectOption | null) => 
                  handleFilterChange('code', selectedOption?.value || '')
                }
                value={
                  localFilters.code
                    ? [
                        { value: '', label: 'All Codes' },
                        { value: 'CS', label: 'CS - Computer Science' },
                        { value: 'ENG', label: 'ENG - Engineering' },
                        { value: 'MGT', label: 'MGT - Management' },
                        { value: 'MED', label: 'MED - Medicine' },
                        { value: 'LAW', label: 'LAW - Law' },
                        { value: 'ARTS', label: 'ARTS - Arts & Sciences' },
                        { value: 'EDU', label: 'EDU - Education' },
                        { value: 'ARCH', label: 'ARCH - Architecture' },
                        { value: 'AGRI', label: 'AGRI - Agriculture' },
                        { value: 'FOR', label: 'FOR - Forestry' },
                      ].find(option => option.value === localFilters.code)
                    : null
                }
                placeholder="Select department code"
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

export default DepartmentsFilterDrawer; 