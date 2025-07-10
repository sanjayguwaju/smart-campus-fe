import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Eye, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDepartments, useDeleteDepartment } from '../../api/hooks/useDepartments';
import { Department } from '../../api/types/departments';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import AddDepartmentModal from '../../components/Admin/AddDepartmentModal';
import EditDepartmentModal from '../../components/Admin/EditDepartmentModal';
import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';

const Departments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [selectedDepartmentForEdit, setSelectedDepartmentForEdit] = useState<Department | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartmentForDelete, setSelectedDepartmentForDelete] = useState<Department | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

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

  // TanStack Query hooks
  const { data: departmentsData = [], isLoading, error } = useDepartments(debouncedSearchTerm);
  const departments: Department[] = Array.isArray(departmentsData) ? departmentsData : [];
  const deleteDepartmentMutation = useDeleteDepartment();

  // Filter and paginate departments
  const filteredAndPaginatedDepartments = useMemo(() => {
    const filtered = departments.filter((department: Department) =>
      department.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [departments, currentPage, pageSize, debouncedSearchTerm]);

  // Calculate total pages and filtered count
  const { totalPages, filteredCount } = useMemo(() => {
    const filtered = departments.filter((department: Department) =>
      department.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    return {
      totalPages: Math.ceil(filtered.length / pageSize),
      filteredCount: filtered.length
    };
  }, [departments, pageSize, debouncedSearchTerm]);

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      await deleteDepartmentMutation.mutateAsync(departmentId);
      setSelectedDepartmentForDelete(null);
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Failed to delete department:', error);
      toast.error('Failed to delete department. Please try again.');
    }
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartmentForDelete(department);
    setIsDeleteModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartmentForEdit(department);
    setIsEditDepartmentModalOpen(true);
  };

  const handleViewDepartment = (department: Department) => {
    // Implement view department functionality
    console.log('View department:', department);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (error) return <div>Error loading departments</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage all departments in the system</p>
        </div>
        <button 
          onClick={() => setIsAddDepartmentModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Department
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
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {/* TODO: Add filter drawer */}}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Departments table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredCount} departments found
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndPaginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {debouncedSearchTerm ? 'No departments found matching your search' : 'No departments found'}
                  </td>
                </tr>
              ) : (
                filteredAndPaginatedDepartments.map((department: Department) => (
                  <tr key={department._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{department.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {department.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(department.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="relative inline-block dropdown-container">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === department._id ? null : department._id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          title="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {openDropdown === department._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleViewDepartment(department);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleEditDepartment(department);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4 mr-3" />
                                Edit Department
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleDeleteClick(department);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Delete Department
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
              disabled={currentPage >= totalPages}
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
                  {Math.min(currentPage * pageSize, filteredCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredCount}</span>
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
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Page size selector */}
        <div className="bg-white px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setCurrentPage(1);
                  setPageSize(newSize);
                }}
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
      </div>

      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => setIsAddDepartmentModalOpen(false)}
      />

      <EditDepartmentModal
        isOpen={isEditDepartmentModalOpen}
        onClose={() => {
          setIsEditDepartmentModalOpen(false);
          setSelectedDepartmentForEdit(null);
        }}
        department={selectedDepartmentForEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDepartmentForDelete(null);
        }}
        onConfirm={() => {
          if (selectedDepartmentForDelete) {
            handleDeleteDepartment(selectedDepartmentForDelete._id);
          }
          setIsDeleteModalOpen(false);
        }}
        title="Delete Department"
        message={`Are you sure you want to delete the department "${selectedDepartmentForDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Departments; 