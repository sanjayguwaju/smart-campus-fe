import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Search, ChevronDown, Heart, Share2 } from 'lucide-react';
import { usePrograms } from '../api/hooks/usePrograms';
import { Program } from '../api/types/programs';

const Programs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'department'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { programsQuery } = usePrograms();
  let programs: Program[] = [];
  const raw = programsQuery.data;
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const backendData = (raw as any).data;
    if (backendData && typeof backendData === 'object' && 'data' in backendData && Array.isArray(backendData.data)) {
      programs = backendData.data;
    }
  }
  const publishedPrograms = programs.filter((p: Program) => p.isPublished === true);

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'professional', label: 'Professional' },
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    ...Array.from(new Set(publishedPrograms.map(p => typeof p.department === 'object' && p.department !== null ? p.department._id : p.department)))
      .map(depId => {
        const depObj = publishedPrograms.find(p => typeof p.department === 'object' && p.department !== null && p.department._id === depId)?.department;
        return depObj && typeof depObj === 'object' ? { value: depObj._id, label: depObj.name } : { value: depId, label: depId };
      })
  ];

  const filteredPrograms = publishedPrograms
    .filter(program => {
      const departmentName =
        typeof program.department === 'string'
          ? program.department
          : program.department && program.department.name
            ? program.department.name
            : '';
      const matchesSearch =
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
      const matchesDepartment = selectedDepartment === 'all' || departmentName === selectedDepartment;
    return matchesSearch && matchesLevel && matchesDepartment;
    })
    .sort((a, b) => {
      const aDept =
        typeof a.department === 'string'
          ? a.department
          : a.department && a.department.name
            ? a.department.name
            : '';
      const bDept =
        typeof b.department === 'string'
          ? b.department
          : b.department && b.department.name
            ? b.department.name
            : '';
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return aDept.localeCompare(bDept);
  });

  const getLevelColor = (level: string) => {
    const colors = {
      undergraduate: 'bg-blue-100 text-blue-800',
      postgraduate: 'bg-green-100 text-green-800',
      professional: 'bg-purple-100 text-purple-800',
    };
    return colors[level as keyof typeof colors] || colors.undergraduate;
  };

  const getProgramImage = (program: Program) => {
    if (program.image && program.image.startsWith('http')) return program.image;
    return 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  // Loading state
  if (programsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (programsQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">Error loading programs</div>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Academic Programs
            </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our diverse academic programs designed to empower your future. Find the right path for your ambitions.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((department, idx) => (
                  <option key={department.value || idx} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'department')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="department">Sort by Department</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters (placeholder, not functional) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prerequisites
                    </label>
                    <input
                      type="text"
                      placeholder="Search prerequisites"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">All Programs</option>
                      <option value="open">Applications Open</option>
                      <option value="closing">Closing Soon</option>
                      <option value="closed">Applications Closed</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPrograms.map((program, index) => (
                <motion.div
                key={program._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProgram(program)}
                >
                  {/* Program Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                    src={getProgramImage(program)}
                      alt={program.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                    />
                    <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(program.level)}`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                    </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {program.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Program Details */}
                    <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {program.createdAt ? new Intl.DateTimeFormat('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      }).format(new Date(program.createdAt)) : 'Date Unavailable'}
                    </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Duration: {program.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {typeof program.department === 'object' && program.department !== null ? program.department.name : program.department}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        Level: {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-2">
                      {program.prerequisites && program.prerequisites.length > 0 ? (
                        program.prerequisites.slice(0, 2).map((prereq, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {prereq}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">None</span>
                      )}
                      {program.prerequisites && program.prerequisites.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{program.prerequisites.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        Apply Now
                      </button>
                      {program.brochureUrl && (
                      <a
                        href={program.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Download
                      </a>
                      )}
                    </div>
                  </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Programs Found */}
        {filteredPrograms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No programs found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new programs.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start your academic journey?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers through our world-class programs. Get personalized guidance from our admissions team.
          </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Schedule Consultation
            </button>
        </motion.div>
      </div>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProgram.image && selectedProgram.image.startsWith('http') ? selectedProgram.image : 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={selectedProgram.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProgram.name}</h2>
                <p className="text-gray-700 mb-6">{selectedProgram.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      {selectedProgram.createdAt ? new Intl.DateTimeFormat('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      }).format(new Date(selectedProgram.createdAt)) : 'Date Unavailable'}
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Duration: {selectedProgram.duration}
                  </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      {typeof selectedProgram.department === 'object' && selectedProgram.department !== null ? selectedProgram.department.name : selectedProgram.department}
                </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Level: {selectedProgram.level.charAt(0).toUpperCase() + selectedProgram.level.slice(1)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.prerequisites && selectedProgram.prerequisites.length > 0 ? (
                        selectedProgram.prerequisites.map((prereq, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {prereq}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">None</span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Apply Now
                  </button>
                  {selectedProgram.brochureUrl && (
                    <a
                      href={selectedProgram.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;