import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select, { StylesConfig } from 'react-select';
import { useDebounce } from '@uidotdev/usehooks';
import { useAssignedFacultyCourses, useDeleteCourse } from '../../api/hooks/useCourses';
import { CourseData } from '../../api/types/courses';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import { 
  AddCourseModal, 
  EditCourseModal, 
  DeleteCourseModal, 
  ViewCourseModal, 
  CoursesFilterDrawer 
} from '../../components/Faculty/Courses';

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const Courses: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<CourseData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseForDelete, setSelectedCourseForDelete] = useState<CourseData | null>(null);
  const [isViewCourseModalOpen, setIsViewCourseModalOpen] = useState(false);
  const [selectedCourseForView, setSelectedCourseForView] = useState<CourseData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    department: '',
    instructor: '',
    semester: '',
    academicYear: '',
    status: ''
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Status filter options
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
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
  const { data, isLoading, error } = useAssignedFacultyCourses(
    user?._id || '',
    currentPage,
    pageSize,
    debouncedSearchTerm,
    filters
  );
  const deleteCourseMutation = useDeleteCourse();

  // Extract courses and pagination from data
  const courses = data?.courses || [];
  const pagination = data?.pagination;

  // Get unique departments from courses
  const departments = Array.from(new Set(courses.map((course: CourseData) => {
    if (typeof course.department === 'string') {
      return course.department;
    }
    // Handle case where department might be an object
    const deptObj = course.department as { _id: string; name?: string; fullName?: string };
    return deptObj?.name || deptObj?.fullName || '';
  }).filter(Boolean))) as string[];

  // Use courses directly since filtering is now handled by the API
  const filteredCourses = courses;

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((course: CourseData) => course._id));
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourseMutation.mutateAsync(courseId);
      setSelectedCourseForDelete(null);
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course. Please try again.');
    }
  };

  const handleDeleteClick = (course: CourseData) => {
    setSelectedCourseForDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedCourses.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCourses.length} selected course(s)?`)) {
      try {
        // Delete courses one by one
        for (const courseId of selectedCourses) {
          await deleteCourseMutation.mutateAsync(courseId);
        }
        setSelectedCourses([]); // Clear selection after deletion
        toast.success(`${selectedCourses.length} course(s) deleted successfully`);
      } catch (error) {
        console.error('Failed to delete selected courses:', error);
        toast.error('Failed to delete some courses. Please try again.');
      }
    }
  };

  const handleEditCourse = (course: CourseData) => {
    setSelectedCourseForEdit(course);
    setIsEditCourseModalOpen(true);
  };

  const handleViewCourse = (course: CourseData) => {
    setSelectedCourseForView(course);
    setIsViewCourseModalOpen(true);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      code: '',
      department: '',
      instructor: '',
      semester: '',
      academicYear: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string, isActive?: boolean) => {
    // Handle new status field
    if (status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'inactive':
          return 'bg-red-100 text-red-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    // Fallback to isActive for backward compatibility
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCourses([]); // Clear selection when changing pages
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedCourses([]); // Clear selection
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load courses. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage all courses in the system</p>
        </div>
        <button 
          onClick={() => setIsAddCourseModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
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

      {/* Courses table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {pagination ? `${pagination.total} courses found` : `${filteredCourses.length} courses found`}
            </h3>
            {selectedCourses.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedCourses.length} selected
                </span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" onClick={handleDeleteSelected}>
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course: CourseData) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleSelectCourse(course._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {course.imageUrl ? (
                        <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={course.imageUrl}
                            alt={course.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Fallback to avatar if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center hidden">
                            <span className="text-sm font-medium text-white">
                              {course.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-white">
                            {course.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof course.department === 'string'
                      ? course.department
                      : (
                        (() => {
                          const deptObj = course.department as { _id: string; name?: string; fullName?: string };
                          return deptObj?.name || deptObj?.fullName || '-';
                        })()
                      )
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.faculty && typeof course.faculty === 'object' && 'firstName' in course.faculty
                      ? course.faculty.fullName || `${course.faculty.firstName} ${course.faculty.lastName}`
                      : course.instructorName
                        ? course.instructorName
                        : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.creditHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.fullLocation || (course.location ? `${course.location.building} - ${course.location.room}` : '-')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.currentEnrollment !== undefined && course.maxStudents !== undefined
                      ? `${course.currentEnrollment}/${course.maxStudents}`
                      : course.enrolledStudents !== undefined && course.maxStudents !== undefined
                        ? `${course.enrolledStudents}/${course.maxStudents}`
                        : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(course.status, course.isActive)}`}>
                      {course.status || (course.isActive ? 'Active' : 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="relative inline-block dropdown-container">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === course._id ? null : course._id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        title="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {openDropdown === course._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleViewCourse(course);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleEditCourse(course);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit Course
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleDeleteClick(course);
                              }}
                              disabled={deleteCourseMutation.isPending}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Delete Course
                            </button>
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

      {/* Add Course Modal */}
      <AddCourseModal 
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
      />

      {/* Edit Course Modal */}
      <EditCourseModal 
        isOpen={isEditCourseModalOpen}
        onClose={() => {
          setIsEditCourseModalOpen(false);
          setSelectedCourseForEdit(null);
        }}
        course={selectedCourseForEdit}
      />

      {/* Delete Course Modal */}
      <DeleteCourseModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCourseForDelete(null);
        }}
        onDelete={() => {
          if (selectedCourseForDelete) {
            handleDeleteCourse(selectedCourseForDelete._id);
          }
        }}
        courseName={selectedCourseForDelete?.name || ''}
        isDeleting={deleteCourseMutation.isPending}
      />

      {/* View Course Modal */}
      <ViewCourseModal 
        isOpen={isViewCourseModalOpen}
        onClose={() => {
          setIsViewCourseModalOpen(false);
          setSelectedCourseForView(null);
        }}
        course={selectedCourseForView}
      />

      {/* Filter Drawer */}
      <CoursesFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        departments={departments}
      />
    </div>
  );
};

export default Courses; 