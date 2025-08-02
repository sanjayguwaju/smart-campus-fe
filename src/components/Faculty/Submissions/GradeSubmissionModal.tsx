import React, { useState, useEffect } from 'react';
import { X, Star, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { SubmissionData } from '../../../api/types/submissions';
import { useGradeSubmission } from '../../../api/hooks/useSubmissions';
import { toast } from 'react-hot-toast';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
  onGradeSubmitted?: () => void;
}

interface GradeFormData {
  numericalScore: number;
  letterGrade: string;
  feedback: string;
  latePenalty: number;
  isLate: boolean;
}

const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
  onGradeSubmitted
}) => {
  const [formData, setFormData] = useState<GradeFormData>({
    numericalScore: 0,
    letterGrade: '',
    feedback: '',
    latePenalty: 0,
    isLate: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeSubmissionMutation = useGradeSubmission();

  // Initialize form data when submission changes
  useEffect(() => {
    if (submission) {
      setFormData({
        numericalScore: submission.numericalScore || 0,
        letterGrade: submission.grade || '',
        feedback: submission.feedback || '',
        latePenalty: submission.latePenalty || 0,
        isLate: submission.isLate || false
      });
      setErrors({});
    }
  }, [submission]);

  const getLetterGrade = (score: number): string => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleScoreChange = (value: number) => {
    const maxPoints = submission?.assignment?.totalPoints || 100;
    const clampedValue = Math.max(0, Math.min(value, maxPoints));
    const letterGrade = getLetterGrade(clampedValue);
    
    setFormData(prev => ({
      ...prev,
      numericalScore: clampedValue,
      letterGrade
    }));

    // Clear score error
    if (errors.numericalScore) {
      setErrors(prev => ({ ...prev, numericalScore: '' }));
    }
  };

  const handleLetterGradeChange = (grade: string) => {
    setFormData(prev => ({ ...prev, letterGrade: grade }));
    
    // Clear grade error
    if (errors.letterGrade) {
      setErrors(prev => ({ ...prev, letterGrade: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const maxPoints = submission?.assignment?.totalPoints || 100;

    if (formData.numericalScore < 0 || formData.numericalScore > maxPoints) {
      newErrors.numericalScore = `Score must be between 0 and ${maxPoints}`;
    }

    if (!formData.letterGrade) {
      newErrors.letterGrade = 'Letter grade is required';
    }

    if (formData.feedback.length > 1000) {
      newErrors.feedback = 'Feedback cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submission) return;

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await gradeSubmissionMutation.mutateAsync({
        submissionId: submission._id,
        gradeData: {
          numericalScore: formData.numericalScore,
          grade: formData.letterGrade,
          feedback: formData.feedback,
          latePenalty: formData.latePenalty,
          isLate: formData.isLate
        }
      });

      toast.success('Grade submitted successfully');
      onGradeSubmitted?.();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !submission) return null;

  const maxPoints = submission.assignment?.totalPoints || 100;
  const percentage = (formData.numericalScore / maxPoints) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Grade Submission</h2>
              <p className="text-sm text-gray-600">
                {submission.student.firstName} {submission.student.lastName} - {submission.assignment.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submission Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Student:</span>
                  <span className="ml-2 text-gray-900">
                    {submission.student.firstName} {submission.student.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Student ID:</span>
                  <span className="ml-2 text-gray-900">{submission.student.studentId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Assignment:</span>
                  <span className="ml-2 text-gray-900">{submission.assignment.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Max Points:</span>
                  <span className="ml-2 text-gray-900">{maxPoints}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Grading Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Numerical Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numerical Score (0 - {maxPoints})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={maxPoints}
                      step="0.1"
                      value={formData.numericalScore}
                      onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.numericalScore ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter score"
                    />
                    <div className="absolute right-3 top-2 text-sm text-gray-500">
                      / {maxPoints}
                    </div>
                  </div>
                  {errors.numericalScore && (
                    <p className="text-red-500 text-xs mt-1">{errors.numericalScore}</p>
                  )}
                  
                  {/* Score Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{formData.numericalScore} points</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Letter Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Grade
                  </label>
                  <select
                    value={formData.letterGrade}
                    onChange={(e) => handleLetterGradeChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.letterGrade ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select grade</option>
                    <option value="A+">A+ (97-100)</option>
                    <option value="A">A (93-96)</option>
                    <option value="A-">A- (90-92)</option>
                    <option value="B+">B+ (87-89)</option>
                    <option value="B">B (83-86)</option>
                    <option value="B-">B- (80-82)</option>
                    <option value="C+">C+ (77-79)</option>
                    <option value="C">C (73-76)</option>
                    <option value="C-">C- (70-72)</option>
                    <option value="D+">D+ (67-69)</option>
                    <option value="D">D (63-66)</option>
                    <option value="D-">D- (60-62)</option>
                    <option value="F">F (0-59)</option>
                  </select>
                  {errors.letterGrade && (
                    <p className="text-red-500 text-xs mt-1">{errors.letterGrade}</p>
                  )}
                  
                  {/* Grade Display */}
                  {formData.letterGrade && (
                    <div className={`mt-2 px-3 py-2 rounded-lg border ${getGradeColor(formData.letterGrade)}`}>
                      <span className="font-semibold">{formData.letterGrade}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Late Submission Handling */}
              <div className="mt-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isLate}
                      onChange={(e) => setFormData(prev => ({ ...prev, isLate: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Mark as late submission</span>
                  </label>
                  
                  {formData.isLate && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Late Penalty (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.latePenalty}
                        onChange={(e) => setFormData(prev => ({ ...prev, latePenalty: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h3>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.feedback ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Provide detailed feedback for the student..."
              />
              {errors.feedback && (
                <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formData.feedback.length}/1000 characters
              </div>
            </div>

            {/* Submission Files Preview */}
            {submission.files && submission.files.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Files</h3>
                <div className="space-y-2">
                  {submission.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">
                            {file.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Grade</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionModal; 