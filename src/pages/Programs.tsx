import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, BookOpen, Users, Download, Search, Filter, ChevronDown, Star, Award, Calendar, MapPin } from 'lucide-react';
import { usePrograms } from '../api/hooks/usePrograms';
import { Program } from '../api/types/programs';
import { useAuthStore } from '../store/authStore';
import ApplyProgramModal from '../components/common/ApplyProgramModal';
import { programService, ProgramApplication } from '../api/services/programService';
import { useEffect } from 'react';

const Programs: React.FC = () => {
  // Remove Zustand store usage
  // const { programs } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyProgram, setApplyProgram] = useState<Program | null>(null);
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [appLoading, setAppLoading] = useState(false);

  // Fetch programs from API, like Events
  const { data: programsData, isLoading, error } = usePrograms(
    1, // page
    100, // limit (adjust as needed)
    searchTerm || undefined,
    selectedDepartment !== 'all' ? selectedDepartment : undefined,
    selectedLevel !== 'all' ? selectedLevel : undefined,
    {
      refetchInterval: 3000, // auto-refresh every 3 seconds
      refetchOnWindowFocus: true, // also refresh when tab is focused
    }
  );

  // Only show published programs
  const programs = (programsData?.programs || []).filter(
    (program: Program) => program.isPublished === true && program.status === 'published'
  );

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'professional', label: 'Professional' },
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Management', label: 'Management' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Law', label: 'Law' },
    { value: 'Arts & Sciences', label: 'Arts & Sciences' },
    { value: 'Education', label: 'Education' },
    { value: 'Architecture', label: 'Architecture' },
  ];

  const filteredPrograms = programs.filter((program: Program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.department.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    const matchesDepartment = selectedDepartment === 'all' || program.department.name === selectedDepartment;
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const getLevelColor = (level: string) => {
    const colors = {
      undergraduate: 'bg-blue-100 text-blue-800 border-blue-200',
      postgraduate: 'bg-green-100 text-green-800 border-green-200',
      professional: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[level as keyof typeof colors] || colors.undergraduate;
  };

  const getLevelIcon = (level: string) => {
    const icons = {
      undergraduate: GraduationCap,
      postgraduate: Award,
      professional: Star,
    };
    return icons[level as keyof typeof icons] || GraduationCap;
  };

  // Fetch applications for the logged-in student
  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      setAppLoading(true);
      programService.getProgramApplications()
        .then(res => setApplications(res.data))
        .catch(() => setApplications([]))
        .finally(() => setAppLoading(false));
    }
  }, [isAuthenticated, user]);

  // Helper to get application status for a program
  const getAppStatus = (programId: string) => {
    const app = applications.find(a => a.program && a.program._id === programId);
    return app ? app.status : null;
  };

  // Handler for Apply Now
  const handleApplyNow = (program: Program) => {
    setApplyProgram(program);
    setShowApplyModal(true);
  };

  // Handler after successful application
  const handleApplySuccess = () => {
    setShowApplyModal(false);
    setApplyProgram(null);
    // Refresh applications
    if (isAuthenticated && user?.role === 'student') {
      programService.getProgramApplications()
        .then(res => setApplications(res.data));
    }
  };

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
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Academic Programs
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of academic programs designed to prepare you for success 
            in your chosen field. From undergraduate to professional courses, find your perfect path.
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
                {departments.map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
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

          {/* Advanced Filters */}
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
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Any Duration</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                    </select>
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
            {filteredPrograms.map((program: Program, index: number) => {
              const LevelIcon = getLevelIcon(program.level);
              
              return (
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
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(program.level)}`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2">
                        <LevelIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{program.department.name}</span>
                      </div>
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
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Duration: {program.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                        Department: {program.department.name}
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
                        {program.prerequisites.slice(0, 2).map((prereq: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {prereq}
                          </span>
                        ))}
                        {program.prerequisites.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{program.prerequisites.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {isAuthenticated && user?.role === 'student' && (
                        getAppStatus(program._id) === 'pending' ? (
                          <button className="flex-1 bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                            Pending
                          </button>
                        ) : getAppStatus(program._id) === 'verified' ? (
                          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                            Verified
                          </button>
                        ) : getAppStatus(program._id) === 'rejected' ? (
                          <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                            Rejected
                          </button>
                        ) : (
                          <button
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                            onClick={e => { e.stopPropagation(); handleApplyNow(program); }}
                          >
                            Apply Now
                          </button>
                        )
                      )}
                      {program.brochureUrl && (
                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* No Programs Found */}
        {filteredPrograms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No programs found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or explore different departments.
            </p>
          </motion.div>
        )}

        {/* Program Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {programs.length}
            </div>
            <div className="text-gray-600">Total Programs</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {programs.filter((p: Program) => p.level === 'undergraduate').length}
            </div>
            <div className="text-gray-600">Undergraduate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {programs.filter((p: Program) => p.level === 'postgraduate').length}
            </div>
            <div className="text-gray-600">Postgraduate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {new Set(programs.map((p: Program) => p.department.name)).size}
            </div>
            <div className="text-gray-600">Departments</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Academic Journey?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers through our world-class programs. 
            Get personalized guidance from our admissions team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Schedule Consultation
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Download Brochure
            </button>
          </div>
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
                  src={selectedProgram.image}
                  alt={selectedProgram.name}
                  className="w-full h-64 object-cover"
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProgram.name}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getLevelColor(selectedProgram.level)}`}>
                        {selectedProgram.level.charAt(0).toUpperCase() + selectedProgram.level.slice(1)}
                      </span>
                      <span className="text-gray-600">{selectedProgram.department.name}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Overview</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {selectedProgram.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Duration: {selectedProgram.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Department: {selectedProgram.department.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Next Intake: September 2024</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                    <div className="space-y-2 mb-6">
                      {selectedProgram.prerequisites.map((prereq: string, idx: number) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          <span className="text-gray-700">{prereq}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        Apply Now
                      </button>
                      <div className="flex space-x-3">
                        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          Save Program
                        </button>
                        {selectedProgram.brochureUrl && (
                          <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                            <Download className="h-4 w-4 mr-2" />
                            Brochure
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Program Modal */}
      <ApplyProgramModal
        open={showApplyModal}
        onClose={() => { setShowApplyModal(false); setApplyProgram(null); }}
        program={applyProgram}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default Programs;