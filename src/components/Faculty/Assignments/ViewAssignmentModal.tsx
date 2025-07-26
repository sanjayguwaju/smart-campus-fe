import React from 'react';
import { X, Calendar, Clock, FileText, Tag, Award, Download, Eye } from 'lucide-react';
import { AssignmentData } from '../../../api/types/assignments';

interface ViewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentData | null;
}

const ViewAssignmentModal: React.FC<ViewAssignmentModalProps> = ({ isOpen, onClose, assignment }) => {
  if (!isOpen || !assignment) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'submission_closed':
        return 'bg-red-100 text-red-800';
      case 'grading':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCourseName = (course: any) => {
    if (typeof course === 'string') return course;
    return course?.name || course?.code || 'N/A';
  };

  const getFacultyName = (faculty: any) => {
    if (typeof faculty === 'string') return faculty;
    return faculty?.fullName || `${faculty?.firstName || ''} ${faculty?.lastName || ''}`.trim() || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Information */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadgeColor(assignment.difficulty)}`}>
                    {assignment.difficulty}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {assignment.assignmentType}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{assignment.totalPoints}</div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Course</div>
                      <div className="text-sm text-gray-500">{getCourseName(assignment.course)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Faculty</div>
                      <div className="text-sm text-gray-500">{getFacultyName(assignment.faculty)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Estimated Time</div>
                      <div className="text-sm text-gray-500">{assignment.estimatedTime} hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Important Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Due Date</div>
                      <div className="text-sm text-gray-500">{formatDate(assignment.dueDate)}</div>
                    </div>
                  </div>
                  {assignment.extendedDueDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Extended Due Date</div>
                        <div className="text-sm text-gray-500">{formatDate(assignment.extendedDueDate)}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Time Remaining</div>
                      <div className="text-sm text-gray-500">{assignment.timeRemaining || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {assignment.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {assignment.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submission Requirements */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900">Max File Size</div>
                <div className="text-sm text-gray-500">{assignment.requirements.maxFileSize} MB</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Max Submissions</div>
                <div className="text-sm text-gray-500">{assignment.requirements.maxSubmissions}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Allowed File Types</div>
                <div className="text-sm text-gray-500">{assignment.requirements.allowedFileTypes.join(', ')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Late Submission</div>
                <div className="text-sm text-gray-500">
                  {assignment.requirements.allowLateSubmission ? 'Allowed' : 'Not Allowed'}
                  {assignment.requirements.allowLateSubmission && ` (${assignment.requirements.latePenalty}% penalty)`}
                </div>
              </div>
            </div>
          </div>

          {/* Grading Criteria */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grading Criteria</h3>
            <div className="space-y-4">
              {assignment.gradingCriteria.map((criterion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900">{criterion.criterion}</h4>
                    <span className="text-sm font-medium text-blue-600">{criterion.maxPoints} points</span>
                  </div>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Files */}
          {assignment.files.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Files</h3>
              <div className="space-y-2">
                {assignment.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.fileName}</div>
                        <div className="text-sm text-gray-500">{file.fileSize.toFixed(2)} MB</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                        title="View file"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={file.fileUrl}
                        download
                        className="text-green-600 hover:text-green-800"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{assignment.statistics.totalSubmissions}</div>
                <div className="text-sm text-gray-500">Total Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{assignment.statistics.onTimeSubmissions}</div>
                <div className="text-sm text-gray-500">On Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{assignment.statistics.lateSubmissions}</div>
                <div className="text-sm text-gray-500">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {assignment.statistics.averageScore > 0 ? assignment.statistics.averageScore.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">Created</div>
                  <div className="text-sm text-gray-500">{formatDate(assignment.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Last Modified</div>
                  <div className="text-sm text-gray-500">{formatDate(assignment.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Visibility</div>
                  <div className="text-sm text-gray-500">
                    {assignment.isVisible ? 'Visible to students' : 'Hidden from students'}
                  </div>
                </div>
                {assignment.isOverdue !== undefined && (
                  <div>
                    <div className="text-sm font-medium text-gray-900">Status</div>
                    <div className="text-sm text-gray-500">
                      {assignment.isOverdue ? 'Overdue' : 'Active'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">Submission Rate</div>
                  <div className="text-sm text-gray-500">{assignment.submissionRate || 0}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Average Grade</div>
                  <div className="text-sm text-gray-500">{assignment.averageGrade || 'No submissions'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAssignmentModal; 