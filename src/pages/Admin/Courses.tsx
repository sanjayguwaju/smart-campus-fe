import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/services/courseService';
import { getPrograms } from '../../api/services/programService';
import { getDepartments } from '../../api/services/departmentService';
import { getUsers } from '../../api/services/userService'; // Assume this exists for fetching faculty
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    title: '',
    code: '',
    program: '',
    department: '',
    semester: '',
    semesterTerm: '',
    year: '',
    creditHours: '',
    maxStudents: '',
    instructor: '',
    description: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [coursesRes, programsRes, departmentsRes, instructorsRes] = await Promise.all([
      getCourses(),
      getPrograms(),
      getDepartments(),
      getUsers({ role: 'faculty' })
    ]);
    const coursesData = coursesRes.data.data;
    setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.courses || []);
    setPrograms(programsRes.data.data || []);
    setDepartments(departmentsRes.data.data || []);
    // Use instructorsRes.users for the list, and sort alphabetically by fullName, displayName, or name
    const instructorsList = (instructorsRes.users || []).slice().sort((a: any, b: any) => {
      const aName = a.fullName || a.displayName || a.name || (a.firstName ? a.firstName + ' ' + (a.lastName || '') : a.email);
      const bName = b.fullName || b.displayName || b.name || (b.firstName ? b.firstName + ' ' + (b.lastName || '') : b.email);
      return aName.localeCompare(bName);
    });
    setInstructors(instructorsList);
  };

  const handleAdd = async () => {
    const payload = {
      ...form,
      title: form.title,
      faculty: form.instructor,
      creditHours: Number(form.creditHours),
      year: Number(form.year),
      maxStudents: Number(form.maxStudents),
      semester: Number(form.semester),
      semesterTerm: form.semesterTerm,
    };
    await createCourse(payload);
    setIsAddModalOpen(false);
    setForm({});
    fetchAll();
  };

  const handleEdit = async () => {
    if (!editingCourse) return;
    const payload = {
      ...form,
      title: form.title,
      faculty: form.instructor,
      creditHours: Number(form.creditHours),
      year: Number(form.year),
      maxStudents: Number(form.maxStudents),
      semester: Number(form.semester),
      semesterTerm: form.semesterTerm,
    };
    await updateCourse(editingCourse._id, payload);
    setIsEditModalOpen(false);
    setEditingCourse(null);
    setForm({});
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await deleteCourse(id);
    fetchAll();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Program</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Semester</th>
              <th className="px-4 py-2 text-left">Semester Term</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Credit Hours</th>
              <th className="px-4 py-2 text-left">Max Students</th>
              <th className="px-4 py-2 text-left">Instructor</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-t">
                <td className="px-4 py-2">{course.name}</td>
                <td className="px-4 py-2">{course.code}</td>
                <td className="px-4 py-2">{course.program?.name}</td>
                <td className="px-4 py-2">{course.department?.name}</td>
                <td className="px-4 py-2">{course.semester}</td>
                <td className="px-4 py-2">{course.semesterTerm}</td>
                <td className="px-4 py-2">{course.year}</td>
                <td className="px-4 py-2">{course.creditHours}</td>
                <td className="px-4 py-2">{course.maxStudents}</td>
                <td className="px-4 py-2">
                  {course.faculty?.fullName || course.faculty?.displayName || (course.faculty?.firstName ? course.faculty.firstName + ' ' + (course.faculty.lastName || '') : course.faculty?.email)}
                </td>
                <td className="px-4 py-2">{course.description}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => { setEditingCourse(course); setForm(course); setIsEditModalOpen(true); }} className="p-2 rounded hover:bg-blue-50 text-blue-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(course._id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingCourse(null); setForm({}); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{isAddModalOpen ? 'Add Course' : 'Edit Course'}</h2>
            <form onSubmit={e => { e.preventDefault(); isAddModalOpen ? handleAdd() : handleEdit(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input name="title" value={form.title || ''} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Code</label>
                <input name="code" value={form.code || ''} onChange={e => setForm((f: any) => ({ ...f, code: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Program</label>
                <select name="program" value={form.program || ''} onChange={e => setForm((f: any) => ({ ...f, program: e.target.value }))} className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Program</option>
                  {programs.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <select name="department" value={form.department || ''} onChange={e => setForm((f: any) => ({ ...f, department: e.target.value }))} className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Department</option>
                  {departments.map((d: any) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Semester</label>
                <input
                  name="semester"
                  type="number"
                  min={1}
                  max={12}
                  value={form.semester || ''}
                  onChange={e => setForm((f: any) => ({ ...f, semester: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Semester Term</label>
                <select name="semesterTerm" value={form.semesterTerm || ''} onChange={e => setForm((f: any) => ({ ...f, semesterTerm: e.target.value }))} className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Term</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Year</label>
                <input name="year" type="number" min={2020} max={2030} value={form.year || ''} onChange={e => setForm((f: any) => ({ ...f, year: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Credit Hours</label>
                <input name="creditHours" type="number" min={1} max={6} value={form.creditHours || ''} onChange={e => setForm((f: any) => ({ ...f, creditHours: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Students</label>
                <input name="maxStudents" type="number" min={1} max={200} value={form.maxStudents || ''} onChange={e => setForm((f: any) => ({ ...f, maxStudents: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Instructor</label>
                <select name="instructor" value={form.instructor || ''} onChange={e => setForm((f: any) => ({ ...f, instructor: e.target.value }))} className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Instructor</option>
                  {instructors.map((f: any) => (
                    <option key={f._id} value={f._id}>{f.fullName || f.displayName || f.name || (f.firstName ? f.firstName + ' ' + (f.lastName || '') : f.email)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} className="w-full border rounded px-3 py-2" rows={3} required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingCourse(null); setForm({}); }} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{isAddModalOpen ? 'Add' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses; 