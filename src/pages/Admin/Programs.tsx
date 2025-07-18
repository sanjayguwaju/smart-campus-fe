import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { usePrograms, useCreateProgram, useUpdateProgram, useDeleteProgram, usePublishProgram, useUnpublishProgram } from '../../api/hooks/usePrograms';
import { useDepartments } from '../../api/hooks/useDepartments';
import { Program, ProgramPayload } from '../../api/types/programs';
import { AddProgramModal, EditProgramModal, DeleteProgramModal, ProgramsFilterDrawer } from '../../components/Admin/Programs';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Programs: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<{ id: string; name: string } | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    level: '',
    status: '',
    searchTerm: '',
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm]);

  // TanStack Query hooks with refetchInterval
  const { data, isLoading, error } = usePrograms(
    currentPage,
    pageSize,
    filters.searchTerm || undefined,
    filters.department || undefined,
    filters.level || undefined,
    {
      refetchInterval: filters.searchTerm ? 3000 : false, // Auto-refetch every 3 seconds while searching
      enabled: true, // Always enabled
    }
  );
  const createProgramMutation = useCreateProgram();
  const updateProgramMutation = useUpdateProgram();
  const deleteProgramMutation = useDeleteProgram();
  const publishProgramMutation = usePublishProgram();
  const unpublishProgramMutation = useUnpublishProgram();

  const { data: departmentsData } = useDepartments(1, 100); // Use 100 instead of 1000
  const departmentOptions = departmentsData?.departments?.map((dept: any) => ({
    value: dept._id,
    label: dept.name,
  })) || [];

  // Extract programs and pagination from data
  const programs = data?.programs || [];
  const pagination = data?.pagination;

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
  };

  const handleDelete = (program: Program) => {
    setDeletingProgram({ id: program._id, name: program.name });
  };

  const handleAdd = (data: ProgramPayload) => {
    createProgramMutation.mutate(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      }
    });
  };

  const handleEditSubmit = (id: string, data: ProgramPayload) => {
    updateProgramMutation.mutate({ id, programData: data }, {
      onSuccess: () => {
        setEditingProgram(null);
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (deletingProgram) {
      deleteProgramMutation.mutate(deletingProgram.id, {
        onSuccess: () => {
          setDeletingProgram(null);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || error?.message || 'Failed to delete program';
          toast.error(message);
        }
      });
    }
  };

  const handlePublish = async (program: Program) => {
    try {
      await publishProgramMutation.mutateAsync(program._id);
    } catch (error) {
      // Optionally handle error
    }
  };
  const handleUnpublish = async (program: Program) => {
    try {
      await unpublishProgramMutation.mutateAsync(program._id);
    } catch (error) {
      // Optionally handle error
    }
  };
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading programs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600">Manage academic programs and courses</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Program
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
                placeholder="Search programs..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Programs grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {pagination ? `${pagination.total} programs found` : `${programs.length} programs found`}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program: Program) => (
              <div key={program._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Program Image */}
                  {program.image ? (
                    <div className="mb-4">
                      <img
                        src={program.image}
                        alt={program.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback placeholder */}
                      <div className="hidden w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <p className="text-sm text-gray-500">No Image</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-sm text-gray-500">No Image</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(program.status)}`}>
                          {program.status}
                        </span>
                        {!program.isPublished && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 bg-gray-100 text-gray-800 border border-gray-200">Unpublished</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {program.department.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {program.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {program.prerequisites.length} prerequisites
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Publish/Unpublish button */}
                  <div className="flex justify-between items-center mt-4">
                    {!program.isPublished ? (
                      <button
                        onClick={() => handlePublish(program)}
                        disabled={publishProgramMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(program)}
                        disabled={unpublishProgramMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                      >
                        Unpublish
                      </button>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(program)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(program)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    Created by {program.createdBy ? `${program.createdBy.firstName} ${program.createdBy.lastName}` : 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
      
      <EditProgramModal
        isOpen={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        program={editingProgram}
        onEdit={handleEditSubmit}
      />
      
      <DeleteProgramModal
        isOpen={!!deletingProgram}
        onClose={() => setDeletingProgram(null)}
        onDelete={handleDeleteConfirm}
        programName={deletingProgram?.name || ''}
      />

      <ProgramsFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onClearFilters={() => {
          setFilters({
            department: '',
            level: '',
            status: '',
            searchTerm: '',
          });
          setCurrentPage(1);
        }}
        departmentOptions={departmentOptions}
      />
    </div>
  );
};

export default Programs; 