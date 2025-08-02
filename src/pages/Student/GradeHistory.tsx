import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStudentGrades } from '../../api/hooks/useCourseGrades';
import { toast } from 'react-hot-toast';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Filter,
  RefreshCw,
  Download,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap
} from 'lucide-react';

const GradeHistory: React.FC = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<{
    semester?: number;
    academicYear?: string;
    course?: string;
  }>({
    semester: undefined,
    academicYear: undefined,
    course: undefined
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API hooks
  const { data: gradesData, isLoading: gradesLoading, refetch: refetchGrades } = useStudentGrades(1, 100, filters);
  
  const grades = gradesData?.grades || [];

  // Comprehensive refresh function
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await refetchGrades();
      toast.success('Grade history refreshed successfully!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh grade history. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

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

  const handleContactFaculty = (grade: any) => {
    // TODO: Implement contact faculty functionality
    toast.success(`Contacting faculty for ${grade.course.name}...`);
  };

  const handleDownloadTranscript = () => {
    // TODO: Implement transcript download
    toast.success('Downloading transcript...');
  };

  const handleExportGrades = () => {
    // TODO: Implement grade export
    toast.success('Exporting grades...');
  };

  // Get unique courses for filter
  const uniqueCourses = Array.from(new Set(grades.map(grade => grade.course._id))).map(courseId => {
    const grade = grades.find(g => g.course._id === courseId);
    return {
      _id: courseId,
      name: grade?.course.name || '',
      code: grade?.course.code || ''
    };
  });

  // Get unique semesters and academic years
  const uniqueSemesters = Array.from(new Set(grades.map(grade => grade.semester))).sort();
  const uniqueAcademicYears = Array.from(new Set(grades.map(grade => grade.academicYear))).sort();

  if (gradesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Grade History</h1>
          <p className="text-gray-600">View your complete academic record across all semesters</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            title="Refresh grade history"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Download Transcript</span>
          </button>
          <button
            onClick={handleExportGrades}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Grades</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Grade History Information</h3>
            <p className="text-sm text-blue-700 mt-1">
              All your submitted grades are automatically saved to your permanent academic record. 
              If you have concerns about any grade, you can contact the faculty member directly.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Grades</p>
              <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">
                {grades.filter(g => g.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {grades.filter(g => g.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {uniqueCourses.length}
              </p>
            </div>
          </div>
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
            value={filters.course || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              course: e.target.value || undefined 
            }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map(course => (
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
            {uniqueSemesters.map(sem => (
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
            {uniqueAcademicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Academic Record ({grades.length} grades)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Your complete grade history across all semesters and courses
          </p>
        </div>

        {grades.length === 0 ? (
          <div className="p-8 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No grades found in your history</p>
            <p className="text-sm text-gray-400">Grades will appear here once they are submitted by your faculty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map(grade => (
                  <tr key={grade._id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Semester {grade.semester} • {grade.academicYear}
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleContactFaculty(grade)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Contact Faculty"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <BookOpen className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeHistory; 