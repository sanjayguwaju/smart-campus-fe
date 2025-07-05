import React, { useState, useEffect } from 'react';
import { Program } from '../../api/types/programs';
import ImageUpload from '../common/ImageUpload';
import { getDepartments } from '../../api/services/departmentService';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

const initialState = {
  name: '',
  department: '',
  level: 'Undergraduate',
  duration: '',
  semesters: '',
  description: '',
  prerequisites: [''],
  image: '',
  brochureUrl: '',
  isPublished: false,
  status: 'draft' as 'draft' | 'published' | 'archived',
};

const AddProgramModal: React.FC<AddProgramModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      getDepartments().then(res => {
        setDepartments(res.data.data || []);
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrerequisiteChange = (idx: number, value: string) => {
    setForm((prev) => {
      const prerequisites = [...prev.prerequisites];
      prerequisites[idx] = value;
      return { ...prev, prerequisites };
    });
  };

  const addPrerequisite = () => {
    setForm((prev) => ({ ...prev, prerequisites: [...prev.prerequisites, ''] }));
  };

  const removePrerequisite = (idx: number) => {
    setForm((prev) => {
      const prerequisites = prev.prerequisites.filter((_, i) => i !== idx);
      return { ...prev, prerequisites };
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.department.trim()) newErrors.department = 'Department is required';
    if (!form.duration.trim()) newErrors.duration = 'Duration is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.semesters || isNaN(Number(form.semesters))) newErrors.semesters = 'Semesters is required and must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    try {
      await onAdd({ ...form, prerequisites: form.prerequisites.filter((p) => p.trim()), isPublished: form.status === 'published', status: form.status });
      setForm(initialState);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Failed to add program');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Add Program</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <select name="department" value={form.department} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            {errors.department && <span className="text-red-500 text-xs">{errors.department}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Level</label>
            <select name="level" value={form.level} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Semesters</label>
            <input name="semesters" type="number" value={form.semesters} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            {errors.semesters && <span className="text-red-500 text-xs">{errors.semesters}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Prerequisites</label>
            {form.prerequisites.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input value={p} onChange={e => handlePrerequisiteChange(idx, e.target.value)} className="flex-1 border rounded px-3 py-2" />
                {form.prerequisites.length > 1 && (
                  <button type="button" onClick={() => removePrerequisite(idx)} className="text-red-500">&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPrerequisite} className="text-blue-600 text-xs mt-1">+ Add Prerequisite</button>
          </div>
          <div>
            <label className="block text-sm font-medium">Image</label>
            <ImageUpload
              onImageUpload={(url) => setForm((prev) => ({ ...prev, image: url }))}
              currentImage={form.image}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Brochure URL</label>
            <input name="brochureUrl" value={form.brochureUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgramModal; 