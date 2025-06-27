import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, BookOpen, Users, Download, Search, Filter, ChevronDown, Star, Award, Calendar, MapPin } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { Program } from '../types';

const Programs: React.FC = () => {
  const { programs, loadPrograms, createProgram, updateProgram, deleteProgram, joinProgram } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Add a list of instructor names for the dropdown
  const instructorNames = [
    'Dr. Sushant Bhattarai',
    'Prof. Anjali Sharma',
    'Dr. Ramesh Koirala',
    'Prof. Priya Singh',
    'Dr. Amit Joshi',
    'Prof. Sunita Shrestha',
    'Dr. Binod Chaudhary',
    'Prof. Meena Gurung',
    'Dr. Rajesh Adhikari',
    'Prof. Laxmi Pandey',
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    loadPrograms()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadPrograms, isAuthenticated, navigate]);

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

  const filteredPrograms = Array.isArray(programs) ? programs.filter(program => {
    if (!program || typeof program !== 'object') return false;
    const name = program.title || '';
    const description = program.description || '';
    const department = program.department || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    const matchesDepartment = selectedDepartment === 'all' || program.department === selectedDepartment;
    return matchesSearch && matchesLevel && matchesDepartment;
  }) : [];

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

  // Role helpers
  const isFacultyOrAdmin = user && (user.role === 'faculty' || user.role === 'admin');
  const isStudent = user && user.role === 'student';

  // Debug: Log current user and role
  console.log('Current user:', user);

  // Modal form state
  const [form, setForm] = useState({
    title: '',
    code: '',
    instructor: '',
    credits: 1,
    semester: 'Fall',
    year: 2024,
    maxStudents: 30,
    department: '',
    level: 'undergraduate',
    duration: '',
    startDate: '',
    description: '',
    prerequisites: [],
    image: '',
    brochureUrl: '',
  });
  
  const openCreateModal = () => {
    setEditProgram(null);
    setForm({
      title: '',
      code: '',
      instructor: '',
      credits: 1,
      semester: 'Fall',
      year: 2024,
      maxStudents: 30,
      department: '',
      level: 'undergraduate',
      duration: '',
      startDate: '',
      description: '',
      prerequisites: [],
      image: '',
      brochureUrl: '',
    });
    setShowModal(true);
    setModalError(null);
  };

  const openEditModal = (program: Program) => {
    setEditProgram(program);
    setForm({
      title: program.title || '',
      code: program.code || '',
      instructor: program.instructor || '',
      credits: program.credits || 1,
      semester: program.semester || 'Fall',
      year: program.year || 2024,
      maxStudents: program.maxStudents || 30,
      department: program.department || '',
      level: program.level || 'undergraduate',
      duration: program.duration || '',
      description: program.description || '',
      prerequisites: program.prerequisites || [],
      image: program.image || '',
      brochureUrl: program.brochureUrl || '',
    });
    setShowModal(true);
    setModalError(null);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    try {
      const payload = {
        title: form.title,
        code: form.code,
        instructor: form.instructor,
        credits: form.credits,
        semester: form.semester as 'Fall' | 'Spring' | 'Summer' | 'Winter',
        year: form.year,
        maxStudents: form.maxStudents,
        department: form.department,
        description: form.description,
        // Optional fields:
        level: form.level as 'undergraduate' | 'postgraduate' | 'professional',
        duration: form.duration,
        prerequisites: form.prerequisites,
        image: form.image,
        brochureUrl: form.brochureUrl,
      };
      if (editProgram) {
        await updateProgram(editProgram.id, payload);
      } else {
        await createProgram(payload);
      }
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || 'Failed to save program');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await deleteProgram(id);
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await joinProgram(id);
      alert('You have joined the program!');
    } catch (err: any) {
      alert(err.message || 'Failed to join program');
    }
  };

  // Place the modal here, just before the main return
  const modal = showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-0">
        {/* Sticky header with close button */}
        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-8 py-4 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-2xl font-bold">{editProgram ? 'Edit Program' : 'Create Program'}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-3xl text-gray-400 hover:text-gray-600 font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-8 py-6">
          {modalError && <div className="mb-4 text-red-600">{modalError}</div>}
          <form onSubmit={handleModalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <select
                  name="instructor"
                  value={form.instructor}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto"
                  required
                >
                  <option value="">Select Instructor</option>
                  {instructorNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                <input name="credits" type="number" min={1} max={6} value={form.credits} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select name="semester" value={form.semester} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input name="year" type="number" min={2020} max={2030} value={form.year} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                <input name="maxStudents" type="number" min={1} max={200} value={form.maxStudents} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input name="department" value={form.department} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select name="level" value={form.level} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input name="duration" value={form.duration} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                <input name="brochureUrl" value={form.brochureUrl} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 text-right pt-2">
              <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                {editProgram ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <>
        {modal}
        <div className="max-w-4xl mx-auto py-8 text-center text-lg">You must be logged in to view programs.</div>
      </>
    );
  }
  if (loading) {
    return (
      <>
        {modal}
        <div className="max-w-4xl mx-auto py-8 text-center text-lg">Loading programs...</div>
      </>
    );
  }
  if (error) {
    return (
      <>
        {modal}
        <div className="max-w-4xl mx-auto py-8 text-center text-red-600">{error}</div>
      </>
    );
  }
  if (!programs || programs.length === 0) {
    return (
      <>
        {modal}
        {/* DEBUG: Show current user role and isFacultyOrAdmin */}
        <div style={{ background: '#ffeeba', color: '#856404', padding: '10px', borderRadius: '6px', margin: '16px 0', fontWeight: 'bold', textAlign: 'center' }}>
          Debug: user.role = {user?.role?.toString() || 'N/A'} | isFacultyOrAdmin = {isFacultyOrAdmin ? 'true' : 'false'}
        </div>
        {/* Show Create Program button only for faculty or admin */}
        {isFacultyOrAdmin && (
          <div className="mb-6 text-right">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              + Create Program
            </button>
          </div>
        )}
        <div className="max-w-4xl mx-auto py-8 text-center text-gray-600">No programs found.</div>
      </>
    );
  }

  return (
    <>
      {modal}
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

          {/* Show Create Program button only for faculty or admin */}
          {isFacultyOrAdmin && (
            <div className="mb-6 text-right">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                + Create Program
              </button>
            </div>
          )}

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

          {/* Program Cards */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-lg">
              No programs match your search or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="h-8 w-8 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold">{program.title}</h2>
                  </div>
                  <div className="text-gray-600 mb-2">{program.department}</div>
                  <div className="text-gray-500 mb-2">Level: {program.level}</div>
                  <div className="text-gray-500 mb-2">Duration: {program.duration}</div>
                  <div className="flex-1 text-gray-700 mb-4 line-clamp-2">{program.description}</div>
                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Details
                  </button>
                  {isFacultyOrAdmin && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openEditModal(program)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {isStudent && (
                    <button
                      onClick={() => handleJoin(program.id)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                    >
                      Join Program
                    </button>
                  )}
                </div>
              ))}
            </div>
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
                {programs.filter(p => p.level === 'undergraduate').length}
              </div>
              <div className="text-gray-600">Undergraduate</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {programs.filter(p => p.level === 'postgraduate').length}
              </div>
              <div className="text-gray-600">Postgraduate</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Set(programs.map(p => p.department)).size}
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
                      src={selectedProgram.image || 'https://via.placeholder.com/600x200?text=No+Image'}
                      alt={selectedProgram.title || 'Program'}
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
                          {selectedProgram.title || 'Untitled Program'}
                        </h2>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getLevelColor(selectedProgram.level || 'undergraduate')}`}>
                            {(selectedProgram.level && typeof selectedProgram.level === 'string')
                              ? selectedProgram.level.charAt(0).toUpperCase() + selectedProgram.level.slice(1)
                              : 'N/A'}
                          </span>
                          <span className="text-gray-600">{selectedProgram.department || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Overview</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {selectedProgram.description || 'No description available.'}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="text-gray-700">Duration: {selectedProgram.duration || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="text-gray-700">Department: {selectedProgram.department || 'N/A'}</span>
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
                          {Array.isArray(selectedProgram.prerequisites) && selectedProgram.prerequisites.length > 0 ? (
                            selectedProgram.prerequisites.map((prereq, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                <span className="text-gray-700">{typeof prereq === 'string' ? prereq : (prereq?.title || prereq?.code || 'Unknown')}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">No prerequisites listed.</span>
                          )}
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
        </div>
      </div>
    </>
  );
};

export default Programs;