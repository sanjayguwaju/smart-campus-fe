import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { useCreateEnrollment } from '../../../api/hooks/useEnrollments';
import { CreateEnrollmentRequest } from '../../../api/types/enrollments';

interface AddEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const AddEnrollmentModal: React.FC<AddEnrollmentModalProps> = ({ isOpen, onClose }) => {
  const createEnrollmentMutation = useCreateEnrollment();
  
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
  } = useForm<CreateEnrollmentRequest>({
    defaultValues: {
      student: '',
      program: '',
      semester: 1,
      semesterTerm: 'Fall',
      academicYear: '2024-2025',
      courses: [],
      status: 'active',
      enrollmentType: 'full_time',
      advisor: '',
      notes: ''
    }
  });

  const watchedEnrollmentType = watch('enrollmentType');

  const onSubmit = async (data: CreateEnrollmentRequest) => {
    try {
      await createEnrollmentMutation.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create enrollment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Enrollment</h2>
              <p className="text-sm text-gray-600">Create a new student enrollment with all necessary details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student *
              </label>
              <Controller
                name="student"
                control={control}
                rules={{ required: 'Student is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select a student..."
                    options={[
                      { value: 'student1', label: 'John Doe (john@example.com)' },
                      { value: 'student2', label: 'Jane Smith (jane@example.com)' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.student && (
                <p className="mt-1 text-sm text-red-600">{errors.student.message}</p>
              )}
            </div>

            {/* Program Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program *
              </label>
              <Controller
                name="program"
                control={control}
                rules={{ required: 'Program is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select a program..."
                    options={[
                      { value: 'program1', label: 'Bachelor of Computer Science' },
                      { value: 'program2', label: 'Bachelor of Engineering' },
                      { value: 'program3', label: 'Master of Business Administration' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.program && (
                <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>
              )}
            </div>

            {/* Semester and Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <Controller
                name="semester"
                control={control}
                rules={{ required: 'Semester is required', min: { value: 1, message: 'Semester must be at least 1' } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter semester number"
                  />
                )}
              />
              {errors.semester && (
                <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester Term *
              </label>
              <Controller
                name="semesterTerm"
                control={control}
                rules={{ required: 'Semester term is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select semester term..."
                    options={[
                      { value: 'Fall', label: 'Fall' },
                      { value: 'Spring', label: 'Spring' },
                      { value: 'Summer', label: 'Summer' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.semesterTerm && (
                <p className="mt-1 text-sm text-red-600">{errors.semesterTerm.message}</p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <Controller
                name="academicYear"
                control={control}
                rules={{ required: 'Academic year is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2024-2025"
                  />
                )}
              />
              {errors.academicYear && (
                <p className="mt-1 text-sm text-red-600">{errors.academicYear.message}</p>
              )}
            </div>

            {/* Enrollment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Type *
              </label>
              <Controller
                name="enrollmentType"
                control={control}
                rules={{ required: 'Enrollment type is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select enrollment type..."
                    options={[
                      { value: 'full_time', label: 'Full Time' },
                      { value: 'part_time', label: 'Part Time' },
                      { value: 'distance_learning', label: 'Distance Learning' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.enrollmentType && (
                <p className="mt-1 text-sm text-red-600">{errors.enrollmentType.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select status..."
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'suspended', label: 'Suspended' },
                      { value: 'completed', label: 'Completed' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {/* Advisor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advisor *
              </label>
              <Controller
                name="advisor"
                control={control}
                rules={{ required: 'Advisor is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select an advisor..."
                    options={[
                      { value: 'advisor1', label: 'Dr. Smith (smith@example.com)' },
                      { value: 'advisor2', label: 'Dr. Johnson (johnson@example.com)' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.advisor && (
                <p className="mt-1 text-sm text-red-600">{errors.advisor.message}</p>
              )}
            </div>

            {/* Courses Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courses
              </label>
              <Controller
                name="courses"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select courses..."
                    options={[
                      { value: 'course1', label: 'CS101 - Introduction to Computer Science (3 credits)' },
                      { value: 'course2', label: 'MATH101 - Calculus I (4 credits)' },
                      { value: 'course3', label: 'ENG101 - English Composition (3 credits)' }
                    ]}
                    styles={selectStyles}
                    isMulti
                    isClearable
                  />
                )}
              />
              {errors.courses && (
                <p className="mt-1 text-sm text-red-600">{errors.courses.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter any additional notes..."
                  />
                )}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || createEnrollmentMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createEnrollmentMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Enrollment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEnrollmentModal; 