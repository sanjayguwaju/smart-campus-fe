import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { useUpdateEvent } from '../../../api/hooks/useEvents';
import { Event, CreateEventRequest } from '../../../api/types/events';
import MultipleImageUpload from '../../common/MultipleImageUpload';
import { isoToDateInput, dateInputToIso } from '../../../utils/dateUtils';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

interface SelectOption {
  value: string;
  label: string;
}

interface ImageItem {
  _id?: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

interface FormData {
  title: string;
  description: string;
  shortDescription?: string;
  eventType: 'academic' | 'cultural' | 'sports' | 'technical' | 'social' | 'workshop' | 'seminar' | 'conference' | 'other';
  category: 'student' | 'faculty' | 'admin' | 'public' | 'invitation-only';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: {
    venue: string;
    room?: string;
    building?: string;
    campus?: string;
  };
  maxAttendees?: number;
  registrationDeadline?: string;
  isRegistrationRequired: boolean;
  isRegistrationOpen: boolean;
  tags: string[];
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'postponed';
  visibility: 'public' | 'private' | 'restricted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featured: boolean;
  highlights: string[];
  requirements: string[];
  benefits: string[];
  externalLinks: Array<{
    title: string;
    url: string;
  }>;
  imageUrl: string;
  images: ImageItem[];
}

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, event }) => {
  const updateEventMutation = useUpdateEvent();
  
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
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
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
      imageUrl: '',
      images: []
    }
  });



  useEffect(() => {
    if (event) {
      // Process images to ensure proper structure
      let processedImages = event.images || [];
      
      // If there's an imageUrl but no images array, create one
      if (event.imageUrl && (!event.images || event.images.length === 0)) {
        processedImages = [{
          url: event.imageUrl,
          caption: '',
          isPrimary: true
        }];
      }
      
      // Ensure at least one image is marked as primary
      if (processedImages.length > 0 && !processedImages.some(img => img.isPrimary)) {
        processedImages[0].isPrimary = true;
      }
      
      reset({
        title: event.title,
        description: event.description,
        shortDescription: event.shortDescription,
        eventType: event.eventType,
        category: event.category,
        startDate: isoToDateInput(event.startDate),
        endDate: isoToDateInput(event.endDate),
        startTime: event.startTime,
        endTime: event.endTime,
        location: {
          venue: event.location.venue,
          room: event.location.room,
          building: event.location.building,
          campus: event.location.campus
        },
        maxAttendees: event.maxAttendees,
        registrationDeadline: event.registrationDeadline,
        isRegistrationRequired: event.isRegistrationRequired,
        isRegistrationOpen: event.isRegistrationOpen,
        tags: event.tags,
        contactInfo: {
          email: event.contactInfo?.email,
          phone: event.contactInfo?.phone,
          website: event.contactInfo?.website
        },
        status: event.status,
        visibility: event.visibility,
        priority: event.priority,
        featured: event.featured,
        highlights: event.highlights,
        requirements: event.requirements,
        benefits: event.benefits,
        externalLinks: event.externalLinks,
        imageUrl: event.imageUrl || '',
        images: processedImages
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: FormData) => {
    if (!event) return;
    
    try {
      // Set the primary image URL to imageUrl field for backward compatibility
      const primaryImage = data.images.find(img => img.isPrimary);
      const imageUrl = primaryImage ? primaryImage.url : '';
      
      const payload = { 
        ...data,
        imageUrl,
        startDate: dateInputToIso(data.startDate),
        endDate: dateInputToIso(data.endDate)
      };
      
      await updateEventMutation.mutateAsync({
        id: event._id,
        data: payload as Partial<CreateEventRequest>
      });
      onClose();
    } catch (error: unknown) {
      console.error('Error updating event:', error);
    }
  };

  if (!isOpen || !event) return null;

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
              <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
              <p className="text-sm text-gray-600">Update event details and settings</p>
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
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.title ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter event title"
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <Controller
                    name="eventType"
                    control={control}
                    rules={{ required: 'Event type is required' }}
                    render={({ field }) => (
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
                         onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                         onBlur={field.onBlur}
                         value={
                           field.value
                             ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                             : null
                         }
                         placeholder="Select event type"
                         styles={selectStyles}
                         className="w-full"
                       />
                    )}
                  />
                  {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
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
                           { value: 'public', label: 'Public' },
                           { value: 'student', label: 'Student' },
                           { value: 'faculty', label: 'Faculty' },
                           { value: 'admin', label: 'Admin' },
                           { value: 'invitation-only', label: 'Invitation Only' },
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
                    Status *
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Status is required' }}
                    render={({ field }) => (
                                             <Select<SelectOption>
                         options={[
                           { value: 'draft', label: 'Draft' },
                           { value: 'published', label: 'Published' },
                           { value: 'cancelled', label: 'Cancelled' },
                           { value: 'completed', label: 'Completed' },
                           { value: 'postponed', label: 'Postponed' },
                         ]}
                         onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                         onBlur={field.onBlur}
                         value={
                           field.value
                             ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                             : null
                         }
                         placeholder="Select status"
                         styles={selectStyles}
                         className="w-full"
                       />
                    )}
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Brief description for event cards"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                          errors.description ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Detailed description of the event"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Images Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Event Images</h3>
              </div>
              
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <MultipleImageUpload
                    onImagesChange={(images) => field.onChange(images)}
                    currentImages={field.value}
                    maxSize={5}
                    className="max-w-md"
                  />
                )}
              />
            </div>

            {/* Date and Time Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.startDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.endDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: 'Start time is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="time"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.startTime ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{ required: 'End time is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="time"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.endTime ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    )}
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <Controller
                    name="location.venue"
                    control={control}
                    rules={{ required: 'Venue is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          errors.location?.venue ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Event venue"
                      />
                    )}
                  />
                  {errors.location?.venue && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.venue.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <Controller
                    name="location.room"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Room number"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building
                  </label>
                  <Controller
                    name="location.building"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Building name"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus
                  </label>
                  <Controller
                    name="location.campus"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Campus name"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Registration Settings Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Registration Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees
                  </label>
                  <Controller
                    name="maxAttendees"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="No limit"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline
                  </label>
                  <Controller
                    name="registrationDeadline"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    )}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Controller
                    name="isRegistrationRequired"
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
                        <span className="ml-2 text-sm text-gray-700">Registration Required</span>
                      </label>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-6">
                <Controller
                  name="isRegistrationOpen"
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
                      <span className="ml-2 text-sm text-gray-700">Registration Open</span>
                    </label>
                  )}
                />

                <Controller
                  name="featured"
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
                      <span className="ml-2 text-sm text-gray-700">Featured Event</span>
                    </label>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <Controller
                    name="contactInfo.email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="contact@example.com"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <Controller
                    name="contactInfo.phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Controller
                    name="contactInfo.website"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="https://example.com"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Additional Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <Controller
                    name="visibility"
                    control={control}
                    render={({ field }) => (
                                             <Select<SelectOption>
                         options={[
                           { value: 'public', label: 'Public' },
                           { value: 'private', label: 'Private' },
                           { value: 'restricted', label: 'Restricted' },
                         ]}
                         onChange={(selectedOption: SelectOption | null) => field.onChange(selectedOption?.value)}
                         onBlur={field.onBlur}
                         value={
                           field.value
                             ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }
                             : null
                         }
                         placeholder="Select visibility"
                         styles={selectStyles}
                         className="w-full"
                       />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                                             <Select<SelectOption>
                         options={[
                           { value: 'low', label: 'Low' },
                           { value: 'medium', label: 'Medium' },
                           { value: 'high', label: 'High' },
                           { value: 'urgent', label: 'Urgent' },
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
                </div>
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
                    Updating...
                  </div>
                ) : (
                  'Update Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal; 