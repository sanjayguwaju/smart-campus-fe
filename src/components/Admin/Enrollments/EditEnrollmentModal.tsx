import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useUpdateEnrollment } from '../../../api/hooks/useEnrollments';
import { UpdateEnrollmentRequest, EnrollmentData } from '../../../api/types/enrollments';
import { userService } from '../../../api/services/userService';
import { programService } from '../../../api/services/programService';
import { courseService } from '../../../api/services/courseService';

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

  // State to track selected options for display
  const [selectedStudent, setSelectedStudent] = React.useState<SelectOption | null>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<SelectOption | null>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<SelectOption[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = React.useState<SelectOption | null>(null);

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

  // Load options functions for AsyncSelect
  const loadStudentOptions = async (inputValue: string) => {
    try {
      const response = await userService.getUsers(1, 100, inputValue, { role: 'student' });
      const options = (response?.data?.map((u: { _id: string; fullName: string; email: string }) => ({
        value: u._id,
        label: `${u.fullName} (${u.email})`
      })) || [])
        .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading students:', error);
      return [];
    }
  };

  const loadProgramOptions = async (inputValue: string) => {
    try {
      const response = await programService.getPrograms({ page: 1, limit: 100, search: inputValue });
      const options = response?.data?.map((p: { _id: string; name: string }) => ({
        value: p._id,
        label: p.name
      })) || [];
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading programs:', error);
      return [];
    }
  };

  const loadCourseOptions = async (inputValue: string) => {
    try {
      const response = await courseService.getCourses(1, 100, inputValue);
      const options = response?.data?.map((c: { _id: string; name: string; code: string; credits: number }) => ({
        value: c._id,
        label: `${c.code} - ${c.name} (${c.credits} credits)`
      })) || [];
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  };

  const loadAdvisorOptions = async (inputValue: string) => {
    try {
      const response = await userService.getUsers(1, 100, inputValue, { role: 'faculty' });
      const options = (response?.data?.map((u: { _id: string; fullName: string; email: string }) => ({
        value: u._id,
        label: `${u.fullName} (${u.email})`
      })) || [])
        .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading advisors:', error);
      return [];
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UpdateEnrollmentRequest>({
    defaultValues: {
      semester: 1,
      academicYear: '2024-2025',
      courses: [],
      status: 'active',
      enrollmentType: 'full_time',
      notes: ''
    }
  });

  const watchedEnrollmentType = watch('enrollmentType');

  // Reset form when enrollment data changes
  useEffect(() => {
    if (enrollment) {
      // Set selected options for display
      setSelectedStudent({
        value: enrollment.student?._id,
        label: `${enrollment.student?.fullName} (${enrollment.student?.email})`
      });
      setSelectedProgram({
        value: enrollment.program?._id,
        label: enrollment.program?.name
      });
      setSelectedCourses(enrollment.courses?.map(course => ({
        value: course._id,
        label: `${course.code} - ${course.name} (${course.creditHours} credits)`
      })) || []);
      setSelectedAdvisor({
        value: enrollment.advisor?._id,
        label: `${enrollment.advisor?.fullName} (${enrollment.advisor?.email})`
      });

      reset({
        student: enrollment.student?._id,
        program: enrollment.program?._id,
        semester: enrollment.semester,
        academicYear: enrollment.academicYear,
        courses: enrollment.courses?.map(course => course._id) || [],
        status: enrollment.status,
        enrollmentType: enrollment.enrollmentType,
        advisor: enrollment.advisor?._id,
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
        enrollmentData: updateData
      });
      onClose();
    } catch (error) {
      console.error('Failed to update enrollment:', error);
    }
  };

  if (!isOpen || !enrollment) return null;

  // Safety check for required enrollment properties
  if (!enrollment.student || !enrollment.program) {
    console.error('Enrollment data is missing required properties:', enrollment);
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        style={{ margin: 0, padding: '1rem' }}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Enrollment Data</h2>
            <p className="text-gray-600 mb-4">The enrollment data is missing required information.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Enrollment</h2>
              <p className="text-sm text-gray-600">Update enrollment details for {enrollment.student?.fullName}</p>
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
            {/* Student Selection - Read Only */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student (Read Only)
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {selectedStudent?.label || 'No student selected'}
              </div>
              <p className="mt-1 text-xs text-gray-500">Student cannot be changed after enrollment is created</p>
            </div>

            {/* Program Selection - Read Only */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program (Read Only)
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {selectedProgram?.label || 'No program selected'}
              </div>
              <p className="mt-1 text-xs text-gray-500">Program cannot be changed after enrollment is created</p>
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
                    value={field.value ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1).replace('_', ' ') } : null}
                    onChange={(option: any) => {
                      field.onChange(option?.value || '');
                    }}
                    onBlur={field.onBlur}
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
                    value={field.value ? { value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1).replace('_', ' ') } : null}
                    onChange={(option: any) => {
                      field.onChange(option?.value || '');
                    }}
                    onBlur={field.onBlur}
                    placeholder="Select status..."
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'dropped', label: 'Dropped' },
                      { value: 'suspended', label: 'Suspended' },
                      { value: 'graduated', label: 'Graduated' }
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





            {/* Courses Selection - Read Only */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courses (Read Only)
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[48px]">
                {selectedCourses.length > 0 ? (
                  <div className="space-y-1">
                    {selectedCourses.map((course, index) => (
                      <div key={index} className="text-sm">
                        {course.label}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No courses selected</span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Course changes require separate course registration process</p>
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
        </form>
      </div>
    </div>
  );
};

export default EditEnrollmentModal;
