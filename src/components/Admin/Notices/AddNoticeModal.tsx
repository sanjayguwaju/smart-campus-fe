import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { useCreateNotice } from '../../../api/hooks/useNotices';
import { Notice } from '../../../api/types/notices';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  title: string;
  content: string;
  type: string;
  category: string;
  priority: string;
  publishDate: string;
  expiryDate: string;
  author: string;
  pinned: boolean;
}

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const createNotice = useCreateNotice();

  // Custom styles for react-select
  const selectStyles: StylesConfig<SelectOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      type: 'announcement',
      category: 'all',
      priority: 'medium',
      publishDate: new Date().toISOString().slice(0, 10),
      expiryDate: '',
      author: '',
      pinned: false
    }
  });

  const watchedPublishDate = watch('publishDate');

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        settings: { pinToTop: data.pinned }
      };
      delete (payload as any).pinned;
      
      await createNotice.mutateAsync(payload as Notice);
      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create notice:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.022C7.969 4.53 5.2 7.09 5.02 10.162A3.011 3.011 0 007 11h1.5v-.5A1.5 1.5 0 0110 9h4a1.5 1.5 0 011.5 1.5v.5H17a3.011 3.011 0 001.98-.838C18.8 7.09 16.031 4.53 13 5.022V3a1 1 0 10-2 0v2.022zM9 12a1 1 0 100 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a1 1 0 100-2H9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Notice</h2>
              <p className="text-sm text-gray-600">Create a new notice with all necessary details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ 
                      required: 'Title is required',
                      maxLength: { value: 200, message: 'Title cannot exceed 200 characters' }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.title ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter notice title"
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <Controller
                    name="author"
                    control={control}
                    rules={{ required: 'Author is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.author ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter author name"
                      />
                    )}
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Type is required' }}
                    render={({ field }) => (
                      <Select<SelectOption>
                        options={[
                          { value: 'announcement', label: 'Announcement' },
                          { value: 'academic', label: 'Academic' },
                          { value: 'administrative', label: 'Administrative' },
                          { value: 'event', label: 'Event' },
                          { value: 'emergency', label: 'Emergency' },
                          { value: 'maintenance', label: 'Maintenance' },
                          { value: 'other', label: 'Other' }
                        ]}
                        onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                        onBlur={field.onBlur}
                        value={
                          field.value
                            ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                            : null
                        }
                        placeholder="Select type"
                        styles={selectStyles}
                        className="w-full"
                      />
                    )}
                  />
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <Select<SelectOption>
                        options={[
                          { value: 'undergraduate', label: 'Undergraduate' },
                          { value: 'graduate', label: 'Graduate' },
                          { value: 'faculty', label: 'Faculty' },
                          { value: 'staff', label: 'Staff' },
                          { value: 'all', label: 'All' }
                        ]}
                        onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                        onBlur={field.onBlur}
                        value={
                          field.value
                            ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                            : null
                        }
                        placeholder="Select category"
                        styles={selectStyles}
                        className="w-full"
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: 'Priority is required' }}
                    render={({ field }) => (
                      <Select<SelectOption>
                        options={[
                          { value: 'high', label: 'High' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'low', label: 'Low' }
                        ]}
                        onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                        onBlur={field.onBlur}
                        value={
                          field.value
                            ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                            : null
                        }
                        placeholder="Select priority"
                        styles={selectStyles}
                        className="w-full"
                      />
                    )}
                  />
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Content</h3>
              </div>
              
              <Controller
                name="content"
                control={control}
                rules={{ 
                  required: 'Content is required',
                  minLength: { value: 10, message: 'Content must be at least 10 characters' }
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                      errors.content ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter notice content"
                  />
                )}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Date Settings Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Date Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date *
                  </label>
                  <Controller
                    name="publishDate"
                    control={control}
                    rules={{ required: 'Publish date is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.publishDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.publishDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.publishDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <Controller
                    name="expiryDate"
                    control={control}
                    rules={{ 
                      required: 'Expiry date is required',
                      validate: (value) => {
                        if (!value) return 'Expiry date is required';
                        const publish = watchedPublishDate ? new Date(watchedPublishDate) : null;
                        const expiry = new Date(value);
                        if (publish && expiry <= publish) {
                          return 'Expiry date must be after publish date';
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        min={watchedPublishDate}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.expiryDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <Controller
                  name="pinned"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Pin to Top</span>
                    </label>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Create Notice'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNoticeModal; 