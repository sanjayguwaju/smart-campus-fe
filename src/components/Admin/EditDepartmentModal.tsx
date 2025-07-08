import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useUpdateDepartment } from '../../api/hooks/useDepartments';
import { Department, UpdateDepartmentRequest } from '../../api/types/departments';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

interface FormInputs {
  name: string;
  description: string;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const updateDepartmentMutation = useUpdateDepartment();

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        description: department.description || '',
      });
    }
  }, [department, reset]);

  const onSubmit = async (data: FormInputs) => {
    if (!department) return;

    try {
      const updateData: UpdateDepartmentRequest = {
        name: data.name,
        description: data.description,
      };

      await updateDepartmentMutation.mutateAsync({
        id: department._id,
        data: updateData,
      });
      
      toast.success('Department updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update department:', error);
      toast.error('Failed to update department. Please try again.');
    }
  };

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Department</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              id="name"
              {...register('name', {
                required: 'Department name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters long',
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateDepartmentMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
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