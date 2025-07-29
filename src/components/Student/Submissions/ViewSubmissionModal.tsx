import React from 'react';
import { X, Download, FileText, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { SubmissionData } from '../../../api/types/submissions';

interface ViewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
}

const ViewSubmissionModal: React.FC<ViewSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission
}) => {
  if (!isOpen || !submission) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(1)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Assignment Title</label>
                  <p className="text-sm text-gray-900">{submission.assignment.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submission Number</label>
                  <p className="text-sm text-gray-900">#{submission.submissionNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center mt-1">
                    {submission.isLate ? (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      submission.isLate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {submission.isLate ? 'Late' : submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student Name</label>
                  <p className="text-sm text-gray-900">{submission.student.firstName} {submission.student.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{submission.student.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted At</label>
                  <p className="text-sm text-gray-900">{formatDate(submission.submittedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submitted Files</h3>
            <div className="space-y-3">
              {submission.files.map((file) => (
                <div key={file._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)} • {file.fileType}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student Comments */}
          {submission.studentComments && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Comments</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{submission.studentComments}</p>
              </div>
            </div>
          )}

          {/* Grade Information */}
          {submission.grade && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  <p className="text-2xl font-bold text-gray-900">{submission.grade}</p>
                  {submission.numericalScore && (
                    <p className="text-sm text-gray-500">{submission.numericalScore}%</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reviewed By</label>
                  <p className="text-sm text-gray-900">
                    {submission.reviewedBy ? `${submission.reviewedBy.firstName} ${submission.reviewedBy.lastName}` : 'Not reviewed'}
                  </p>
                  {submission.reviewedAt && (
                    <p className="text-xs text-gray-500">{formatDate(submission.reviewedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Criteria Scores */}
          {submission.criteriaScores && submission.criteriaScores.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Criteria Scores</h3>
              <div className="space-y-3">
                {submission.criteriaScores.map((criteria) => (
                  <div key={criteria._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{criteria.criterion}</h4>
                      <span className="text-sm text-gray-600">
                        {criteria.earnedPoints}/{criteria.maxPoints} points
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{criteria.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {submission.feedback && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">General Feedback</label>
                  <p className="text-sm text-gray-700 mt-1">{submission.feedback.general}</p>
                </div>
                {submission.feedback.strengths && submission.feedback.strengths.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Strengths</label>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                      {submission.feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {submission.feedback.improvements && submission.feedback.improvements.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Areas for Improvement</label>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                      {submission.feedback.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissionModal; 