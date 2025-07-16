import React, { useState, useEffect } from 'react';
import { Program } from '../../api/types/programs';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onEdit: (id: string, data: Partial<Program>) => void;
}

const EditProgramModal: React.FC<EditProgramModalProps> = ({ isOpen, onClose, program, onEdit }) => {
  const [form, setForm] = useState<Partial<Program>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (program) {
      setForm({ ...program });
    }
  }, [program]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrerequisiteChange = (idx: number, value: string) => {
    setForm((prev) => {
      const prerequisites = prev.prerequisites ? [...prev.prerequisites] : [];
      prerequisites[idx] = value;
      return { ...prev, prerequisites };
    });
  };

  const addPrerequisite = () => {
    setForm((prev) => ({ ...prev, prerequisites: [...(prev.prerequisites || []), ''] }));
  };

  const removePrerequisite = (idx: number) => {
    setForm((prev) => {
      const prerequisites = (prev.prerequisites || []).filter((_, i) => i !== idx);
      return { ...prev, prerequisites };
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name?.trim()) newErrors.name = 'Name is required';
    if (!form.department?.trim()) newErrors.department = 'Department is required';
    if (!form.duration?.trim()) newErrors.duration = 'Duration is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate() || !program) return;
    try {
      await onEdit(program._id, { ...form, prerequisites: (form.prerequisites || []).filter((p) => p.trim()) });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Failed to edit program');
    }
  };

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Edit Program</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <input name="department" value={form.department || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.department && <span className="text-red-500 text-xs">{errors.department}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Level</label>
            <select name="level" value={form.level || 'undergraduate'} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input name="duration" value={form.duration || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Prerequisites</label>
            {(form.prerequisites || []).map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input value={p} onChange={e => handlePrerequisiteChange(idx, e.target.value)} className="flex-1 border rounded px-3 py-2" />
                {(form.prerequisites || []).length > 1 && (
                  <button type="button" onClick={() => removePrerequisite(idx)} className="text-red-500">&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPrerequisite} className="text-blue-600 text-xs mt-1">+ Add Prerequisite</button>
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input name="image" value={form.image || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Brochure URL</label>
            <input name="brochureUrl" value={form.brochureUrl || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgramModal; 