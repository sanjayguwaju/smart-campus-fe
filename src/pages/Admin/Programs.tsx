import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, GraduationCap, Clock, BookOpen, CheckCircle, Pencil, Layers, Award, Star } from 'lucide-react';
import { usePrograms } from '../../api/hooks/usePrograms';
import { Program } from '../../api/types/programs';
import AddProgramModal from '../../components/Admin/AddProgramModal';
import EditProgramModal from '../../components/Admin/EditProgramModal';
import DeleteProgramModal from '../../components/Admin/DeleteProgramModal';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { AxiosResponse } from 'axios';
import SummaryCard from '../../components/Admin/SummaryCard';
import { getDepartments } from '../../api/services/departmentService';

const Programs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<{ id: string; name: string } | null>(null);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);

  // Correctly type the Axios response
  const { programsQuery, createProgram, updateProgram, deleteProgram, publishProgram, unpublishProgram } = usePrograms();

  let programs: Program[] = [];
  const backendData = programsQuery.data?.data;
  if (backendData && typeof backendData === 'object' && 'data' in backendData && Array.isArray((backendData as any).data)) {
    programs = (backendData as { data: Program[] }).data;
  }
  console.log('Programs:', programs);
  const isLoading = programsQuery.isLoading;
  const error = programsQuery.error;

  // Summary metrics
  const totalPrograms = programs.length;
  const publishedPrograms = programs.filter(p => p.isPublished).length;
  const draftPrograms = programs.filter(p => p.status === 'draft').length;
  const undergradPrograms = programs.filter(p => p.level === 'undergraduate').length;
  const postgradPrograms = programs.filter(p => p.level === 'postgraduate').length;
  const professionalPrograms = programs.filter(p => p.level === 'professional').length;

  useEffect(() => {
    getDepartments().then(res => {
      setDepartments(res.data.data || []);
    });
  }, []);

  // Map department ObjectId to name for display
  const departmentMap = Object.fromEntries(departments.map(d => [d._id, d.name]));

  const filteredPrograms = programs.filter((program: Program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || program.level === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || program.department === departmentFilter;
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
  };

  const handleDelete = (program: Program) => {
    setDeletingProgram({ id: program._id, name: program.name });
  };

  const handleAdd = (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt'>) => {
    createProgram.mutate(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      }
    });
  };

  const handleEditSubmit = (id: string, data: Partial<Program>) => {
    updateProgram.mutate({ id, data }, {
      onSuccess: () => {
        setEditingProgram(null);
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (deletingProgram) {
      deleteProgram.mutate(deletingProgram.id, {
        onSuccess: () => {
          setDeletingProgram(null);
        }
      });
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'undergraduate':
        return 'bg-blue-100 text-blue-800';
      case 'postgraduate':
        return 'bg-green-100 text-green-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Published</span>;
      case 'archived':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Archived</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>;
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <SummaryCard value={totalPrograms} label="Total Programs" color="text-blue-600" icon={<Layers className="text-blue-400" />} />
        <SummaryCard value={publishedPrograms} label="Published" color="text-green-600" icon={<CheckCircle className="text-green-400" />} />
        <SummaryCard value={draftPrograms} label="Draft" color="text-gray-600" icon={<Pencil className="text-gray-400" />} />
        <SummaryCard value={undergradPrograms} label="Undergraduate" color="text-blue-500" icon={<GraduationCap className="text-blue-400" />} />
        <SummaryCard value={postgradPrograms} label="Postgraduate" color="text-purple-600" icon={<Award className="text-purple-400" />} />
        <SummaryCard value={professionalPrograms} label="Professional" color="text-yellow-600" icon={<Star className="text-yellow-400" />} />
      </div>

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="professional">Professional</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept: { _id: string; name: string }) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
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
              {filteredPrograms.length} programs found
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program: Program) => (
              <div key={program._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Program Image */}
                <img
                  src={program.image && program.image.startsWith('http') ? program.image : 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={program.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(program.level)}`}>
                          {program.level}
                        </span>
                        {getStatusBadge(program.status)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {departmentMap[program.department]}
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
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      {program.isPublished ? (
                        <button
                          onClick={() => unpublishProgram.mutate(program._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-700"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => publishProgram.mutate(program._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-700"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
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
    </div>
  );
};

export default Programs; 