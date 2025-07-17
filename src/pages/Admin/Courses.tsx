import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useCourses, useDeleteCourse } from '../../api/hooks/useCourses';
import { CourseData } from '../../api/types/courses';
import { 
  AddCourseModal, 
  EditCourseModal, 
  DeleteCourseModal, 
  ViewCourseModal, 
  CoursesFilterDrawer 
} from '../../components/Admin/Courses';

const Courses: React.FC = () => {
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [filters, setFilters] = useState({ 
    name: '', 
    code: '', 
    department: '', 
    instructor: '', 
    semester: '', 
    academicYear: '', 
    status: 'all' 
  });

  // Pagination and search can be added as needed
  const { data, isLoading } = useCourses(1, 20, '', filters);
  const courses = data?.courses || [];
  const deleteCourseMutation = useDeleteCourse();

  const handleDelete = async () => {
    if (!selectedCourse) return;
    await deleteCourseMutation.mutateAsync(selectedCourse._id);
    setDeleteOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 mr-2" /> Add Course
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">        {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No courses found.</td></tr>
            ) : (
              courses.map((course: CourseData) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{
                    typeof course.department === 'string'
                      ? course.department
                      : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (course.department && (course.department as any).name) || (course.department && (course.department as any).fullName) || '-'
                      )
                  }</td>
                  <td className="px-6 py-4 whitespace-nowrap">{
                    typeof course.instructor === 'string'
                      ? course.instructor
                      : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (course.instructor && (course.instructor as any).name) || (course.instructor && (course.instructor as any).fullName) || '-'
                      )
                  }</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => { setSelectedCourse(course); setViewOpen(true); }}
                      className="text-blue-600 hover:underline text-xs"
                    >View</button>
                    <button
                      onClick={() => { setSelectedCourse(course); setEditOpen(true); }}
                      className="text-yellow-600 hover:underline text-xs"
                    >Edit</button>
                    <button
                      onClick={() => { setSelectedCourse(course); setDeleteOpen(true); }}
                      className="text-red-600 hover:underline text-xs"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modals and Drawers */}
      <AddCourseModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} />
      <EditCourseModal isOpen={isEditOpen} onClose={() => setEditOpen(false)} course={selectedCourse} />
      <DeleteCourseModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onDelete={handleDelete} courseName={selectedCourse?.name || ''} isDeleting={deleteCourseMutation.isPending} />
      <ViewCourseModal isOpen={isViewOpen} onClose={() => setViewOpen(false)} course={selectedCourse} />
      <CoursesFilterDrawer isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default Courses; 