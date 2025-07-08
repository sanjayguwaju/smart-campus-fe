import React, { useEffect, useState } from 'react';
import { courseService } from '../../api/services/courseService';
import { getPrograms } from '../../api/services/programService';
import { getDepartments } from '../../api/services/departmentService';
import { getUsers } from '../../api/services/userService';
import { Course, CreateCourseRequest } from '../../api/types/courses';
import { Program, DepartmentRef } from '../../api/types/programs';
import { UserData } from '../../api/types/users';
import { Plus, Edit, Trash2, MoreHorizontal, Eye, Search, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<DepartmentRef[]>([]);
  const [instructors, setInstructors] = useState<UserData[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    program: '',
    department: '',
    semester: '',
    semesterTerm: '',
    year: '',
  });
  const [form, setForm] = useState<CreateCourseRequest>({
    title: '',
    code: '',
    program: '',
    department: '',
    semester: 1,
    semesterTerm: 'Fall',
    year: new Date().getFullYear(),
    creditHours: 3,
    maxStudents: 30,
    faculty: '',
    description: '',
  });

  useEffect(() => {
    fetchAll();
  }, [currentPage]);

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

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, programsRes, departmentsRes, instructorsRes] = await Promise.all([
        courseService.getCourses({ page: currentPage, limit: pageSize }),
        getPrograms(),
        getDepartments(),
        getUsers({ role: 'faculty' })
      ]);
      
      setCourses(coursesRes.data.courses);
      setTotalPages(coursesRes.data.pagination.totalPages);
      setPrograms(programsRes.data.data || []);
      setDepartments(departmentsRes.data.data || []);
      
      const instructorsList = instructorsRes.users.slice().sort((a, b) => {
        const aName = a.fullName || a.displayName || a.name || (a.firstName ? a.firstName + ' ' + (a.lastName || '') : a.email);
        const bName = b.fullName || b.displayName || b.name || (b.firstName ? b.firstName + ' ' + (b.lastName || '') : b.email);
        return aName.localeCompare(bName);
      });
      setInstructors(instructorsList);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    await courseService.createCourse(form);
    setIsAddModalOpen(false);
    setForm({
      title: '',
      code: '',
      program: '',
      department: '',
      semester: 1,
      semesterTerm: 'Fall',
      year: new Date().getFullYear(),
      creditHours: 3,
      maxStudents: 30,
      faculty: '',
      description: '',
    });
    fetchAll();
  };

  const handleEdit = async () => {
    if (!editingCourse) return;
    await courseService.updateCourse(editingCourse._id, form);
    setIsEditModalOpen(false);
    setEditingCourse(null);
    setForm({
      title: '',
      code: '',
      program: '',
      department: '',
      semester: 1,
      semesterTerm: 'Fall',
      year: new Date().getFullYear(),
      creditHours: 3,
      maxStudents: 30,
      faculty: '',
      description: '',
    });
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await courseService.deleteCourse(id);
    fetchAll();
  };

  const handleViewCourse = (course: Course) => {
    // Implement view course functionality
    console.log('View course:', course);
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage all courses in the system</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
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
            <select
              value={filters.program}
              onChange={(e) => setFilters(f => ({ ...f, program: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program._id} value={program._id}>{program.name}</option>
              ))}
            </select>
            <button 
              onClick={() => {/* TODO: Add filter drawer */}}
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
              {courses.length} courses found
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.program?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.department?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {`${course.semester} - ${course.semesterTerm} ${course.year}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.creditHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.faculty?.fullName || course.faculty?.displayName || (course.faculty?.firstName ? course.faculty.firstName + ' ' + (course.faculty.lastName || '') : course.faculty?.email)}
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
                                setEditingCourse(course);
                                setForm({
                                  title: course.title,
                                  code: course.code,
                                  program: course.program._id,
                                  department: course.department._id,
                                  semester: course.semester,
                                  semesterTerm: course.semesterTerm,
                                  year: course.year,
                                  creditHours: course.creditHours,
                                  maxStudents: course.maxStudents,
                                  faculty: course.faculty._id,
                                  description: course.description,
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit Course
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleDelete(course._id);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
                  {Math.min(currentPage * pageSize, courses.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{courses.length}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isAddModalOpen ? 'Add Course' : 'Edit Course'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (isAddModalOpen) {
                          await handleAdd();
                        } else {
                          await handleEdit();
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            name="title"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Code</label>
                          <input
                            name="code"
                            value={form.code}
                            onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Program</label>
                          <select
                            name="program"
                            value={form.program}
                            onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select Program</option>
                            {programs.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Department</label>
                          <select
                            name="department"
                            value={form.department}
                            onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                              <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Semester</label>
                            <input
                              name="semester"
                              type="number"
                              min={1}
                              max={12}
                              value={form.semester}
                              onChange={e => setForm(f => ({ ...f, semester: Number(e.target.value) }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Term</label>
                            <select
                              name="semesterTerm"
                              value={form.semesterTerm}
                              onChange={e => setForm(f => ({ ...f, semesterTerm: e.target.value as Course['semesterTerm'] }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">Select Term</option>
                              <option value="Fall">Fall</option>
                              <option value="Spring">Spring</option>
                              <option value="Summer">Summer</option>
                              <option value="Winter">Winter</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <input
                              name="year"
                              type="number"
                              min={2020}
                              max={2030}
                              value={form.year}
                              onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Credit Hours</label>
                            <input
                              name="creditHours"
                              type="number"
                              min={1}
                              max={6}
                              value={form.creditHours}
                              onChange={e => setForm(f => ({ ...f, creditHours: Number(e.target.value) }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max Students</label>
                          <input
                            name="maxStudents"
                            type="number"
                            min={1}
                            max={200}
                            value={form.maxStudents}
                            onChange={e => setForm(f => ({ ...f, maxStudents: Number(e.target.value) }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Instructor</label>
                          <select
                            name="faculty"
                            value={form.faculty}
                            onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select Instructor</option>
                            {instructors.map(f => (
                              <option key={f._id} value={f._id}>
                                {f.fullName || f.displayName || f.name || (f.firstName ? f.firstName + ' ' + (f.lastName || '') : f.email)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {isAddModalOpen ? 'Add Course' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddModalOpen(false);
                              setIsEditModalOpen(false);
                              setEditingCourse(null);
                              setForm({
                                title: '',
                                code: '',
                                program: '',
                                department: '',
                                semester: 1,
                                semesterTerm: 'Fall',
                                year: new Date().getFullYear(),
                                creditHours: 3,
                                maxStudents: 30,
                                faculty: '',
                                description: '',
                              });
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses; 