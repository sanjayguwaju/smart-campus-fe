import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle, AlertCircle, Clock, FileText, Upload, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select, { StylesConfig } from 'react-select';
import { useDebounce } from '@uidotdev/usehooks';
import { useStudentSubmissions, useDownloadFile } from '../../api/hooks/useSubmissions';
import { SubmissionData } from '../../api/types/submissions';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { 
  ViewSubmissionModal, 
  ResubmitSubmissionModal,
  StudentSubmissionsFilterDrawer 
} from '../../components/Student/Submissions';

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

// Student-specific filter interface
interface StudentSubmissionFilters {
  status: string;
  assignment: string;
  course: string;
  isLate: boolean | undefined;
  isGraded: boolean | undefined;
}

const StudentSubmissions: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false);
  const [selectedSubmissionForView, setSelectedSubmissionForView] = useState<SubmissionData | null>(null);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [selectedSubmissionForResubmit, setSelectedSubmissionForResubmit] = useState<SubmissionData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<StudentSubmissionFilters>({
    status: '',
    assignment: '',
    course: '',
    isLate: undefined,
    isGraded: undefined
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Status filter options
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
    { value: 'late', label: 'Late' },
    { value: 'overdue', label: 'Overdue' }
  ];

  // Custom styles for React Select
  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      minHeight: '40px',
      boxShadow: 'none',
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
      zIndex: 9999
    })
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // TanStack Query hooks
  const { data, isLoading, error } = useStudentSubmissions(
    user?._id || '', 
    currentPage, 
    pageSize, 
    debouncedSearchTerm, 
    filters
  );
  const downloadFileMutation = useDownloadFile();

  // Extract submissions and pagination from data
  const submissions = data?.submissions || [];
  const pagination = data?.pagination;

  const handleViewSubmission = (submission: SubmissionData) => {
    setSelectedSubmissionForView(submission);
    setIsViewSubmissionModalOpen(true);
  };

  const handleResubmitSubmission = (submission: SubmissionData) => {
    setSelectedSubmissionForResubmit(submission);
    setIsResubmitModalOpen(true);
  };

  const handleDownloadFile = async (submissionId: string, fileId: string, fileName: string) => {
    try {
      const blob = await downloadFileMutation.mutateAsync({ submissionId, fileId });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  const handleApplyFilters = (newFilters: StudentSubmissionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      assignment: '',
      course: '',
      isLate: undefined,
      isGraded: undefined
    });
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string, isLate: boolean) => {
    if (isLate) return 'bg-red-100 text-red-800';
    
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string, isLate: boolean) => {
    if (isLate) return <AlertCircle className="h-4 w-4" />;
    
    switch (status) {
      case 'submitted':
        return <FileText className="h-4 w-4" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load your submissions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600">View and manage your assignment submissions</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              options={statusOptions}
              value={statusOptions.find(option => option.value === statusFilter)}
              onChange={(selectedOption) => {
                const newStatus = selectedOption?.value || 'all';
                setStatusFilter(newStatus);
                setFilters(prev => ({
                  ...prev,
                  status: newStatus === 'all' ? '' : newStatus
                }));
                setCurrentPage(1); // Reset to first page when status filter changes
              }}
              styles={selectStyles}
              placeholder="Select Status"
              isSearchable={false}
              className="w-full"
            />
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Submissions table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {pagination ? `${pagination.total} submissions found` : `${submissions.length} submissions found`}
            </h3>
          </div>
        </div>

        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission: SubmissionData) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-white">
                          {submission.assignment.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{submission.assignment.title}</div>
                        <div className="text-sm text-gray-500">#{submission.submissionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.assignment.course || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Course Code
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.files.length} file{submission.files.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {submission.files.reduce((total, file) => total + file.fileSize, 0).toFixed(1)} MB total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(submission.submittedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(submission.status, submission.isLate)}`}>
                      {getStatusIcon(submission.status, submission.isLate)}
                      <span className="ml-1">
                        {submission.isLate ? 'Late' : submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.grade ? (
                      <div>
                        <span className="font-medium">{submission.grade}</span>
                        {submission.numericalScore && (
                          <span className="text-gray-500 ml-1">({submission.numericalScore}%)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="relative inline-block dropdown-container">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === submission._id ? null : submission._id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        title="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {openDropdown === submission._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleViewSubmission(submission);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleResubmitSubmission(submission);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Upload className="h-4 w-4 mr-3" />
                              Resubmit
                            </button>
                            {submission.files.map((file) => (
                              <button
                                key={file._id}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleDownloadFile(submission._id, file._id, file.fileName);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Download className="h-4 w-4 mr-3" />
                                Download {file.fileName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{pagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Page size selector */}
        {pagination && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Submission Modal */}
      <ViewSubmissionModal 
        isOpen={isViewSubmissionModalOpen}
        onClose={() => {
          setIsViewSubmissionModalOpen(false);
          setSelectedSubmissionForView(null);
        }}
        submission={selectedSubmissionForView}
      />

      {/* Resubmit Submission Modal */}
      <ResubmitSubmissionModal 
        isOpen={isResubmitModalOpen}
        onClose={() => {
          setIsResubmitModalOpen(false);
          setSelectedSubmissionForResubmit(null);
        }}
        submission={selectedSubmissionForResubmit}
      />

      {/* Filter Drawer */}
      <StudentSubmissionsFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default StudentSubmissions; 