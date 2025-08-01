import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { StylesConfig, SingleValue } from 'react-select';
import { useUpdateSubmission } from '../../../api/hooks/useSubmissions';
import { UpdateSubmissionRequest, SubmissionData } from '../../../api/types/submissions';
import { useAssignments } from '../../../api/hooks/useAssignments';
import { useUsers } from '../../../api/hooks/useUsers';

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
}

interface SelectOption {
  value: string;
  label: string;
}

const EditSubmissionModal: React.FC<EditSubmissionModalProps> = ({ isOpen, onClose, submission }) => {
  const updateSubmissionMutation = useUpdateSubmission();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Fetch data for dropdowns
  const { data: assignmentsData, isLoading: assignmentsLoading } = useAssignments(1, 100, undefined, undefined, isOpen);
  const assignmentOptions = assignmentsData?.data?.map((a: { _id: string; title: string }) => ({ value: a._id, label: a.title })) || [];
  
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 100, '', { role: 'student' }, isOpen);
  const studentOptions = (usersData?.users?.map((u: { _id: string; fullName: string }) => ({ value: u._id, label: u.fullName })) || []).sort((a, b) => a.label.localeCompare(b.label));
  
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

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UpdateSubmissionRequest>({
    defaultValues: {
      files: [],
      studentComments: '',
      grade: '',
      numericalScore: undefined,
      criteriaScores: [],
      feedback: {
        general: '',
        strengths: [],
        improvements: [],
        rubric: ''
      },
      instructorNotes: '',
    }
  });

  useEffect(() => {
    if (submission) {
      setValue('studentComments', submission.studentComments || '');
      setValue('grade', submission.grade || '');
      setValue('numericalScore', submission.numericalScore);
      setValue('criteriaScores', submission.criteriaScores || []);
      setValue('feedback', submission.feedback || {
        general: '',
        strengths: [],
        improvements: [],
        rubric: ''
      });
      setValue('instructorNotes', submission.instructorNotes || '');
    }
  }, [submission, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: UpdateSubmissionRequest) => {
    if (!submission) return;
    try {
      const submissionData = {
        ...data,
        files: selectedFiles.length > 0 ? selectedFiles : undefined
      };
      await updateSubmissionMutation.mutateAsync({ id: submission._id, submissionData });
      reset();
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Failed to update submission:', error);
    }
  };

  if (!isOpen || !submission) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Submission</h2>
              <p className="text-sm text-gray-600">Update submission details and settings</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Submission Information Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Submission Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">{submission.assignment.title}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">{submission.student.firstName} {submission.student.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Date
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                      submission.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      submission.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Files</h3>
              </div>
              
              {/* Existing Files */}
              {submission.files.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Current Files:</h4>
                  <div className="space-y-2">
                    {submission.files.map((file, index) => (
                      <div key={file._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">{file.fileName}</span>
                          <span className="text-xs text-gray-500">({(file.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Files (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-edit"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <label htmlFor="file-upload-edit" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> additional files
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT, ZIP, RAR up to 10MB each</p>
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Files to Add:</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Comments
                  </label>
                  <Controller
                    name="studentComments"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                        placeholder="Student comments about the submission"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Notes
                  </label>
                  <Controller
                    name="instructorNotes"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                        placeholder="Instructor notes (internal use only)"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update Submission'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubmissionModal; 