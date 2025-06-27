import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { Program } from '../../types';
import { fetchPrograms } from '../../api';
import { useAuthStore } from '../../store/authStore';

const Programs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPrograms(token || undefined);
        // Map backend fields to frontend Program type
        const mapped = data.map((course: any) => ({
          id: course.id || course._id,
          name: course.title, // backend 'title' -> frontend 'name'
          department: course.department || '',
          level: course.level || 'undergraduate', // fallback if missing
          duration: course.duration || '', // fallback if missing
          description: course.description || '',
          prerequisites: course.prerequisites || [],
          image: course.image || '',
          brochureUrl: course.brochureUrl || '',
        }));
        setPrograms(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load programs');
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, [token]);

  const filteredPrograms = programs.filter(program => {
    if (!program || typeof program !== 'object') return false;
    const name = program.name || '';
    const description = program.description || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || program.level === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || program.department === departmentFilter;
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const handleSelectProgram = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
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

  const departments = Array.from(new Set(programs.map(p => p.department)));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600">Manage academic programs and courses</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
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
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading and error states */}
      {loading && <div className="text-center py-8 text-gray-500">Loading programs...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Programs grid */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {filteredPrograms.length} programs found
              </h3>
              {selectedPrograms.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {selectedPrograms.length} selected
                  </span>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(program.level)}`}>
                            {program.level}
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedPrograms.includes(program.id)}
                            onChange={() => handleSelectProgram(program.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {program.department}
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
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {program.brochureUrl && (
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              View Brochure
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs; 