import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X, BookOpen, User, Building } from 'lucide-react';
import { useCreateCourse } from '../../../api/hooks/useCourses';
import { CreateCourseRequest } from '../../../api/types/courses';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const createCourseMutation = useCreateCourse();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>({
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
    },
  });

  const onSubmit = async (data: CreateCourseRequest) => {
    try {
      await createCourseMutation.mutateAsync(data);
      reset();
      onClose();
      toast.success('Course created successfully');
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error('Failed to create course. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add New Course</h2>
              <p className="text-sm text-gray-500">Create a new course</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name *
            </label>
            <div className="relative">
              <input
                {...register('name', { required: 'Course name is required' })}
                type="text"
                id="name"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter course name"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code *
            </label>
            <div className="relative">
              <input
                {...register('code', { required: 'Course code is required' })}
                type="text"
                id="code"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter course code"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
              placeholder="Enter course description"
            />
          </div>
          {/* Credits */}
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
              Credits *
            </label>
            <input
              {...register('credits', { required: 'Credits are required', min: 1 })}
              type="number"
              id="credits"
              className={`w-full p-2 border rounded-lg ${errors.credits ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter credits"
              min={1}
            />
            {errors.credits && (
              <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
            )}
          </div>
          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <div className="relative">
              <input
                {...register('department', { required: 'Department is required' })}
                type="text"
                id="department"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter department"
              />
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>
          {/* Instructor */}
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <div className="relative">
              <input
                {...register('instructor')}
                type="text"
                id="instructor"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter instructor name"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          {/* Semester */}
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester *
            </label>
            <input
              {...register('semester', { required: 'Semester is required' })}
              type="text"
              id="semester"
              className={`w-full p-2 border rounded-lg ${errors.semester ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter semester (e.g., Fall)"
            />
            {errors.semester && (
              <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
            )}
          </div>
          {/* Academic Year */}
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year *
            </label>
            <input
              {...register('academicYear', { required: 'Academic year is required' })}
              type="text"
              id="academicYear"
              className={`w-full p-2 border rounded-lg ${errors.academicYear ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter academic year (e.g., 2024-2025)"
            />
            {errors.academicYear && (
              <p className="mt-1 text-sm text-red-600">{errors.academicYear.message}</p>
            )}
          </div>
          {/* Max Students */}
          <div>
            <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-1">
              Max Students *
            </label>
            <input
              {...register('maxStudents', { required: 'Max students is required', min: 1 })}
              type="number"
              id="maxStudents"
              className={`w-full p-2 border rounded-lg ${errors.maxStudents ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter max students"
              min={1}
            />
            {errors.maxStudents && (
              <p className="mt-1 text-sm text-red-600">{errors.maxStudents.message}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || createCourseMutation.isPending}
            >
              {isSubmitting || createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal; 