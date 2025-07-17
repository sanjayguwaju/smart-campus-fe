import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X, Building, User } from 'lucide-react';
import { useUpdateDepartment } from '../../../api/hooks/useDepartments';
import { UpdateDepartmentRequest, DepartmentData } from '../../../api/types/departments';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentData | null;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  const updateDepartmentMutation = useUpdateDepartment();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateDepartmentRequest>({
    defaultValues: {
      name: department?.name || '',
      code: department?.code || '',
      description: department?.description || '',
      headOfDepartment: department?.headOfDepartment || '',
      isActive: department?.isActive,
    },
  });

  React.useEffect(() => {
    if (department) {
      setValue('name', department.name || '');
      setValue('code', department.code || '');
      setValue('description', department.description || '');
      setValue('headOfDepartment', department.headOfDepartment || '');
      setValue('isActive', department.isActive);
    }
  }, [department, setValue]);

  const onSubmit = async (data: UpdateDepartmentRequest) => {
    if (!department) return;
    try {
      await updateDepartmentMutation.mutateAsync({ id: department._id, departmentData: data });
      reset();
      onClose();
      toast.success('Department updated successfully');
    } catch (error) {
      console.error('Failed to update department:', error);
      toast.error('Failed to update department. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Department</h2>
              <p className="text-sm text-gray-500">Update department details</p>
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
              Department Name *
            </label>
            <div className="relative">
              <input
                {...register('name', { required: 'Department name is required' })}
                type="text"
                id="name"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter department name"
              />
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Department Code *
            </label>
            <div className="relative">
              <input
                {...register('code', { required: 'Department code is required' })}
                type="text"
                id="code"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter department code"
              />
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              placeholder="Enter department description"
            />
          </div>
          {/* Head of Department */}
          <div>
            <label htmlFor="headOfDepartment" className="block text-sm font-medium text-gray-700 mb-1">
              Head of Department
            </label>
            <div className="relative">
              <input
                {...register('headOfDepartment')}
                type="text"
                id="headOfDepartment"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter head of department name"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          {/* isActive */}
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
              Active Status
            </label>
            <select
              {...register('isActive')}
              id="isActive"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || updateDepartmentMutation.isPending}
            >
              {isSubmitting || updateDepartmentMutation.isPending ? 'Updating...' : 'Update Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal; 