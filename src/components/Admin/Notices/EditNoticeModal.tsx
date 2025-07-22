import React, { useState, useEffect } from 'react';
import { useUpdateNotice } from '../../../api/hooks/useNotices';
import { Notice } from '../../../api/types/notices';

interface EditNoticeModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
  onSuccess?: () => void;
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="announcement">Announcement</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                  <option value="event">Event</option>
                  <option value="emergency">Emergency</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.type && <div className="text-red-600 text-xs mt-1">{validationErrors.type}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="all">All</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
                {validationErrors.category && <div className="text-red-600 text-xs mt-1">{validationErrors.category}</div>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority *</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {validationErrors.priority && <div className="text-red-600 text-xs mt-1">{validationErrors.priority}</div>}
              </div>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={typeof form.author === 'object' && form.author !== null ? form.author.name : form.author || ''}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
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
            {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={Object.values(validationErrors).some((msg) => msg) || updateNotice.status === 'pending'}
              >
                {updateNotice.status === 'pending' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeModal; 