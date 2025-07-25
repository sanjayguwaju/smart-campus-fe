import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useUpdateEnrollment } from '../../../api/hooks/useEnrollments';
import { UpdateEnrollmentRequest, EnrollmentData } from '../../../api/types/enrollments';

interface EditEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: EnrollmentData | null;
}

interface SelectOption {
  value: string;
  label: string;
}

const EditEnrollmentModal: React.FC<EditEnrollmentModalProps> = ({ isOpen, onClose, enrollment }) => {
  const updateEnrollmentMutation = useUpdateEnrollment();
  
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
  } = useForm<UpdateEnrollmentRequest>({
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
      notes: '',
      gpa: 0,
      cgpa: 0,
      academicStanding: 'good_standing',
      financialStatus: 'unpaid'
    }
  });

  const watchedEnrollmentType = watch('enrollmentType');

  // Reset form when enrollment data changes
  useEffect(() => {
    if (enrollment) {
      reset({
        student: enrollment.student._id,
        program: enrollment.program._id,
        semester: enrollment.semester,
        semesterTerm: enrollment.semesterTerm,
        academicYear: enrollment.academicYear,
        courses: enrollment.courses.map(course => course._id),
        status: enrollment.status,
        enrollmentType: enrollment.enrollmentType,
        advisor: enrollment.advisor._id,
        notes: enrollment.notes,
        gpa: enrollment.gpa,
        cgpa: enrollment.cgpa,
        academicStanding: enrollment.academicStanding,
        financialStatus: enrollment.financialStatus
      });
    }
  }, [enrollment, reset]);

  const onSubmit = async (data: UpdateEnrollmentRequest) => {
    if (!enrollment) return;
    
    try {
      await updateEnrollmentMutation.mutateAsync({
        id: enrollment._id,
        enrollmentData: data
      });
      onClose();
    } catch (error) {
      console.error('Failed to update enrollment:', error);
    }
  };

  if (!isOpen || !enrollment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Enrollment</h2>
              <p className="text-sm text-gray-600">Update enrollment details for {enrollment.student.fullName}</p>
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
                      { value: enrollment.student._id, label: `${enrollment.student.fullName} (${enrollment.student.email})` },
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
                      { value: enrollment.program._id, label: enrollment.program.name },
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
                      { value: enrollment.advisor._id, label: `${enrollment.advisor.fullName} (${enrollment.advisor.email})` },
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

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA
              </label>
              <Controller
                name="gpa"
                control={control}
                rules={{ min: { value: 0, message: 'GPA must be at least 0' }, max: { value: 4, message: 'GPA cannot exceed 4' } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter GPA"
                  />
                )}
              />
              {errors.gpa && (
                <p className="mt-1 text-sm text-red-600">{errors.gpa.message}</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA
              </label>
              <Controller
                name="cgpa"
                control={control}
                rules={{ min: { value: 0, message: 'CGPA must be at least 0' }, max: { value: 4, message: 'CGPA cannot exceed 4' } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter CGPA"
                  />
                )}
              />
              {errors.cgpa && (
                <p className="mt-1 text-sm text-red-600">{errors.cgpa.message}</p>
              )}
            </div>

            {/* Academic Standing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Standing
              </label>
              <Controller
                name="academicStanding"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select academic standing..."
                    options={[
                      { value: 'good_standing', label: 'Good Standing' },
                      { value: 'academic_warning', label: 'Academic Warning' },
                      { value: 'academic_probation', label: 'Academic Probation' },
                      { value: 'academic_suspension', label: 'Academic Suspension' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.academicStanding && (
                <p className="mt-1 text-sm text-red-600">{errors.academicStanding.message}</p>
              )}
            </div>

            {/* Financial Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Status
              </label>
              <Controller
                name="financialStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select financial status..."
                    options={[
                      { value: 'paid', label: 'Paid' },
                      { value: 'unpaid', label: 'Unpaid' },
                      { value: 'partial', label: 'Partial Payment' },
                      { value: 'scholarship', label: 'Scholarship' }
                    ]}
                    styles={selectStyles}
                    isClearable
                  />
                )}
              />
              {errors.financialStatus && (
                <p className="mt-1 text-sm text-red-600">{errors.financialStatus.message}</p>
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
                render={({ field }) => {
                  // Mock data for courses - in real app, this would come from API
                  const mockCourses = enrollment?.courses?.map(course => ({
                    value: course._id,
                    label: `${course.code} - ${course.name} (${course.creditHours} credits)`
                  })) || [];

                  const loadCourseOptions = (inputValue: string) => {
                    return new Promise<SelectOption[]>((resolve) => {
                      setTimeout(() => {
                        const filtered = mockCourses.filter(course =>
                          course.label.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        resolve(filtered);
                      }, 300);
                    });
                  };

                  return (
                    <AsyncSelect
                      value={field.value?.map(courseId => 
                        mockCourses.find(course => course.value === courseId)
                      ).filter(Boolean) || []}
                      onChange={(selectedOptions: any) => {
                        const selectedValues = selectedOptions?.map((option: any) => option.value) || [];
                        field.onChange(selectedValues);
                      }}
                      loadOptions={loadCourseOptions}
                      placeholder="Search and select courses..."
                      styles={selectStyles}
                      isMulti
                      isClearable
                      noOptionsMessage={() => "No courses found"}
                      loadingMessage={() => "Loading courses..."}
                      cacheOptions
                      defaultOptions
                    />
                  );
                }}
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
            disabled={isSubmitting || updateEnrollmentMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || updateEnrollmentMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              'Update Enrollment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEnrollmentModal; 