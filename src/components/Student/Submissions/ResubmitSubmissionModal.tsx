import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUpdateSubmission } from '../../../api/hooks/useSubmissions';
import { SubmissionData } from '../../../api/types/submissions';
import MultipleImageUpload from '../../common/MultipleImageUpload';

interface ResubmitSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
}

const ResubmitSubmissionModal: React.FC<ResubmitSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission
}) => {
  const [studentComments, setStudentComments] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSubmissionMutation = useUpdateSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submission) return;

    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSubmissionMutation.mutateAsync({
        id: submission._id,
        submissionData: {
          files,
          studentComments: studentComments.trim() || undefined
        }
      });

      toast.success('Assignment resubmitted successfully');
      handleClose();
    } catch (error) {
      console.error('Failed to resubmit assignment:', error);
      toast.error('Failed to resubmit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStudentComments('');
    setFiles([]);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Resubmit Assignment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Resubmit your assignment for: {submission.assignment.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Warning */}
        <div className="p-6 border-b border-gray-200 bg-yellow-50">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Resubmitting will replace your previous submission. Make sure you have the correct files before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Submission Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Current Submission</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>{submission.files.length} file(s) submitted</span>
              </div>
              <div>
                <span className="font-medium">Submitted:</span> {new Date(submission.submittedAt).toLocaleDateString()}
              </div>
              {submission.studentComments && (
                <div>
                  <span className="font-medium">Previous Comments:</span> {submission.studentComments}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Files *
            </label>
            <MultipleImageUpload
              files={files}
              onFilesChange={setFiles}
              accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR, JPG, JPEG, PNG (Max 50MB per file)
            </p>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              id="comments"
              rows={4}
              value={studentComments}
              onChange={(e) => setStudentComments(e.target.value)}
              placeholder="Add any comments about your resubmission..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resubmitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Resubmit Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResubmitSubmissionModal;