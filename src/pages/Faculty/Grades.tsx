import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock,
  Calculator,
  Filter,
  Upload,
  User,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFacultyCourseGrades, useAutoCalculateGrades, useBulkSubmitGrades } from '../../api/hooks/useCourseGrades';
import { useAssignedFacultyCourses } from '../../api/hooks/useCourses';
import { useStudentsByFaculty } from '../../api/hooks/useUsers';
import { useCreateCourseGrade, useUpdateCourseGrade } from '../../api/hooks/useCourseGrades';
import { toast } from 'react-hot-toast';

const Grades: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'grades' | 'students'>('grades');
  const [filters, setFilters] = useState<{
    semester?: number;
    academicYear?: string;
    status?: 'draft' | 'submitted' | 'approved' | 'disputed' | 'final';
  }>({
    semester: undefined,
    academicYear: undefined,
    status: undefined
  });
  const [isAutoCalculateModalOpen, setIsAutoCalculateModalOpen] = useState(false);
  const [selectedGradesForBulk, setSelectedGradesForBulk] = useState<string[]>([]);
  const [isStudentGradeModalOpen, setIsStudentGradeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // API hooks
  const { data: gradesData, isLoading: gradesLoading, refetch: refetchGrades } = useFacultyCourseGrades(1, 100, filters);
  const { data: coursesData, isLoading: coursesLoading } = useAssignedFacultyCourses(
    user?._id || '', 
    1, 
    100
  );
  const { data: studentsData, isLoading: studentsLoading } = useStudentsByFaculty(
    user?._id || '',
    1,
    100
  );
  const autoCalculateGradesMutation = useAutoCalculateGrades();
  const bulkSubmitGradesMutation = useBulkSubmitGrades();
  const createCourseGradeMutation = useCreateCourseGrade();
  const updateCourseGradeMutation = useUpdateCourseGrade();

  const grades = gradesData?.grades || [];
  const courses = coursesData?.courses || [];
  const students = studentsData?.students || [];

  // Filter students by selected course
  const courseStudents = selectedCourse 
    ? students.filter(student => 
        student.courses.some(course => course._id === selectedCourse)
      )
    : students;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'final': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <Award className="h-4 w-4" />;
      case 'final': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStudentGrade = (student: any) => {
    setSelectedStudent(student);
    setIsStudentGradeModalOpen(true);
  };

  const handleAutoCalculate = async (courseId: string) => {
    try {
      await autoCalculateGradesMutation.mutateAsync({
        courseId,
        data: {
          semester: filters.semester || 1,
          academicYear: filters.academicYear || '2024-2025'
        }
      });
      refetchGrades();
    } catch (error) {
      console.error('Auto calculate error:', error);
    }
  };

  const handleBulkSubmit = async () => {
    if (selectedGradesForBulk.length === 0) {
      toast.error('Please select grades to submit');
      return;
    }

    try {
      await bulkSubmitGradesMutation.mutateAsync({
        courseId: selectedCourse,
        data: {
          gradeIds: selectedGradesForBulk
        }
      });
      setSelectedGradesForBulk([]);
      refetchGrades();
    } catch (error) {
      console.error('Bulk submit error:', error);
    }
  };

  const handleGradeSelection = (gradeId: string) => {
    setSelectedGradesForBulk(prev => 
      prev.includes(gradeId) 
        ? prev.filter(id => id !== gradeId)
        : [...prev, gradeId]
    );
  };

  const filteredGrades = selectedCourse 
    ? grades.filter(grade => grade.course._id === selectedCourse)
    : grades;

  const courseStats = courses.map(course => {
    const courseGrades = grades.filter(grade => grade.course._id === course._id);
    const gradedCount = courseGrades.filter(grade => grade.status === 'final').length;
    const totalCount = courseGrades.length;
    
    return {
      ...course,
      gradedCount,
      totalCount,
      percentage: totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0
    };
  });

  if (gradesLoading || coursesLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Manage grades and students for your assigned courses</p>
          {courses.length === 0 && !coursesLoading && (
            <p className="text-sm text-blue-600 mt-1">
              You don't have any courses assigned yet. Contact your administrator to get courses assigned.
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsAutoCalculateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Calculator className="h-4 w-4" />
            <span>Auto Calculate</span>
          </button>
          {activeTab === 'grades' && (
          <button
            onClick={handleBulkSubmit}
              disabled={selectedGradesForBulk.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Submit ({selectedGradesForBulk.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Assigned Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>

          <select
            value={filters.semester || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              semester: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>

          <select
            value={filters.academicYear || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              academicYear: e.target.value || undefined 
            }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Years</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              status: e.target.value as 'draft' | 'submitted' | 'approved' | 'disputed' | 'final' | undefined 
            }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'grades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Grades</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Students ({courseStudents.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Course Statistics */}
      {activeTab === 'grades' && (
        <>
          {courses.length === 0 && !coursesLoading ? (
            <div className="col-span-full">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
              </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Assigned</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any courses assigned to you yet. Once courses are assigned by an administrator, 
                  you'll be able to manage grades for those courses here.
                </p>
                <div className="text-sm text-gray-500">
                  Contact your department administrator to get courses assigned.
              </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseStats.map(course => (
                <div key={course._id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <span className="text-sm text-gray-500">{course.code}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Graded:</span>
                      <span className="font-medium">{course.gradedCount}/{course.totalCount}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">{course.percentage}%</span>
        </div>
      </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAutoCalculate(course._id)}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                    >
                      Auto Calculate
                    </button>
                    <button
                      onClick={() => setSelectedCourse(course._id)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                    >
                      View Grades
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {/* Grades Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCourse ? 'Course Grades' : 'All Grades'} 
                {filteredGrades.length > 0 && ` (${filteredGrades.length})`}
              </h2>
            </div>

            {filteredGrades.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No grades found for the selected filters</p>
          </div>
            ) : (
    <div className="overflow-x-auto">
                <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedGradesForBulk.length === filteredGrades.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGradesForBulk(filteredGrades.map(grade => grade._id));
                            } else {
                              setSelectedGradesForBulk([]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
          </tr>
        </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGrades.map(grade => (
                  <tr key={grade._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedGradesForBulk.includes(grade._id)}
                            onChange={() => handleGradeSelection(grade._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                          <div className="text-sm font-medium text-gray-900">
                            {grade.student.firstName} {grade.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{grade.student.studentId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{grade.course.name}</div>
                            <div className="text-sm text-gray-500">{grade.course.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.finalGrade)}`}>
                            {grade.finalGrade} ({grade.numericalGrade}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(grade.status)}`}>
                        {getStatusIcon(grade.status)}
                            <span className="ml-1">{grade.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grade.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            disabled
                            title="Edit functionality coming soon"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
            )}
        </div>
        </>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCourse ? 'Enrolled Students' : 'All Students'} 
              {courseStudents.length > 0 && ` (${courseStudents.length})`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage grades, attendance, and feedback for enrolled students
            </p>
          </div>
          
          {courseStudents.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCourse 
                  ? 'No students enrolled in this course' 
                  : 'No students found. Select a course to view enrolled students.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courseStudents.map(student => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
              </div>
            </div>
          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student._id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.courses.length} courses
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.courses.slice(0, 2).map(course => course.code).join(', ')}
                          {student.courses.length > 2 && '...'}
              </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.courses.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.enrollmentStatus === 'active' ? 'bg-green-100 text-green-800' :
                          student.enrollmentStatus === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.enrollmentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleStudentGrade(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Manage Grades"
                        >
                          <GraduationCap className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="View Profile"
                        >
                          <User className="h-4 w-4" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="View Courses"
                        >
                          <BookOpen className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Auto Calculate Modal */}
      {isAutoCalculateModalOpen && (
        <AutoCalculateModal
          isOpen={isAutoCalculateModalOpen}
          onClose={() => setIsAutoCalculateModalOpen(false)}
          courses={courses}
          onCalculate={handleAutoCalculate}
        />
      )}

      {/* Student Grade Modal */}
      {isStudentGradeModalOpen && selectedStudent && (
        <StudentGradeModal
          isOpen={isStudentGradeModalOpen}
          onClose={() => {
            setIsStudentGradeModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          selectedCourse={selectedCourse}
          courses={courses}
          onCreateGrade={createCourseGradeMutation}
          onUpdateGrade={updateCourseGradeMutation}
        />
      )}
  </div>
);
};

// Auto Calculate Modal Component
const AutoCalculateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  courses: Array<{
    _id: string;
    name: string;
    code: string;
  }>;
  onCalculate: (courseId: string) => void;
}> = ({ isOpen, onClose, courses, onCalculate }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [semester, setSemester] = useState('1');
  const [academicYear, setAcademicYear] = useState('2024-2025');

  const handleCalculate = () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }
    onCalculate(selectedCourse);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Auto Calculate Grades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
            </select>
          </div>
          
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Calculator className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Auto Calculation</h4>
                <p className="text-sm text-blue-700 mt-1">
                  This will automatically calculate grades based on assignment submissions and weights.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Calculate Grades
            </button>
          </div>
      </div>
    </div>
  );
};

// Student Grade Modal Component
const StudentGradeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  student: any;
  selectedCourse: string;
  courses: any[];
  onCreateGrade: any;
  onUpdateGrade: any;
}> = ({ isOpen, onClose, student, selectedCourse, courses, onCreateGrade }) => {
  const [formData, setFormData] = useState({
    course: selectedCourse || '',
    semester: 1,
    academicYear: '2024-2025',
    finalGrade: '',
    numericalGrade: 0,
    credits: 3,
    attendance: 0,
    participation: 0,
    facultyComments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter courses to only show courses the student is enrolled in
  const enrolledCourses = courses.filter(course => 
    student.courses.some((studentCourse: any) => studentCourse._id === course._id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course || !formData.finalGrade) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const gradeData = {
        student: student._id,
        course: formData.course,
        semester: formData.semester,
        academicYear: formData.academicYear,
        finalGrade: formData.finalGrade,
        numericalGrade: formData.numericalGrade,
        credits: formData.credits,
        attendance: formData.attendance,
        participation: formData.participation,
        facultyComments: formData.facultyComments
      };

      await onCreateGrade.mutateAsync(gradeData);
      toast.success('Grade submitted successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manage Student Grade</h2>
              <p className="text-sm text-gray-600">
                {student.firstName} {student.lastName} - {student.studentId || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <span className="text-gray-500">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={enrolledCourses.length === 0}
                  >
                    <option value="">
                      {enrolledCourses.length === 0 
                        ? 'No enrolled courses found' 
                        : 'Select a course'
                      }
                    </option>
                    {enrolledCourses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                  {enrolledCourses.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      This student is not enrolled in any of your assigned courses.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Grading Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Grade</label>
                  <select
                    value={formData.finalGrade}
                    onChange={(e) => setFormData(prev => ({ ...prev, finalGrade: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select grade</option>
                    <option value="A+">A+ (97-100)</option>
                    <option value="A">A (93-96)</option>
                    <option value="A-">A- (90-92)</option>
                    <option value="B+">B+ (87-89)</option>
                    <option value="B">B (83-86)</option>
                    <option value="B-">B- (80-82)</option>
                    <option value="C+">C+ (77-79)</option>
                    <option value="C">C (73-76)</option>
                    <option value="C-">C- (70-72)</option>
                    <option value="D+">D+ (67-69)</option>
                    <option value="D">D (63-66)</option>
                    <option value="D-">D- (60-62)</option>
                    <option value="F">F (0-59)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numerical Grade (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.numericalGrade}
                    onChange={(e) => setFormData(prev => ({ ...prev, numericalGrade: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendance: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participation (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.participation}
                    onChange={(e) => setFormData(prev => ({ ...prev, participation: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Semester Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h3>
              <textarea
                value={formData.facultyComments}
                onChange={(e) => setFormData(prev => ({ ...prev, facultyComments: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Provide detailed feedback for the student..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.facultyComments.length}/1000 characters
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Grade</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grades; 