import React, { useState, useEffect } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useUpdateNotice } from '../../../api/hooks/useNotices';
import { Notice } from '../../../api/types/notices';

interface EditNoticeModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const initialValidationErrors = {
  title: '',
  content: '',
  type: '',
  category: '',
  priority: '',
  publishDate: '',
  author: '',
  expiryDate: '',
};

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

const EditNoticeModal: React.FC<EditNoticeModalProps> = ({ isOpen, notice, onClose, onSuccess }) => {
  const [form, setForm] = useState<Partial<Notice>>({});
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>(initialValidationErrors);
  const [serverError, setServerError] = useState<string | null>(null);
  const updateNotice = useUpdateNotice();

  useEffect(() => {
    if (notice) {
      setForm({
        ...notice,
        pinned: notice.settings?.pinToTop || false,
      });
      setValidationErrors(initialValidationErrors);
    }
  }, [notice, isOpen]);

  const validateField = (name: string, value: any) => {
    let message = '';
    switch (name) {
      case 'title':
        if (!value) message = 'Title is required.';
        else if (value.length > 200) message = 'Title cannot exceed 200 characters.';
        break;
      case 'content':
        if (!value) message = 'Content is required.';
        else if (value.length < 10) message = 'Content must be at least 10 characters.';
        break;
      case 'type':
        if (!value) message = 'Type is required.';
        break;
      case 'category':
        if (!value) message = 'Category is required.';
        break;
      case 'priority':
        if (!value) message = 'Priority is required.';
        break;
      case 'publishDate':
        if (!value) message = 'Publish date is required.';
        break;
      case 'author':
        if (!value) message = 'Author is required.';
        break;
      case 'expiryDate':
        if (!value) {
          message = 'Expiry date is required.';
        } else {
          const publish = form.publishDate ? new Date(form.publishDate as string) : null;
          const expiry = new Date(value);
          if (publish && expiry <= publish) {
            message = 'Expiry date must be after publish date.';
          }
        }
        break;
      default:
        break;
    }
    setValidationErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const validateForm = () => {
    let valid = true;
    Object.entries(form).forEach(([key, value]) => {
      validateField(key, value);
      if (
        (key === 'title' && (!value || value.length > 200)) ||
        (key === 'content' && (!value || value.length < 10)) ||
        (key === 'type' && !value) ||
        (key === 'category' && !value) ||
        (key === 'priority' && !value) ||
        (key === 'publishDate' && !value) ||
        (key === 'author' && !value) ||
        (key === 'expiryDate' && validationErrors.expiryDate)
      ) {
        valid = false;
      }
    });
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerError(null);
    if (!validateForm() || !notice) {
      setError('Please fix the errors above.');
      return;
    }
    const payload = {
      ...form,
      settings: { pinToTop: form.pinned },
      author: typeof notice.author === 'object' && notice.author !== null ? notice.author : form.author
    };
    delete payload.pinned;
    try {
      const noticeId = notice.id ?? notice._id;
      if (!noticeId) {
        setError('Notice ID is missing.');
        return;
      }
      await updateNotice.mutateAsync({ id: noticeId, data: payload });
      setValidationErrors(initialValidationErrors);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update notice');
    }
  };

  if (!isOpen || !notice) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Notice</h2>
              <p className="text-sm text-gray-500">Update notice information and settings</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={typeof form.title === 'string' ? form.title : ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  {validationErrors.title && <div className="text-red-600 text-xs mt-1">{validationErrors.title}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="content"
                    value={typeof form.content === 'string' ? form.content : ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    required
                  />
                  {validationErrors.content && <div className="text-red-600 text-xs mt-1">{validationErrors.content}</div>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <Select<SelectOption>
                      options={[
                        { value: 'announcement', label: 'Announcement' },
                        { value: 'academic', label: 'Academic' },
                        { value: 'administrative', label: 'Administrative' },
                        { value: 'event', label: 'Event' },
                        { value: 'emergency', label: 'Emergency' },
                        { value: 'maintenance', label: 'Maintenance' },
                        { value: 'other', label: 'Other' },
                      ]}
                      onChange={(selectedOption: SelectOption | null) => {
                        const newValue = selectedOption?.value || '';
                        setForm((prev) => ({ ...prev, type: newValue }));
                        validateField('type', newValue);
                      }}
                      value={
                        form.type
                          ? { value: form.type, label: form.type.charAt(0).toUpperCase() + form.type.slice(1) }
                          : null
                      }
                      placeholder="Select type"
                      styles={selectStyles}
                      className="w-full"
                    />
                    {validationErrors.type && <div className="text-red-600 text-xs mt-1">{validationErrors.type}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <Select<SelectOption>
                      options={[
                        { value: 'all', label: 'All' },
                        { value: 'undergraduate', label: 'Undergraduate' },
                        { value: 'graduate', label: 'Graduate' },
                        { value: 'faculty', label: 'Faculty' },
                        { value: 'staff', label: 'Staff' },
                      ]}
                      onChange={(selectedOption: SelectOption | null) => {
                        const newValue = selectedOption?.value || '';
                        setForm((prev) => ({ ...prev, category: newValue }));
                        validateField('category', newValue);
                      }}
                      value={
                        form.category
                          ? { value: form.category, label: form.category.charAt(0).toUpperCase() + form.category.slice(1) }
                          : null
                      }
                      placeholder="Select category"
                      styles={selectStyles}
                      className="w-full"
                    />
                    {validationErrors.category && <div className="text-red-600 text-xs mt-1">{validationErrors.category}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date & Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Publish Date *</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={form.publishDate?.toString().slice(0, 10) || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  {validationErrors.publishDate && <div className="text-red-600 text-xs mt-1">{validationErrors.publishDate}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate?.toString().slice(0, 10) || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  {validationErrors.expiryDate && <div className="text-red-600 text-xs mt-1">{validationErrors.expiryDate}</div>}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                  <Select<SelectOption>
                    options={[
                      { value: 'high', label: 'High' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'low', label: 'Low' },
                    ]}
                    onChange={(selectedOption: SelectOption | null) => {
                      const newValue = selectedOption?.value || '';
                      setForm((prev) => ({ ...prev, priority: newValue }));
                      validateField('priority', newValue);
                    }}
                    value={
                      form.priority
                        ? { value: form.priority, label: form.priority.charAt(0).toUpperCase() + form.priority.slice(1) }
                        : null
                    }
                    placeholder="Select priority"
                    styles={selectStyles}
                    className="w-full"
                  />
                  {validationErrors.priority && <div className="text-red-600 text-xs mt-1">{validationErrors.priority}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={typeof form.author === 'object' && form.author !== null ? form.author.name : form.author || ''}
                    readOnly
                    className="my-2 block w-full border border-gray-300 rounded-md px-3 py-2.5 bg-gray-100"
                    required
                  />
                  {validationErrors.author && <div className="text-red-600 text-xs mt-1">{validationErrors.author}</div>}
                </div>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="pinned"
                  checked={!!form.pinned}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Pin to top</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  disabled={Object.values(validationErrors).some((msg) => msg) || updateNotice.status === 'pending'}
                >
                  {updateNotice.status === 'pending' ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    'Update Notice'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeModal; 