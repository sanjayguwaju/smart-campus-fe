import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useCreateAssignment } from '../../../api/hooks/useAssignments';
import { useCourses } from '../../../api/hooks/useCourses';
import { useUsers } from '../../../api/hooks/useUsers';
import { CreateAssignmentRequest, AssignmentFile, AssignmentRequirements, GradingCriterion } from '../../../api/types/assignments';
import { CourseData } from '../../../api/types/courses';
import { UserData } from '../../../api/types/users';
import LoadingSpinner from '../../Layout/LoadingSpinner';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateAssignmentRequest>({
    title: '',
    description: '',
    course: '',
    faculty: '',
    assignmentType: 'Homework',
    dueDate: '',
    extendedDueDate: '',
    files: [],
    requirements: {
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'docx', 'txt'],
      maxSubmissions: 3,
      allowLateSubmission: true,
      latePenalty: 10
    },
    gradingCriteria: [
      {
        criterion: 'Correctness',
        maxPoints: 50,
        description: 'The assignment meets all requirements and produces correct results.'
      },
      {
        criterion: 'Code Quality',
        maxPoints: 30,
        description: 'The code is well-organized, efficient, and follows best practices.'
      },
      {
        criterion: 'Documentation',
        maxPoints: 20,
        description: 'The code is properly documented with comments and explanations.'
      }
    ],
    totalPoints: 100,
    status: 'draft',
    isVisible: false,
    tags: [],
    difficulty: 'Medium',
    estimatedTime: 10
  });

  const [newTag, setNewTag] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<AssignmentFile[]>([]);

  // Hooks
  const createAssignmentMutation = useCreateAssignment();
  const { data: coursesData } = useCourses(1, 100, undefined, undefined, isOpen);
  const { data: usersData } = useUsers(1, 100, '', { role: 'faculty' }, isOpen);

  const courses = coursesData?.courses || [];
  const faculty = usersData?.users || [];

  // Select options
  const courseOptions: SelectOption[] = courses.map((course: CourseData) => ({
    value: course._id,
    label: `${course.code} - ${course.name}`
  }));

  const facultyOptions: SelectOption[] = faculty.map((user: UserData) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName}`
  }));

  const assignmentTypeOptions: SelectOption[] = [
    { value: 'Homework', label: 'Homework' },
    { value: 'Project', label: 'Project' },
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Exam', label: 'Exam' },
    { value: 'Lab', label: 'Lab' },
    { value: 'Presentation', label: 'Presentation' }
  ];

  const difficultyOptions: SelectOption[] = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];

  const fileTypeOptions: SelectOption[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
    { value: 'txt', label: 'TXT' },
    { value: 'zip', label: 'ZIP' },
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        course: '',
        faculty: '',
        assignmentType: 'Homework',
        dueDate: '',
        extendedDueDate: '',
        files: [],
        requirements: {
          maxFileSize: 10,
          allowedFileTypes: ['pdf', 'docx', 'txt'],
          maxSubmissions: 3,
          allowLateSubmission: true,
          latePenalty: 10
        },
        gradingCriteria: [
          {
            criterion: 'Correctness',
            maxPoints: 50,
            description: 'The assignment meets all requirements and produces correct results.'
          },
          {
            criterion: 'Code Quality',
            maxPoints: 30,
            description: 'The code is well-organized, efficient, and follows best practices.'
          },
          {
            criterion: 'Documentation',
            maxPoints: 20,
            description: 'The code is properly documented with comments and explanations.'
          }
        ],
        totalPoints: 100,
        status: 'draft',
        isVisible: false,
        tags: [],
        difficulty: 'Medium',
        estimatedTime: 10
      });
      setNewTag('');
      setUploadedFiles([]);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddGradingCriterion = () => {
    setFormData(prev => ({
      ...prev,
      gradingCriteria: [
        ...prev.gradingCriteria,
        {
          criterion: '',
          maxPoints: 0,
          description: ''
        }
      ]
    }));
  };

  const handleRemoveGradingCriterion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gradingCriteria: prev.gradingCriteria.filter((_, i) => i !== index)
    }));
  };

  const handleGradingCriterionChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      gradingCriteria: prev.gradingCriteria.map((criterion, i) =>
        i === index ? { ...criterion, [field]: value } : criterion
      )
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AssignmentFile[] = Array.from(files).map(file => ({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size / 1024 / 1024, // Convert to MB
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.course || !formData.faculty || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createAssignmentMutation.mutateAsync({
        ...formData,
        files: uploadedFiles
      });
      onClose();
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type
              </label>
              <Select
                value={assignmentTypeOptions.find(option => option.value === formData.assignmentType)}
                onChange={(option) => handleInputChange('assignmentType', option?.value)}
                options={assignmentTypeOptions}
                placeholder="Select assignment type"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <Select
                value={courseOptions.find(option => option.value === formData.course)}
                onChange={(option) => handleInputChange('course', option?.value)}
                options={courseOptions}
                placeholder="Select course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty *
              </label>
              <Select
                value={facultyOptions.find(option => option.value === formData.faculty)}
                onChange={(option) => handleInputChange('faculty', option?.value)}
                options={facultyOptions}
                placeholder="Select faculty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extended Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.extendedDueDate}
                onChange={(e) => handleInputChange('extendedDueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <Select
                value={difficultyOptions.find(option => option.value === formData.difficulty)}
                onChange={(option) => handleInputChange('difficulty', option?.value)}
                options={difficultyOptions}
                placeholder="Select difficulty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (hours)
              </label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={statusOptions.find(option => option.value === formData.status)}
                onChange={(option) => handleInputChange('status', option?.value)}
                options={statusOptions}
                placeholder="Select status"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => handleInputChange('isVisible', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Make visible to students
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter assignment description"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={formData.requirements.maxFileSize}
                  onChange={(e) => handleRequirementsChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Submissions
                </label>
                <input
                  type="number"
                  value={formData.requirements.maxSubmissions}
                  onChange={(e) => handleRequirementsChange('maxSubmissions', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Penalty (%)
                </label>
                <input
                  type="number"
                  value={formData.requirements.latePenalty}
                  onChange={(e) => handleRequirementsChange('latePenalty', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requirements.allowLateSubmission}
                  onChange={(e) => handleRequirementsChange('allowLateSubmission', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Allow late submissions
                </label>
              </div>
            </div>
          </div>

          {/* Grading Criteria */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Grading Criteria</h3>
              <button
                type="button"
                onClick={handleAddGradingCriterion}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.gradingCriteria.map((criterion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Criterion {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveGradingCriterion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Criterion Name
                    </label>
                    <input
                      type="text"
                      value={criterion.criterion}
                      onChange={(e) => handleGradingCriterionChange(index, 'criterion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Points
                    </label>
                    <input
                      type="number"
                      value={criterion.maxPoints}
                      onChange={(e) => handleGradingCriterionChange(index, 'maxPoints', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={criterion.description}
                    onChange={(e) => handleGradingCriterionChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Files */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload files
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    PDF, DOCX, TXT, ZIP, JPG, PNG up to 10MB
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                  accept=".pdf,.docx,.txt,.zip,.jpg,.jpeg,.png"
                />
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{file.fileName}</span>
                      <span className="ml-2 text-sm text-gray-500">({file.fileSize.toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Points
            </label>
            <input
              type="number"
              value={formData.totalPoints}
              onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAssignmentMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createAssignmentMutation.isPending ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </div>
              ) : (
                'Create Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal; 