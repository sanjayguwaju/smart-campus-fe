import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { X, Users, Search, Filter, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUsers } from '../../../api/hooks/useUsers';
import { useCreateEnrollment, useEnrollments } from '../../../api/hooks/useEnrollments';
import { UserData } from '../../../api/types/users';
import { userService } from '../../../api/services/userService';
import { programService } from '../../../api/services/programService';
import { departmentService } from '../../../api/services/departmentService';
import { courseService } from '../../../api/services/courseService';

interface BulkEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const BulkEnrollmentModal: React.FC<BulkEnrollmentModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'filter' | 'select' | 'enroll'>('filter');
  const [emailPattern, setEmailPattern] = useState('');
  const [rollNumberRange, setRollNumberRange] = useState({ start: '', end: '' });
  const [selectedStudents, setSelectedStudents] = useState<UserData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectOption | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<SelectOption | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<SelectOption[]>([]);
  const [programOptionsKey, setProgramOptionsKey] = useState<number>(0);
  const [courseOptionsKey, setCourseOptionsKey] = useState<number>(0);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // API hooks
  const { data: usersData } = useUsers(1, 100, '', { role: 'student' });
  const { data: enrollmentsData } = useEnrollments(1, 100, '', {});
  const createEnrollmentMutation = useCreateEnrollment();

  const students = usersData?.users || [];

  // Validation function to check existing enrollments
  const validateStudentEnrollment = (studentId: string, programId: string) => {
    const existingEnrollments = enrollmentsData?.enrollments || [];
    const studentEnrollments = existingEnrollments.filter(
      (enrollment: any) => enrollment.student._id === studentId
    );

    // Check if student has ANY enrollment in the same program (regardless of status)
    const enrollmentInSameProgram = studentEnrollments.find(
      (enrollment: any) => enrollment.program._id === programId
    );

    return enrollmentInSameProgram;
  };

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    defaultValues: {
      program: '',
      semester: 1,
      academicYear: new Date().getFullYear().toString(),
      enrollmentType: 'full_time',
      status: 'active',
      courses: [],
      notes: ''
    }
  });

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

  // Trigger program options reload when needed
  useEffect(() => {
    setProgramOptionsKey(prev => prev + 1);
  }, []);

  // Trigger course options reload when program changes
  useEffect(() => {
    if (selectedProgram) {
      setCourseOptionsKey(prev => prev + 1);
      // Clear selected courses when program changes
      setSelectedCourses([]);
      setValue('courses', []);
    }
  }, [selectedProgram, setValue]);

  // Load options functions
  const loadDepartmentOptions = async (inputValue: string) => {
    try {
      console.log('BulkEnrollmentModal: Loading departments with inputValue:', inputValue);
      const response = await departmentService.getDepartments(1, 100, inputValue);
      console.log('BulkEnrollmentModal: Department response:', response);
      const options = response?.data?.map((dept: { _id: string; name: string }) => ({ 
        value: dept._id, 
        label: dept.name 
      })) || [];
      console.log('BulkEnrollmentModal: Department options:', options);
      
      // If no search input, return all options, otherwise filter
      if (!inputValue) {
        return options;
      }
      
      const filteredOptions = options.filter((option: SelectOption) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      console.log('BulkEnrollmentModal: Filtered options:', filteredOptions);
      return filteredOptions;
    } catch (error) {
      console.error('BulkEnrollmentModal: Error loading departments:', error);
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
      
      const options = response?.data?.map((program: { _id: string; name: string }) => ({ 
        value: program._id, 
        label: program.name 
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
      
      const options = response?.data?.map((course: { _id: string; name: string; code: string; credits?: number }) => ({ 
        value: course._id, 
        label: `${course.code} - ${course.name} (${course.credits || 3} credits)` 
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

  // Filter students based on email pattern or roll number range
  const filteredStudents = students.filter((student: UserData) => {
    if (emailPattern) {
      return student.email.toLowerCase().includes(emailPattern.toLowerCase());
    }
    
    if (rollNumberRange.start && rollNumberRange.end) {
      const email = student.email;
      const rollMatch = email.match(/(\d+)@/);
      if (rollMatch) {
        const rollNumber = parseInt(rollMatch[1]);
        const start = parseInt(rollNumberRange.start);
        const end = parseInt(rollNumberRange.end);
        return rollNumber >= start && rollNumber <= end;
      }
    }
    
    return false;
  });

  const handleFilterStudents = () => {
    if (!emailPattern && (!rollNumberRange.start || !rollNumberRange.end)) {
      toast.error('Please enter either an email pattern or roll number range');
      return;
    }
    setStep('select');
  };

  const handleSelectAllStudents = () => {
    setSelectedStudents(filteredStudents);
  };

  const handleDeselectAllStudents = () => {
    setSelectedStudents([]);
  };

  const handleToggleStudent = (student: UserData) => {
    setSelectedStudents(prev => 
      prev.find(s => s._id === student._id)
        ? prev.filter(s => s._id !== student._id)
        : [...prev, student]
    );
  };

  const handleProceedToEnrollment = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    setStep('enroll');
  };

  const handleBulkEnroll = async (data: any) => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    // Pre-validate all students before starting enrollment
    const validationErrors: string[] = [];
    const validStudents: UserData[] = [];

    for (const student of selectedStudents) {
      const existingEnrollment = validateStudentEnrollment(student._id, data.program);
      
      if (existingEnrollment) {
        validationErrors.push(
          `${student.fullName}: Already has ${existingEnrollment.status} enrollment ` +
          `(${existingEnrollment.academicYear}, Semester ${existingEnrollment.semester})`
        );
      } else {
        validStudents.push(student);
      }
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      const errorMessage = `Cannot enroll ${validationErrors.length} student(s):\n${validationErrors.slice(0, 3).join('\n')}${validationErrors.length > 3 ? `\n...and ${validationErrors.length - 3} more` : ''}`;
      toast.error(errorMessage);
      
      if (validStudents.length === 0) {
        return; // No valid students to enroll
      }
      
      // Ask user if they want to proceed with valid students only
      const proceed = window.confirm(
        `${validationErrors.length} students cannot be enrolled due to existing enrollments.\n` +
        `Proceed with enrolling ${validStudents.length} valid students?`
      );
      
      if (!proceed) {
        return;
      }
    }

    setIsEnrolling(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const student of validStudents) {
        try {
          await createEnrollmentMutation.mutateAsync({
            student: student._id,
            program: data.program,
            semester: data.semester,
            academicYear: data.academicYear,
            courses: data.courses,
            status: data.status,
            enrollmentType: data.enrollmentType,
            notes: data.notes
          });
          successCount++;
        } catch (error: any) {
          console.error(`Failed to enroll ${student.fullName}:`, error);
          
          // Handle specific backend error messages
          if (error?.response?.data?.message) {
            const errorMessage = error.response.data.message;
            if (errorMessage.includes('already enrolled in this program')) {
              toast.error(`${student.fullName}: Already enrolled in this program`);
            } else {
              toast.error(`${student.fullName}: ${errorMessage}`);
            }
          } else {
            toast.error(`${student.fullName}: Failed to enroll`);
          }
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully enrolled ${successCount} students${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
        onClose();
        resetForm();
      } else {
        toast.error('Failed to enroll any students');
      }
    } catch (error) {
      toast.error('An error occurred during bulk enrollment');
    } finally {
      setIsEnrolling(false);
    }
  };

  const resetForm = () => {
    setStep('filter');
    setEmailPattern('');
    setRollNumberRange({ start: '', end: '' });
    setSelectedStudents([]);
    setSelectedProgram(null);
    setSelectedCourses([]);
    reset();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk Enrollment</h2>
              <p className="text-sm text-gray-600">
                {step === 'filter' && 'Filter students by email or roll number'}
                {step === 'select' && `Select students to enroll (${filteredStudents.length} found)`}
                {step === 'enroll' && `Enroll ${selectedStudents.length} students`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'filter' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">How it works</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Filter students by email pattern (e.g., "0223") or roll number range (e.g., 022312-022360) 
                      to enroll multiple students at once. This is perfect for enrolling entire classes or batches.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Pattern Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Pattern
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., 0223, 2023, @college.edu"
                      value={emailPattern}
                      onChange={(e) => setEmailPattern(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter part of the email address to filter students
                  </p>
                </div>

                {/* Roll Number Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Start (e.g., 022312)"
                      value={rollNumberRange.start}
                      onChange={(e) => setRollNumberRange(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="flex items-center text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="End (e.g., 022360)"
                      value={rollNumberRange.end}
                      onChange={(e) => setRollNumberRange(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter roll number range (e.g., 022312-022360)
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFilterStudents}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Students
                </button>
              </div>
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select Students ({filteredStudents.length} found)
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSelectAllStudents}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAllStudents}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No students found matching the criteria
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredStudents.map((student: UserData) => (
                        <div
                          key={student._id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${
                            selectedStudents.find(s => s._id === student._id) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleToggleStudent(student)}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.find(s => s._id === student._id) !== undefined}
                              onChange={() => handleToggleStudent(student)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {student.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                            {selectedStudents.find(s => s._id === student._id) && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep('filter')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Back to Filter
                </button>
                <div className="flex space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedStudents.length} students selected
                  </span>
                  <button
                    onClick={handleProceedToEnrollment}
                    disabled={selectedStudents.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Enrollment
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'enroll' && (
            <form onSubmit={handleSubmit(handleBulkEnroll)} className="space-y-6">
              {/* Validation Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-900">Enrollment Rule</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Only one enrollment per student per program is allowed. Students with existing enrollments 
                      in the selected program will be automatically excluded from this bulk enrollment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Enrollment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                   {errors.program && (
                    <p className="mt-1 text-sm text-red-600">{errors.program.message?.toString()}</p>
                  )}
               </div>

                {/* Semester */}
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
              </div>

              {/* Courses Selection */}
              <div>
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
              <div>
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

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-900">Ready to enroll</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      You are about to enroll {selectedStudents.length} students in {selectedCourses.length} courses. 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {step === 'enroll' && (
          <div className="flex items-center justify-between space-x-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setStep('select')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Back to Selection
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(handleBulkEnroll)}
                disabled={isEnrolling || isSubmitting || createEnrollmentMutation.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isEnrolling || isSubmitting || createEnrollmentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Enroll {selectedStudents.length} Students
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkEnrollmentModal; 