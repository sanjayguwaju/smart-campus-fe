import React, { useState } from 'react';
import { Program } from '../../../api/types/programs';
import Select, { StylesConfig } from 'react-select';
import { useDepartments } from '../../../api/hooks/useDepartments';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const selectStyles: StylesConfig<{ value: string; label: string }> = {
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

// Add this type for the form
interface ProgramForm {
  name: string;
  department: string;
  level: 'Undergraduate' | 'Postgraduate';
  semesters: number;
  duration: string;
  description: string;
  prerequisites: string[];
  image?: string;
  brochureUrl?: string;
  isPublished: boolean;
  status: string;
}

// Use ProgramForm for form state
const initialState: ProgramForm = {
  name: '',
  department: '',
  level: 'Undergraduate',
  semesters: 1,
  duration: '',
  description: '',
  prerequisites: [''],
  image: '',
  brochureUrl: '',
  status: 'draft',
  isPublished: false,
};

const AddProgramModal: React.FC<AddProgramModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState<ProgramForm>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: departmentData } = useDepartments(1, 100);
  const departments = departmentData?.departments || [];

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
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.duration.trim()) newErrors.duration = 'Duration is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    try {
      // Map department string to expected object
      await onAdd({
        ...form,
        department: { _id: form.department, name: '' },
      });
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
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep: any) => (
                <option key={dep._id} value={dep._id}>{dep.name}</option>
              ))}
            </select>
            {errors.department && <span className="text-red-500 text-xs">{errors.department}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Level</label>
            <select name="level" value={form.level} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Semesters</label>
            <input
              type="number"
              name="semesters"
              min={1}
              max={20}
              value={form.semesters || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
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
            <label className="block text-sm font-medium">Status</label>
            <Select
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === form.status)}
              onChange={option => {
                const selected = option as { value: string; label: string } | null;
                setForm(f => ({
                  ...f,
                  status: selected?.value || 'draft',
                  isPublished: selected?.value === 'published'
                }));
              }}
              styles={selectStyles}
              className="w-full"
              placeholder="Select status"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded ${form.isPublished ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished, status: f.isPublished ? 'draft' : 'published' }))}
            >
              {form.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <span className="text-sm">Current: <b>{form.isPublished ? 'Published' : 'Draft'}</b></span>
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Brochure URL</label>
            <input name="brochureUrl" value={form.brochureUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
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