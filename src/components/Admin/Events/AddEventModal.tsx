import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useCreateEvent } from '../../../api/hooks/useEvents';
import { CreateEventRequest } from '../../../api/types/events';
import { useAuthStore } from '../../../store/authStore';
import ImageUpload from '../../common/ImageUpload';
import { dateInputToIso } from '../../../utils/dateUtils';

interface SelectOption {
  value: string;
  label: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
  const createEventMutation = useCreateEvent();
  const currentUser = useAuthStore((state) => state.user);
  
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
  const [formData, setFormData] = useState<Partial<CreateEventRequest>>({
    title: '',
    description: '',
    shortDescription: '',
    eventType: 'academic',
    category: 'public',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: {
      venue: '',
      room: '',
      building: '',
      campus: ''
    },
    maxAttendees: undefined,
    registrationDeadline: '',
    isRegistrationRequired: false,
    isRegistrationOpen: true,
    tags: [],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    status: 'draft',
    visibility: 'public',
    priority: 'medium',
    featured: false,
    highlights: [],
    requirements: [],
    benefits: [],
    externalLinks: [],
    imageUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('contactInfo.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value ? parseInt(value) : undefined) : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: dateInputToIso(formData.startDate || ''),
        endDate: dateInputToIso(formData.endDate || ''),
        organizer: currentUser?._id,
      };
      await createEventMutation.mutateAsync(payload as CreateEventRequest);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        eventType: 'academic',
        category: 'public',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        location: {
          venue: '',
          room: '',
          building: '',
          campus: ''
        },
        maxAttendees: undefined,
        registrationDeadline: '',
        isRegistrationRequired: false,
        isRegistrationOpen: true,
        tags: [],
        contactInfo: {
          email: '',
          phone: '',
          website: ''
        },
        status: 'draft',
        visibility: 'public',
        priority: 'medium',
        featured: false,
        highlights: [],
        requirements: [],
        benefits: [],
        externalLinks: [],
        imageUrl: ''
      });
    } catch (error) {
      // Error is handled by the mutation
      console.error('Error creating event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <Select<SelectOption>
                options={[
                  { value: 'academic', label: 'Academic' },
                  { value: 'cultural', label: 'Cultural' },
                  { value: 'sports', label: 'Sports' },
                  { value: 'technical', label: 'Technical' },
                  { value: 'social', label: 'Social' },
                  { value: 'workshop', label: 'Workshop' },
                  { value: 'seminar', label: 'Seminar' },
                  { value: 'conference', label: 'Conference' },
                  { value: 'other', label: 'Other' },
                ]}
                onChange={(selectedOption: SelectOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    eventType: selectedOption?.value as 'academic' | 'cultural' | 'sports' | 'technical' | 'social' | 'workshop' | 'seminar' | 'conference' | 'other'
                  }));
                }}
                value={
                  formData.eventType
                    ? { value: formData.eventType, label: formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1) }
                    : null
                }
                placeholder="Select event type"
                styles={selectStyles}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select<SelectOption>
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'student', label: 'Student' },
                  { value: 'faculty', label: 'Faculty' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'invitation-only', label: 'Invitation Only' },
                ]}
                onChange={(selectedOption: SelectOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    category: selectedOption?.value as 'student' | 'faculty' | 'admin' | 'public' | 'invitation-only'
                  }));
                }}
                value={
                  formData.category
                    ? { value: formData.category, label: formData.category.charAt(0).toUpperCase() + formData.category.slice(1) }
                    : null
                }
                placeholder="Select category"
                styles={selectStyles}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <Select<SelectOption>
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'postponed', label: 'Postponed' },
                ]}
                onChange={(selectedOption: SelectOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    status: selectedOption?.value as 'draft' | 'published' | 'cancelled' | 'completed' | 'postponed'
                  }));
                }}
                value={
                  formData.status
                    ? { value: formData.status, label: formData.status.charAt(0).toUpperCase() + formData.status.slice(1) }
                    : null
                }
                placeholder="Select status"
                styles={selectStyles}
                className="w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <ImageUpload
              onImageUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              onImageRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
              currentImage={formData.imageUrl}
              maxSize={5}
              className="max-w-md"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="location.venue"
                value={formData.location?.venue}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room
              </label>
              <input
                type="text"
                name="location.room"
                value={formData.location?.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building
              </label>
              <input
                type="text"
                name="location.building"
                value={formData.location?.building}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campus
              </label>
              <input
                type="text"
                name="location.campus"
                value={formData.location?.campus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Registration Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees || ''}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isRegistrationRequired"
                  checked={formData.isRegistrationRequired}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Registration Required</span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isRegistrationOpen"
                checked={formData.isRegistrationOpen}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Registration Open</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured Event</span>
            </label>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo?.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo?.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="contactInfo.website"
                value={formData.contactInfo?.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <Select<SelectOption>
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                  { value: 'restricted', label: 'Restricted' },
                ]}
                onChange={(selectedOption: SelectOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    visibility: selectedOption?.value as 'public' | 'private' | 'restricted'
                  }));
                }}
                value={
                  formData.visibility
                    ? { value: formData.visibility, label: formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1) }
                    : null
                }
                placeholder="Select visibility"
                styles={selectStyles}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select<SelectOption>
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                onChange={(selectedOption: SelectOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    priority: selectedOption?.value as 'low' | 'medium' | 'high' | 'urgent'
                  }));
                }}
                value={
                  formData.priority
                    ? { value: formData.priority, label: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1) }
                    : null
                }
                placeholder="Select priority"
                styles={selectStyles}
                className="w-full"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEventMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal; 