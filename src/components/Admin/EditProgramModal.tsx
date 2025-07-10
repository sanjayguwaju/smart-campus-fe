import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { departmentService } from '../../api/services/departmentService';
import { Department } from '../../api/types/departments';
import { Program } from '../../api/types/programs';
import ImageUpload from '../common/ImageUpload';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSubmit: (id: string, data: Partial<Program>) => void;
}

const EditProgramModal: React.FC<EditProgramModalProps> = ({ isOpen, onClose, program, onSubmit }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<Program>();

  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        department: typeof program.department === 'string' ? program.department : program.department._id,
        level: program.level,
        duration: program.duration,
        description: program.description,
        prerequisites: program.prerequisites,
        image: program.image,
        brochureUrl: program.brochureUrl,
        isPublished: program.isPublished,
        status: program.status
      });
    }
  }, [program, reset]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getDepartments();
        setDepartments(response.data.data.departments || []);
      } catch (error) {
        console.error('Failed to fetch departments:', error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const onSubmitForm = async (data: Program) => {
    if (!program) return;
    
    setServerError(null);
    try {
      await onSubmit(program._id, {
        ...data,
        isPublished: data.status === 'published'
      });
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to update program');
    }
  };

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">Edit Program</h2>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
            
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input 
                {...register('name', { required: 'Name is required' })} 
                className="w-full border rounded px-3 py-2" 
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Department</label>
              <select 
                {...register('department', { required: 'Department is required' })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              {errors.department && <span className="text-red-500 text-xs">{errors.department.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Level</label>
              <select 
                {...register('level', { required: 'Level is required' })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="professional">Professional</option>
              </select>
              {errors.level && <span className="text-red-500 text-xs">{errors.level.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Duration</label>
              <input 
                {...register('duration', { required: 'Duration is required' })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.duration && <span className="text-red-500 text-xs">{errors.duration.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea 
                {...register('description', { required: 'Description is required' })}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
              {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Image</label>
              <ImageUpload
                onImageUpload={(url) => setValue('image', url)}
                currentImage={watch('image')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Brochure URL</label>
              <input 
                {...register('brochureUrl')}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal; 