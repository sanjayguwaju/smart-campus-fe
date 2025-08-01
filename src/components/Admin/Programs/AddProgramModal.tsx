import React, { useState } from 'react';
import { ProgramPayload } from '../../../api/types/programs';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useDepartments } from '../../../api/hooks/useDepartments';
import MultipleImageUpload from '../../common/MultipleImageUpload';
import { GraduationCap } from 'lucide-react';

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ProgramPayload) => void;
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

const initialState: ProgramPayload = {
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
  const [form, setForm] = useState<ProgramPayload>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>(form.image ? [{ url: form.image, isPrimary: true }] : []);

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
    if (!images.length) newErrors.image = 'At least one program image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const selectedDepartment = departments.find(dep => dep._id === form.department);
    if (!selectedDepartment) {
      setErrors(prev => ({ ...prev, department: 'Please select a valid department.' }));
      return;
    }
    try {
      await onAdd({
        ...form,
        department: selectedDepartment._id,
        image: images[0]?.url || '',
      });
      setForm(initialState);
      setImages([]);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Failed to add program');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Program</h2>
              <p className="text-sm text-gray-600">Create a new academic program with all details</p>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
            {/* Basic Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Department</label>
                  <AsyncSelect
                    value={form.department ? { value: form.department, label: departments.find((dep: any) => dep._id === form.department)?.name || '' } : null}
                    onChange={(option: any) => {
                      setForm(prev => ({ ...prev, department: option?.value || '' }));
                      if (errors.department) {
                        setErrors(prev => ({ ...prev, department: '' }));
                      }
                    }}
                    loadOptions={(inputValue) => {
                      return new Promise<SelectOption[]>((resolve) => {
                        setTimeout(() => {
                          const filtered = departments
                            .filter((dep: any) => 
                              dep.name.toLowerCase().includes(inputValue.toLowerCase())
                            )
                            .map((dep: any) => ({
                              value: dep._id,
                              label: dep.name
                            }));
                          resolve(filtered);
                        }, 300);
                      });
                    }}
                    styles={selectStyles}
                    isClearable
                    placeholder="Search departments..."
                    noOptionsMessage={() => "No departments found"}
                    loadingMessage={() => "Loading departments..."}
                    cacheOptions
                    defaultOptions
                  />
                  {errors.department && <span className="text-red-500 text-xs">{errors.department}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Level</label>
                  <Select
                    options={[
                      {
                        value: 'Certificate',
                        label: 'Certificate'
                      },
                      {
                        value: 'Diploma',
                        label: 'Diploma'
                      },
                      {
                        value: 'Undergraduate',
                        label: 'Undergraduate'
                      },
                      {
                        value: 'Postgraduate',
                        label: 'Postgraduate'
                      },
                      {
                        value: 'Doctorate',
                        label: 'Doctorate'
                      }
                    ]}
                    value={{ value: form.level || 'Undergraduate', label: form.level || 'Undergraduate' }}
                    onChange={(option: any) => {
                      setForm(prev => ({ ...prev, level: option?.value || 'Undergraduate' }));
                    }}
                    styles={selectStyles}
                    isClearable={false}
                    placeholder="Select level..."
                  />
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Duration</label>
                  <input name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                  {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
                  {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                </div>
              </div>
            </div>
            {/* Program Images Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Program Images</h3>
              </div>
              <MultipleImageUpload
                onImagesChange={setImages}
                currentImages={images}
                maxSize={5}
                maxImages={3}
                className="max-w-md"
              />
              {errors.image && <span className="text-red-500 text-xs">{errors.image}</span>}
            </div>
            {/* Prerequisites Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
              </div>
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
            {/* Status Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
            {/* Brochure URL Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Brochure</h3>
              </div>
              <input name="brochureUrl" value={form.brochureUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal; 