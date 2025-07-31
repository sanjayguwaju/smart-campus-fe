import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useCreateEnrollment, useEnrollments } from '../../../api/hooks/useEnrollments';
import { CreateEnrollmentRequest } from '../../../api/types/enrollments';
import { userService } from '../../../api/services/userService';
import { programService } from '../../../api/services/programService';
import { departmentService } from '../../../api/services/departmentService';
import { courseService } from '../../../api/services/courseService';
import { toast } from 'react-hot-toast';

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
  const { data: enrollmentsData } = useEnrollments(1, 100, '', {});
  
  // State to track selected options for display
  const [selectedStudent, setSelectedStudent] = React.useState<SelectOption | null>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<SelectOption | null>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<SelectOption[]>([]);
  const [programOptionsKey, setProgramOptionsKey] = React.useState<number>(0);
  const [courseOptionsKey, setCourseOptionsKey] = React.useState<number>(0);
  const [enrollmentInfo, setEnrollmentInfo] = React.useState<string>('');

  // Trigger program options reload when needed
  useEffect(() => {
    setProgramOptionsKey(prev => prev + 1);
  }, []);

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

  // Check enrollment status when student or program changes
  useEffect(() => {
    if (selectedStudent && selectedProgram && enrollmentsData?.enrollments) {
      const existingEnrollments = enrollmentsData.enrollments;
      const studentEnrollments = existingEnrollments.filter(
        (enrollment: any) => enrollment.student._id === selectedStudent.value
      );

      const enrollmentsInSameProgram = studentEnrollments.filter(
        (enrollment: any) => enrollment.program._id === selectedProgram.value
      );

      if (enrollmentsInSameProgram.length > 0) {
        const enrollmentDetails = enrollmentsInSameProgram.map((enrollment: any) => 
          `${enrollment.status} (${enrollment.academicYear}, Semester ${enrollment.semester})`
        ).join(', ');
        
        setEnrollmentInfo(
          `Student has ${enrollmentsInSameProgram.length} enrollment(s) in this program: ${enrollmentDetails}`
        );
      } else {
        setEnrollmentInfo('');
      }
    } else {
      setEnrollmentInfo('');
    }
  }, [selectedStudent, selectedProgram, enrollmentsData]);
  
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
      console.log('Loading all programs with search:', inputValue);
      const response = await programService.getPrograms({ 
        page: 1, 
        limit: 100, 
        search: inputValue
      });
      console.log('Program API response:', response);
      
      const options = response?.data?.map((p: { _id: string; name: string }) => ({ 
        value: p._id, 
        label: p.name 
      })) || [];
      
      console.log('Program options:', options);
      
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
      
      console.log('Loading courses for program:', selectedProgram.value, 'with search:', inputValue);
      const response = await courseService.getCourses(1, 100, inputValue, {
        program: selectedProgram.value
      });
      console.log('Course API response:', response);
      
      const options = response?.data?.map((c: { _id: string; name: string; code: string; credits: number }) => ({ 
        value: c._id, 
        label: `${c.code} - ${c.name} (${c.credits} credits)` 
      })) || [];
      
      console.log('Course options:', options);
      
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
      // Check for existing enrollments for this student (limited to 100 most recent)
      const existingEnrollments = enrollmentsData?.enrollments || [];
      const studentEnrollments = existingEnrollments.filter(
        (enrollment: any) => enrollment.student._id === data.student
      );

      // Check if student has ANY enrollment in the same program (regardless of status)
      const enrollmentInSameProgram = studentEnrollments.find(
        (enrollment: any) => enrollment.program._id === data.program
      );

      if (enrollmentInSameProgram) {
        toast.error(
          `Student already has an enrollment in this program. ` +
          `Current status: ${enrollmentInSameProgram.status} ` +
          `(${enrollmentInSameProgram.academicYear}, Semester ${enrollmentInSameProgram.semester}). ` +
          `Only one enrollment per student per program is allowed. ` +
          `Please complete or drop the existing enrollment first.`
        );
        return;
      }

      // Check if student has any active enrollments in other programs
      const activeEnrollmentsInOtherPrograms = studentEnrollments.filter(
        (enrollment: any) => 
          enrollment.program._id !== data.program && 
          ['active', 'suspended'].includes(enrollment.status)
      );

      if (activeEnrollmentsInOtherPrograms.length > 0) {
        const programNames = activeEnrollmentsInOtherPrograms
          .map((enrollment: any) => enrollment.program.name)
          .join(', ');
        
        toast.error(
          `Student has active enrollments in other programs: ${programNames}. ` +
          `Please complete or drop those enrollments first.`
        );
        return;
      }

      // Check for duplicate enrollment in same semester and academic year
      const duplicateEnrollment = studentEnrollments.find(
        (enrollment: any) => 
          enrollment.program._id === data.program && 
          enrollment.semester === data.semester && 
          enrollment.academicYear === data.academicYear
      );

      if (duplicateEnrollment) {
        toast.error(
          `Student is already enrolled in this program for ${data.academicYear}, Semester ${data.semester}. ` +
          `Current status: ${duplicateEnrollment.status}. ` +
          `Please select a different semester or academic year.`
        );
        return;
      }

      // All validations passed, create the enrollment
      await createEnrollmentMutation.mutateAsync(data);
      toast.success('Enrollment created successfully!');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Failed to create enrollment:', error);
      
      // Handle specific backend error messages
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        // Handle the specific duplicate enrollment error
        if (errorMessage.includes('already enrolled in this program for the specified semester and academic year')) {
          toast.error(
            `Student is already enrolled in this program for ${data.academicYear}, Semester ${data.semester}. ` +
            `Only one enrollment per student per program is allowed. ` +
            `Please complete or drop the existing enrollment first.`
          );
        } else if (errorMessage.includes('already enrolled in this program')) {
          toast.error(
            `Student already has an enrollment in this program. ` +
            `Only one enrollment per student per program is allowed. ` +
            `Please complete or drop the existing enrollment first.`
          );
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Failed to create enrollment. Please try again.');
      }
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
                    onChange={(newValue) => {
                      const singleValue = newValue as SingleValue<SelectOption>;
                      field.onChange(singleValue?.value || '');
                      setSelectedStudent(singleValue);
                    }}
                    onBlur={field.onBlur}
                    value={selectedStudent}
                    placeholder="Search students..."
                    styles={selectStyles}
                    className="w-full"
                    isSearchable
                    cacheOptions
                    defaultOptions
                  />
                )}
              />
              {errors.student && (
                <p className="mt-1 text-sm text-red-600">{errors.student.message?.toString()}</p>
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
                     onChange={(newValue) => {
                       const singleValue = newValue as SingleValue<SelectOption>;
                       console.log('Program selected:', singleValue);
                       field.onChange(singleValue?.value || '');
                       setSelectedProgram(singleValue);
                     }}
                     onBlur={field.onBlur}
                     value={selectedProgram}
                     placeholder="Select program"
                     styles={selectStyles}
                     className="w-full"
                     isSearchable
                     cacheOptions
                     defaultOptions
                   />
                 )}
               />
                               {enrollmentInfo && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Note:</span> {enrollmentInfo}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-medium">Rule:</span> Only one enrollment per student per program is allowed. 
                      You must complete or drop the existing enrollment first.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-medium">Info:</span> Showing enrollments from the most recent 100 records. 
                      Backend validation will catch any additional conflicts.
                    </p>
                  </div>
                )}
               {errors.program && (
                 <p className="mt-1 text-sm text-red-600">{errors.program.message?.toString()}</p>
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
                <p className="mt-1 text-sm text-red-600">{errors.semester.message?.toString()}</p>
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
                <p className="mt-1 text-sm text-red-600">{errors.academicYear.message?.toString()}</p>
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
                    value={field.value ? { value: field.value, label: field.value.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') } : null}
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
                <p className="mt-1 text-sm text-red-600">{errors.enrollmentType.message?.toString()}</p>
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
                <p className="mt-1 text-sm text-red-600">{errors.status.message?.toString()}</p>
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
                    onChange={(newValue) => {
                      console.log('Courses selected:', newValue);
                      const selectedValues = Array.isArray(newValue) 
                        ? newValue.map((option: SelectOption) => option.value)
                        : [];
                      field.onChange(selectedValues);
                      setSelectedCourses(Array.isArray(newValue) ? newValue : []);
                    }}
                    onBlur={field.onBlur}
                    value={selectedCourses}
                    placeholder={selectedProgram ? "Search courses..." : "Please select a program first"}
                    styles={selectStyles}
                    className="w-full"
                    isMulti
                    isSearchable
                    cacheOptions
                    defaultOptions
                    isDisabled={!selectedProgram}
                  />
                )}
              />
              {!selectedProgram && (
                <p className="mt-1 text-sm text-gray-500">Please select a program first to view available courses</p>
              )}
              {errors.courses && (
                <p className="mt-1 text-sm text-red-600">{errors.courses.message?.toString()}</p>
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
                <p className="mt-1 text-sm text-red-600">{errors.notes.message?.toString()}</p>
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