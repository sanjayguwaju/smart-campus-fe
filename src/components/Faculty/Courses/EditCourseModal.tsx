import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StylesConfig, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useUpdateCourse } from '../../../api/hooks/useCourses';
import { UpdateCourseRequest, CourseData } from '../../../api/types/courses';
import { departmentService } from '../../../api/services/departmentService';
import { userService } from '../../../api/services/userService';
import { programService } from '../../../api/services/programService';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | null;
}

interface SelectOption {
  value: string;
  label: string;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, course }) => {
  console.log(course)
  const updateCourseMutation = useUpdateCourse();

  // State to store selected option labels
  const [selectedDepartment, setSelectedDepartment] = React.useState<SelectOption | null>(null);
  const [selectedInstructor, setSelectedInstructor] = React.useState<SelectOption | null>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<SelectOption | null>(null);
  const [programOptionsKey, setProgramOptionsKey] = React.useState<number>(0);

  // Trigger program options reload when department changes
  useEffect(() => {
    if (selectedDepartment) {
      setProgramOptionsKey(prev => prev + 1);
    }
  }, [selectedDepartment]);

  // Load options functions for AsyncSelect
  const loadDepartmentOptions = async (inputValue: string) => {
    try {
      const response = await departmentService.getDepartments(1, 100, inputValue);
      const options = response?.data?.map((d: { _id: string; name: string }) => ({ value: d._id, label: d.name })) || [];
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading departments:', error);
      return [];
    }
  };

  const loadInstructorOptions = async (inputValue: string) => {
    try {
      const response = await userService.getUsers(1, 100, inputValue, { role: 'faculty' });
      const options = (response?.data?.map((u: { _id: string; fullName: string }) => ({ value: u._id, label: u.fullName })) || [])
        .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));
      return options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error loading instructors:', error);
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
      const options = response?.data?.map((p: { _id: string; name: string }) => ({ value: p?._id, label: p?.name })) || [];

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
  } = useForm<UpdateCourseRequest>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      credits: 3,
      department: '',
      instructor: '',
      semester: '',
      academicYear: '',
      maxStudents: 30,
      isActive: true,
    }
  });

  useEffect(() => {
    if (course) {
      setValue('name', course.name || '');
      setValue('code', course.code || '');
      setValue('description', course.description || '');
      setValue('credits', course.credits || 3);
      setValue('department', course.department?._id || '');
      setValue('program', course.program?._id || '');
      setValue('instructor', course.instructor?._id || '');
      setValue('semester', String(course.semester || ''));
      setValue('academicYear', course.academicYear || '');
      setValue('maxStudents', course.maxStudents || 30);
      setValue('isActive', course.isActive);

      // Set selected options for display
      if (course.department) {
        // We'll need to fetch the department name to set the selected option
        loadDepartmentOptions('').then(options => {
          const deptOption = options.find(opt => opt.value === course.department);
          if (deptOption) {
            setSelectedDepartment(deptOption);
          }
        });
      }
      
      if (course.program) {
        // We'll need to fetch the program name to set the selected option
        // This will be set after department is loaded
        loadProgramOptions('').then(options => {
          const programOption = options.find(opt => opt.value === course.program);
          if (programOption) {
            setSelectedProgram(programOption);
          }
        });
      }

      if (course.instructor) {
        loadInstructorOptions('').then(options => {
          const instructorOption = options.find(opt => opt.value === course.instructor);
          if (instructorOption) {
            setSelectedInstructor(instructorOption);
          }
        });
      }
    }
  }, [course, setValue]);

  const onSubmit = async (data: UpdateCourseRequest) => {
    if (!course) return;
    try {
      await updateCourseMutation.mutateAsync({ id: course._id, courseData: data });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  if (!isOpen || !course) return null;

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
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <p className="text-sm text-gray-600">Update course details and settings</p>
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
                    Course Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Course name is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.name ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="Enter course name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code *
                  </label>
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: 'Course code is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.code ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="e.g., CS101"
                      />
                    )}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits *
                  </label>
                  <Controller
                    name="credits"
                    control={control}
                    rules={{ required: 'Credits are required', min: { value: 1, message: 'Credits must be at least 1' } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.credits ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="3"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.credits && (
                    <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students *
                  </label>
                  <Controller
                    name="maxStudents"
                    control={control}
                    rules={{ required: 'Max students is required', min: { value: 1, message: 'Max students must be at least 1' } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.maxStudents ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="30"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.maxStudents && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxStudents.message}</p>
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

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Enter course description"
                  />
                )}
              />
            </div>

            {/* Academic Details Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                        onChange={(newValue) => {
                          const singleValue = newValue as SingleValue<SelectOption>;
                          field.onChange(singleValue?.value || '');
                          setSelectedDepartment(singleValue);

                          // Clear selected program when department changes
                          if (selectedProgram) {
                            setSelectedProgram(null);
                            // Reset the program field in the form
                            setValue('program', '');
                          }
                        }}
                        onBlur={field.onBlur}
                        value={selectedDepartment}
                        placeholder="Select department"
                        styles={selectStyles}
                        className="w-full"
                        isSearchable
                        cacheOptions
                        defaultOptions
                      />
                    )}
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                  )}
                </div>

                <div>
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
                        onChange={(newValue) => {
                          const singleValue = newValue as SingleValue<SelectOption>;
                          field.onChange(singleValue?.value || '');
                          setSelectedProgram(singleValue);
                        }}
                        onBlur={field.onBlur}
                        value={selectedProgram}
                        placeholder={selectedDepartment ? "Select program" : "Please select a department first"}
                        styles={selectStyles}
                        className="w-full"
                        isSearchable
                        cacheOptions
                        defaultOptions
                        isDisabled={!selectedDepartment}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <Controller
                    name="instructor"
                    control={control}
                    rules={{ required: 'Instructor is required' }}
                    render={({ field }) => (
                      <AsyncSelect
                        loadOptions={loadInstructorOptions}
                        onChange={(newValue) => {
                          const singleValue = newValue as SingleValue<SelectOption>;
                          field.onChange(singleValue?.value || '');
                          setSelectedInstructor(singleValue);
                        }}
                        onBlur={field.onBlur}
                        value={selectedInstructor}
                        placeholder="Select instructor"
                        styles={selectStyles}
                        className="w-full"
                        isSearchable
                        cacheOptions
                        defaultOptions
                      />
                    )}
                  />
                  {errors.instructor && (
                    <p className="mt-1 text-sm text-red-600">{errors.instructor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <Controller
                    name="semester"
                    control={control}
                    rules={{ required: 'Semester is required', min: { value: 1, message: 'Semester must be at least 1' }, max: { value: 12, message: 'Semester cannot be more than 12' } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min={1}
                        max={12}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.semester ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="Semester (1-12)"
                        onChange={e => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.semester && (
                    <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
                  )}
                </div>



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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.academicYear ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="e.g., 2024-2025"
                      />
                    )}
                  />
                  {errors.academicYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.academicYear.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              </div>

              <div className="flex items-center space-x-4">
                <Controller
                  name="isActive"
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
                      <span className="ml-2 text-sm text-gray-700">Active Course</span>
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
                    Updating...
                  </div>
                ) : (
                  'Update Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal; 