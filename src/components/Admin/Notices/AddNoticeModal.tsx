import React, { useState } from 'react';
import { useCreateNotice } from '../../../api/hooks/useNotices';
import { Notice } from '../../../api/types/notices';
import Select, { StylesConfig } from 'react-select';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const initialForm: Partial<Notice> = {
  title: '',
  content: '',
  type: 'announcement',
  category: 'all',
  priority: 'medium',
  publishDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  author: '',
  pinned: false,
};

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

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<Partial<Notice>>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>(initialValidationErrors);
  const createNotice = useCreateNotice();

  // Select options
  const typeOptions: SelectOption[] = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'academic', label: 'Academic' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'event', label: 'Event' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const categoryOptions: SelectOption[] = [
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'staff', label: 'Staff' },
    { value: 'all', label: 'All' }
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  // Custom styles for React Select
  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      },
      '&:focus-within': {
        border: '2px solid #3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
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
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    })
  };

  const validateField = (name: string, value: unknown) => {
    let message = '';
    switch (name) {
      case 'title':
        if (!value || typeof value !== 'string') message = 'Title is required.';
        else if (value.length > 200) message = 'Title cannot exceed 200 characters.';
        break;
      case 'content':
        if (!value || typeof value !== 'string') message = 'Content is required.';
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
        if (!value || typeof value !== 'string') {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const handleSelectChange = (name: string, option: SelectOption | null) => {
    const value = option?.value || '';
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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
    if (!validateForm()) {
      setError('Please fix the errors above.');
      return;
    }
    const payload = {
      ...form,
      settings: { pinToTop: form.pinned }
    };
    delete payload.pinned;
    try {
      await createNotice.mutateAsync(payload);
      setForm(initialForm);
      setValidationErrors(initialValidationErrors);
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      setError('Failed to create notice');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Post New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Content *</label>
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
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <Select
                options={typeOptions}
                value={typeOptions.find(option => option.value === form.type)}
                onChange={(option) => handleSelectChange('type', option)}
                styles={selectStyles}
                placeholder="Select type"
                isClearable
                required
              />
              {validationErrors.type && <div className="text-red-600 text-xs mt-1">{validationErrors.type}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <Select
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === form.category)}
                onChange={(option) => handleSelectChange('category', option)}
                styles={selectStyles}
                placeholder="Select category"
                isClearable
                required
              />
              {validationErrors.category && <div className="text-red-600 text-xs mt-1">{validationErrors.category}</div>}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Priority *</label>
              <Select
                options={priorityOptions}
                value={priorityOptions.find(option => option.value === form.priority)}
                onChange={(option) => handleSelectChange('priority', option)}
                styles={selectStyles}
                placeholder="Select priority"
                isClearable
                required
              />
              {validationErrors.priority && <div className="text-red-600 text-xs mt-1">{validationErrors.priority}</div>}
            </div>
            <div className="flex-1">
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
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Author *</label>
              <input
                type="text"
                name="author"
                value={typeof form.author === 'string' ? form.author : ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              {validationErrors.author && <div className="text-red-600 text-xs mt-1">{validationErrors.author}</div>}
            </div>
          </div>
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              disabled={Object.values(validationErrors).some((msg) => msg) || createNotice.status === 'pending'}
            >
              {createNotice.status === 'pending' ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticeModal; 