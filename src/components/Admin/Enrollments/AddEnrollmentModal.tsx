import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useCreateEnrollment } from '../../../api/hooks/useEnrollments';
import { CreateEnrollmentRequest } from '../../../api/types/enrollments';
import { userService } from '../../../api/services/userService';
import { programService } from '../../../api/services/programService';
import { departmentService } from '../../../api/services/departmentService';
import { courseService } from '../../../api/services/courseService';

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
  
  // State to track selected options for display
  const [selectedStudent, setSelectedStudent] = React.useState<SelectOption | null>(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState<SelectOption | null>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<SelectOption | null>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<SelectOption[]>([]);
  const [programOptionsKey, setProgramOptionsKey] = React.useState<number>(0);
  const [courseOptionsKey, setCourseOptionsKey] = React.useState<number>(0);

  // Trigger program options reload when department changes
  useEffect(() => {
    if (selectedDepartment) {
      setProgramOptionsKey(prev => prev + 1);
      // Clear selected program when department changes
      if (selectedProgram) {
        setSelectedProgram(null);
        setValue('program', '');
      }
    }
  }, [selectedDepartment]);

  // Trigger course options reload when program changes
  useEffect(() => {
    if (selectedProgram) {
      setCourseOptionsKey(prev => prev + 1);
      // Clear selected courses when program changes
      if (selectedCourses.length > 0) {
        setSelectedCourses([]);
        setValue('courses', []);
      }
    }
  }, [selectedProgram]);
  
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
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    defaultValues: {
      student: '',
      department: '',
      program: '',
      semester: 1,
      academicYear: '2024-2025',
      courses: [],
      status: 'active',
      enrollmentType: 'full_time',
      notes: ''
    }
  });

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

  const loadDepartmentOptions = async (inputValue: string) => {
    try {
      console.log('AddEnrollmentModal: Loading departments with inputValue:', inputValue);
      const response = await departmentService.getDepartments(1, 100, inputValue);
      console.log('AddEnrollmentModal: Department response:', response);
      const options = response?.data?.map((d: { _id: string; name: string }) => ({ 
        value: d._id, 
        label: d.name 
      })) || [];
      console.log('AddEnrollmentModal: Department options:', options);
      const filteredOptions = options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      console.log('AddEnrollmentModal: Filtered options:', filteredOptions);
      return filteredOptions;
    } catch (error) {
      console.error('AddEnrollmentModal: Error loading departments:', error);
      return [];
    }
  };

  const loadProgramOptions = async (inputValue: string) => {
    try {
      // Only load programs if a department is selected
      if (!selectedDepartment?.value) {
        return [];
      }
      
      const response = await programService.getPrograms({ 
        page: 1, 
        limit: 100, 
        search: inputValue,
        department: selectedDepartment.value 
      });
      const options = response?.data?.map((p: { _id: string; name: string }) => ({ 
        value: p._id, 
        label: p.name 
      })) || [];
      
      // If no search input, return all options, otherwise filter
      if (!inputValue) {
        return options;
      }
      
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
      // Only load courses if a program is selected
      if (!selectedProgram?.value) {
        return [];
      }
      
      // Get courses for the selected program
      const response = await courseService.getCourses(1, 100, inputValue, {
        program: selectedProgram.value
      });
      const options = response?.data?.map((c: { _id: string; name: string; code: string; credits: number }) => ({ 
        value: c._id, 
        label: `${c.code} - ${c.name} (${c.credits} credits)` 
      })) || [];
      
      // If no search input, return all options, otherwise filter
      if (!inputValue) {
        return options;
      }
      
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Remove department field from the data before sending to API
      const { department, ...enrollmentData } = data;
      await createEnrollmentMutation.mutateAsync(enrollmentData);
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
                  <AsyncSelect
                    loadOptions={loadStudentOptions}
                    onChange={(option: any) => {
                      field.onChange(option?.value || '');
                      setSelectedStudent(option);
                    }}
                    onBlur={field.onBlur}
                    value={selectedStudent}
                    placeholder="Search students..."
                    styles={selectStyles}
                    isClearable
                    cacheOptions
                    defaultOptions
                    noOptionsMessage={() => "No students found"}
                    loadingMessage={() => "Loading students..."}
                  />
                )}
              />
              {errors.student && (
                <p className="mt-1 text-sm text-red-600">{errors.student.message}</p>
              )}
            </div>

            {/* Department Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <Controller
                name="department"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <AsyncSelect
                    loadOptions={loadDepartmentOptions}
                    onChange={(option: any) => {
                      field.onChange(option?.value || '');
                      setSelectedDepartment(option);
                    }}
                    onBlur={field.onBlur}
                    value={selectedDepartment}
                    placeholder="Select department"
                    styles={selectStyles}
                    isClearable
                    cacheOptions
                    defaultOptions
                    noOptionsMessage={() => "No departments found"}
                    loadingMessage={() => "Loading departments..."}
                  />
                )}
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
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
                  <AsyncSelect
                    key={programOptionsKey}
                    loadOptions={loadProgramOptions}
                    onChange={(option: any) => {
                      field.onChange(option?.value || '');
                      setSelectedProgram(option);
                    }}
                    onBlur={field.onBlur}
                    value={selectedProgram}
                    placeholder={selectedDepartment ? "Select program" : "Please select a department first"}
                    styles={selectStyles}
                    isClearable
                    cacheOptions
                    defaultOptions
                    isDisabled={!selectedDepartment}
                    noOptionsMessage={() => selectedDepartment ? "No programs found" : "Please select a department first"}
                    loadingMessage={() => "Loading programs..."}
                  />
                )}
              />
              {!selectedDepartment && (
                <p className="mt-1 text-sm text-gray-500">Please select a department first to view available programs</p>
              )}
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
                    value={field.value ? { value: field.value, label: field.value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') } : null}
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

            {/* Courses Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courses
              </label>
              <Controller
                name="courses"
                control={control}
                render={({ field }) => (
                  <AsyncSelect
                    key={courseOptionsKey}
                    loadOptions={loadCourseOptions}
                    onChange={(options: any) => {
                      const selectedValues = Array.isArray(options) 
                        ? options.map((option: SelectOption) => option.value)
                        : [];
                      field.onChange(selectedValues);
                      setSelectedCourses(Array.isArray(options) ? options : []);
                    }}
                    onBlur={field.onBlur}
                    value={selectedCourses}
                    placeholder={selectedProgram ? "Search courses..." : "Please select a program first"}
                    styles={selectStyles}
                    isMulti
                    isClearable
                    cacheOptions
                    defaultOptions
                    isDisabled={!selectedProgram}
                    noOptionsMessage={() => selectedProgram ? "No courses found" : "Please select a program first"}
                    loadingMessage={() => "Loading courses..."}
                  />
                )}
              />
              {!selectedProgram && (
                <p className="mt-1 text-sm text-gray-500">Please select a program first to view available courses</p>
              )}
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