import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock,
  BarChart3,
  Calculator,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFacultyCourseGrades, useAutoCalculateGrades, useBulkSubmitGrades } from '../../api/hooks/useCourseGrades';
import { useAssignedFacultyCourses } from '../../api/hooks/useCourses';
import { toast } from 'react-hot-toast';

const Grades: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [filters, setFilters] = useState<{
    semester?: number;
    academicYear?: string;
    status?: 'draft' | 'submitted' | 'approved' | 'disputed' | 'final';
  }>({
    semester: undefined,
    academicYear: undefined,
    status: undefined
  });
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [isAutoCalculateModalOpen, setIsAutoCalculateModalOpen] = useState(false);
  const [selectedGradesForBulk, setSelectedGradesForBulk] = useState<string[]>([]);

  // API hooks
  const { data: gradesData, isLoading: gradesLoading, refetch: refetchGrades } = useFacultyCourseGrades(1, 100, filters);
  const { data: coursesData, isLoading: coursesLoading } = useAssignedFacultyCourses(
    user?._id || '', 
    1, 
    100
  );
  const autoCalculateGradesMutation = useAutoCalculateGrades();
  const bulkSubmitGradesMutation = useBulkSubmitGrades();

  const grades = gradesData?.grades || [];
  const courses = coursesData?.courses || [];

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

  const handleEditGrade = (grade: any) => {
    setSelectedGrade(grade);
    setIsGradeModalOpen(true);
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

  if (gradesLoading || coursesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Course Grades</h1>
          <p className="text-gray-600">Manage and submit student grades for your assigned courses</p>
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
          <button
            onClick={handleBulkSubmit}
            disabled={selectedGradesForBulk.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>Bulk Submit ({selectedGradesForBulk.length})</span>
          </button>
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

      {/* Course Statistics */}
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
                        onClick={() => handleEditGrade(grade)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
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

      {/* Auto Calculate Modal */}
      {isAutoCalculateModalOpen && (
        <AutoCalculateModal
          isOpen={isAutoCalculateModalOpen}
          onClose={() => setIsAutoCalculateModalOpen(false)}
          courses={courses}
          onCalculate={handleAutoCalculate}
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

export default Grades; 