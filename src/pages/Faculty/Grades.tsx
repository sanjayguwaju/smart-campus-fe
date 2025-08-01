import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useFacultyCourseGrades, useCreateCourseGrade, useUpdateCourseGrade, useBulkSubmitGrades, useDeleteCourseGrade } from '../../api/hooks/useCourseGrades';

import { useAssignedFacultyCourses } from '../../api/hooks/useCourses';
import { useStudentsByFaculty } from '../../api/hooks/useUsers';
import { CourseGradeData } from '../../api/types/courseGrades';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Filter,
  RefreshCw,
  Upload,
  User
} from 'lucide-react';

const Grades: React.FC = () => {
  const { user } = useAuthStore();

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'grades' | 'students'>('grades');
  const [filters, setFilters] = useState<{
    semester?: number;
    academicYear?: string;
    status?: 'draft' | 'submitted' | 'approved' | 'disputed' | 'final';
    gradeStatus?: 'assigned' | 'not_assigned';
  }>({
    semester: undefined,
    academicYear: undefined,
    status: undefined,
    gradeStatus: undefined
  });
  const [selectedGradesForBulk, setSelectedGradesForBulk] = useState<string[]>([]);
  const [isStudentGradeModalOpen, setIsStudentGradeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedGradeForEdit, setSelectedGradeForEdit] = useState<CourseGradeData | null>(null);
  const [recentlySubmittedCount, setRecentlySubmittedCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API hooks
  const { data: gradesData, isLoading: gradesLoading, refetch: refetchGrades } = useFacultyCourseGrades(1, 100, filters);
  
  // Wrap refetchGrades to add logging
  const handleRefetchGrades = () => {
    refetchGrades();
  };

  // Comprehensive refresh function
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchGrades(),
        refetchCourses(),
        refetchStudents()
      ]);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };
  const { data: coursesData, isLoading: coursesLoading, refetch: refetchCourses } = useAssignedFacultyCourses(
    user?._id || '', 
    1, 
    100
  );
  const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents } = useStudentsByFaculty(
    user?._id || '',
    1,
    100
  );
  const bulkSubmitGradesMutation = useBulkSubmitGrades();
  const createCourseGradeMutation = useCreateCourseGrade();
  const updateCourseGradeMutation = useUpdateCourseGrade();
  const deleteCourseGradeMutation = useDeleteCourseGrade();


  const grades: CourseGradeData[] = gradesData?.grades || [];
  const courses = coursesData?.courses || [];
  const students = studentsData?.students || [];

  // Error handling for missing data
  if (studentsLoading) {
    console.log('🔄 Loading students data...');
  }
  
  if (studentsData && !studentsData.success) {
    console.error('❌ Students API Error:', studentsData.message);
  }
  
  if (coursesLoading) {
    console.log('🔄 Loading courses data...');
  }
  
  if (coursesData && !coursesData.success) {
    console.error('❌ Courses API Error:', coursesData.message);
  }

  // Filter students by selected course
  const courseStudents = selectedCourse 
    ? students.filter(student => 
        student.courses.some(course => course._id === selectedCourse)
      )
    : students;

  // Filter students based on grade status
  const filteredStudents = courseStudents.filter(student => {
    if (!filters.gradeStatus) return true;
    
    const studentGrades = selectedCourse 
      ? grades.filter((grade: CourseGradeData) => 
          grade.student._id === student._id && 
          grade.course._id === selectedCourse
        )
      : grades.filter((grade: CourseGradeData) => 
          grade.student._id === student._id
        );
    
    if (filters.gradeStatus === 'assigned') {
      return studentGrades.length > 0;
    } else if (filters.gradeStatus === 'not_assigned') {
      return studentGrades.length === 0;
    }
    
    return true;
  });

  // Calculate grade status counts
  const gradeStatusCounts = {
    assigned: courseStudents.filter(student => {
      const studentGrades = selectedCourse 
        ? grades.filter(grade => 
            grade.student._id === student._id && 
            grade.course._id === selectedCourse
          )
        : grades.filter(grade => 
            grade.student._id === student._id
          );
      return studentGrades.length > 0;
    }).length,
    notAssigned: courseStudents.filter(student => {
      const studentGrades = selectedCourse 
        ? grades.filter(grade => 
            grade.student._id === student._id && 
            grade.course._id === selectedCourse
          )
        : grades.filter(grade => 
            grade.student._id === student._id
          );
      return studentGrades.length === 0;
    }).length
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

  const handleStudentGrade = (student: any) => {
    // Check if student already has a grade for the selected course
    if (selectedCourse) {
      const studentGrades = grades.filter((grade: CourseGradeData) => 
        grade.student._id === student._id && 
        grade.course._id === selectedCourse
      );
      
      if (studentGrades.length > 0) {
        const studentGrade = studentGrades[0];
        // Allow editing even if grade is submitted - just show a warning
        if (studentGrade.status === 'submitted' || studentGrade.status === 'approved' || studentGrade.status === 'final') {
          toast.success(`Editing submitted grade for ${student.firstName} ${student.lastName}. Changes will update the existing grade.`);
        }
        
        // Set the existing grade for editing
    setSelectedStudent(student);
        setSelectedGradeForEdit(studentGrade);
        setIsStudentGradeModalOpen(true);
        return; // Exit early since we're editing an existing grade
      }
    }
    
    // If no existing grade found, create a new one
    setSelectedStudent(student);
    setSelectedGradeForEdit(null);
    setIsStudentGradeModalOpen(true);
  };



  const handleDeleteGrade = async (gradeId: string) => {
    const confirmMessage = `Are you sure you want to delete this grade? 

This action cannot be undone and will:
• Remove the grade from the system
• Create a history entry for audit purposes
• Allow you to reassign the grade if needed

You can delete grades if:
• You created the grade yourself, OR
• You are the faculty assigned to the course (for error correction)

Do you want to proceed?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteCourseGradeMutation.mutateAsync(gradeId);
        // The success message will come from the backend
      } catch (error) {
        console.error('Delete grade error:', error);
        // The error message will come from the backend
      }
    }
  };

  const handleBulkSubmit = async () => {
    if (selectedGradesForBulk.length === 0) {
      toast.error('Please select grades to submit');
      return;
    }

    // Determine courseId from selected grades if no course is selected
    let courseId = selectedCourse;
    if (!courseId) {
      const selectedGrade = grades.find(grade => selectedGradesForBulk.includes(grade._id));
      if (selectedGrade) {
        courseId = selectedGrade.course._id;
      } else {
        toast.error('Please select a course first');
        return;
      }
    }

    try {
      await bulkSubmitGradesMutation.mutateAsync({
        courseId: courseId,
        data: {
          gradeIds: selectedGradesForBulk
        }
      });
      setSelectedGradesForBulk([]);
      handleRefetchGrades();
      setRecentlySubmittedCount(selectedGradesForBulk.length);
      // Clear the count after 5 seconds
      setTimeout(() => setRecentlySubmittedCount(0), 5000);
      toast.success(`Successfully submitted ${selectedGradesForBulk.length} grades. Check the Grades tab to view them.`);
    } catch (error) {
      console.error('Bulk submit error:', error);
      toast.error('Failed to submit grades');
    }
  };

  const handleGradeSelection = (gradeId: string) => {
    setSelectedGradesForBulk((prev: string[]) => 
      prev.includes(gradeId) 
        ? prev.filter((id: string) => id !== gradeId)
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades Management</h1>
          <p className="text-gray-600">Manage student grades and view academic progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            title="Refresh all data"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh All'}</span>
          </button>
          {activeTab === 'grades' && selectedGradesForBulk.length > 0 && (
          <button
            onClick={handleBulkSubmit}
              disabled={bulkSubmitGradesMutation.isPending}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

          <select
            value={filters.gradeStatus || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              gradeStatus: e.target.value as 'assigned' | 'not_assigned' | undefined 
            }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Grade Status</option>
            <option value="assigned">Assigned Grades</option>
            <option value="not_assigned">Not Assigned Grades</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 border-b border-gray-200">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('grades')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'grades'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>Current Grades</span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  refetchGrades();
                }}
                className="p-1 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
                title="Refresh grades"
              >
                <RefreshCw className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>Students (Manage Grades)</span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  refetchStudents();
                }}
                className="p-1 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
                title="Refresh students"
              >
                <RefreshCw className="w-4 h-4" />
              </div>
            </button>


          </div>
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
              <p className="text-sm text-gray-600 mt-1">
                View and edit existing grades. Use the edit button to modify grades if needed.
              </p>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700">
                  💡 <strong>Note:</strong> Only <strong>draft</strong> grades can be edited. However, you can <strong>delete</strong> any grade if you created it or are assigned to the course (for error correction).
                </p>
              </div>
              {recentlySubmittedCount > 0 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-green-700">
                    ✅ <strong>Success!</strong> {recentlySubmittedCount} grade(s) were recently submitted and are now visible here.
                  </p>
                </div>
              )}
            </div>

            {filteredGrades.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No grades found for the selected filters</p>
                {grades.length === 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      💡 <strong>No grades visible?</strong> This could be because:
                    </p>
                    <ul className="text-sm text-blue-600 mt-2 list-disc list-inside space-y-1">
                      <li>No courses are assigned to you yet</li>
                      <li>No grades have been submitted for your courses</li>
                      <li>Students haven't been enrolled in your courses</li>
                    </ul>
                    <p className="text-sm text-blue-600 mt-2">
                      Use the "Students" tab to assign grades to enrolled students.
                    </p>
                  </div>
                )}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteGrade(grade._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete grade"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCourse ? 'Enrolled Students' : 'All Students'} 
              {filteredStudents.length > 0 && ` (${filteredStudents.length})`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedCourse 
                ? 'Students enrolled in the selected course. Click on a student to manage their grades.'
                : students.length > 0 
                  ? 'All students assigned to your courses. Select a course to filter or click on a student to manage their grades.'
                  : 'No students found. Select a course to view enrolled students.'
              }
            </p>
            {selectedCourse && (
              <div className="flex space-x-4 mt-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Assigned Grades: <span className="font-medium text-green-600">{gradeStatusCounts.assigned}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Not Assigned: <span className="font-medium text-red-600">{gradeStatusCounts.notAssigned}</span></span>
                </div>
              </div>
            )}
            {selectedCourse && gradeStatusCounts.assigned > 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Grade details are now visible here. Use the <strong>Grades tab</strong> to view existing grades or perform bulk operations.
                </p>
              </div>
            )}
            {selectedCourse && gradeStatusCounts.assigned === 0 && gradeStatusCounts.notAssigned > 0 && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-700">
                  ✅ <strong>All students are ready for new grades!</strong> No grades are currently assigned. You can now assign grades to students.
                </p>
              </div>
            )}
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {selectedCourse 
                  ? 'No students enrolled in this course' 
                  : 'No students found. Select a course to view enrolled students.'
                }
              </p>
              {!selectedCourse && students.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    💡 <strong>No students visible?</strong> This could be because:
                  </p>
                  <ul className="text-sm text-blue-600 mt-2 list-disc list-inside space-y-1">
                    <li>No courses are assigned to you yet</li>
                    <li>Students haven't been enrolled in your courses</li>
                    <li>Enrollments are not active for the current semester</li>
                  </ul>
                  <p className="text-sm text-blue-600 mt-2">
                    Contact your department administrator to get courses assigned or check enrollment status.
                  </p>
                </div>
              )}
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
                      Grade Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (() => {
                            const studentGrades = selectedCourse 
                              ? grades.filter(grade => 
                                  grade.student._id === student._id && 
                                  grade.course._id === selectedCourse
                                )
                              : grades.filter(grade => 
                                  grade.student._id === student._id
                                );
                            return studentGrades.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                          })()
                        }`}>
                          {(() => {
                            const studentGrades = selectedCourse 
                              ? grades.filter(grade => 
                                  grade.student._id === student._id && 
                                  grade.course._id === selectedCourse
                                )
                              : grades.filter(grade => 
                                  grade.student._id === student._id
                                );
                            return studentGrades.length > 0 ? 'Assigned' : 'Not Assigned';
                          })()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const studentGrades = selectedCourse 
                            ? grades.filter(grade => 
                                grade.student._id === student._id && 
                                grade.course._id === selectedCourse
                              )
                            : grades.filter(grade => 
                                grade.student._id === student._id
                              );
                          
                          if (studentGrades.length === 0) {
                            return <span className="text-sm text-gray-500">No grade assigned</span>;
                          }
                          
                          const grade = studentGrades[0]; // Show the first grade
                          return (
                            <div className="text-sm">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.finalGrade)}`}>
                                  {grade.finalGrade}
                                </span>
                                <span className="text-gray-600">({grade.numericalGrade})</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {grade.status} • {grade.semester} • {grade.academicYear}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(() => {
                          const studentGrades = selectedCourse 
                            ? grades.filter(grade => 
                                grade.student._id === student._id && 
                                grade.course._id === selectedCourse
                              )
                            : grades.filter(grade => 
                                grade.student._id === student._id
                              );
                          const hasGrade = studentGrades.length > 0;
                          
                          return (
                            <>
                              {hasGrade ? (
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs font-medium ${(() => {
                                    const studentGrade = studentGrades[0];
                                    const isSubmitted = studentGrade.status === 'submitted' || studentGrade.status === 'approved' || studentGrade.status === 'final';
                                    return isSubmitted ? 'text-green-600' : 'text-blue-600';
                                  })()}`}>
                                    {(() => {
                                      const studentGrade = studentGrades[0];
                                      const isSubmitted = studentGrade.status === 'submitted' || studentGrade.status === 'approved' || studentGrade.status === 'final';
                                      return isSubmitted ? 'Submitted' : 'Draft';
                                    })()}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStudentGrade(student)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Manage Grade"
                                >
                                  <GraduationCap className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          );
                        })()}
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



      {/* Student Grade Modal */}
      {isStudentGradeModalOpen && selectedStudent && (
        <StudentGradeModal
          isOpen={isStudentGradeModalOpen}
          onClose={() => {
            setIsStudentGradeModalOpen(false);
            setSelectedStudent(null);
            setSelectedGradeForEdit(null);
          }}
          student={selectedStudent}
          selectedCourse={selectedCourse}
          courses={courses}
          selectedGradeForEdit={selectedGradeForEdit}
          onCreateGrade={createCourseGradeMutation}
          onUpdateGrade={updateCourseGradeMutation}
          onGradeSubmitted={handleRefetchGrades}
        />
      )}
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
  selectedGradeForEdit: CourseGradeData | null;
  onCreateGrade: any;
  onUpdateGrade: any;
  onGradeSubmitted: () => void;
}> = ({ isOpen, onClose, student, selectedCourse, courses, selectedGradeForEdit, onCreateGrade, onUpdateGrade, onGradeSubmitted }) => {

  // Safety check for student data
  if (!student || !student._id) {
    console.error('Invalid student data:', student);
    return null;
  }

  // Ensure courses array is valid
  const validCourses = courses || [];

  // Get current semester and academic year (this should come from system settings)
  const getCurrentSemesterInfo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // January is 0
    
    // Simple logic - you might want to make this more sophisticated
    let semester = 1;
    let academicYear = `${year}-${year + 1}`;
    
    if (month >= 8 && month <= 12) {
      semester = 1;
      academicYear = `${year}-${year + 1}`;
    } else if (month >= 1 && month <= 5) {
      semester = 2;
      academicYear = `${year - 1}-${year}`;
    } else {
      semester = 3; // Summer semester
      academicYear = `${year - 1}-${year}`;
    }
    
    return { semester, academicYear };
  };

  const currentSemesterInfo = getCurrentSemesterInfo();
  
  const [formData, setFormData] = useState({
    course: selectedCourse || '',
    semester: getCurrentSemesterInfo().semester,
    academicYear: getCurrentSemesterInfo().academicYear,
    finalGrade: '',
    numericalGrade: 0,
    credits: 3,
    attendance: 0,
    participation: 0,
    facultyComments: ''
  });

  // Initialize form data when editing an existing grade
  React.useEffect(() => {
    if (selectedGradeForEdit) {
      setFormData({
        course: selectedGradeForEdit.course._id,
        semester: selectedGradeForEdit.semester,
        academicYear: selectedGradeForEdit.academicYear,
        finalGrade: selectedGradeForEdit.finalGrade,
        numericalGrade: selectedGradeForEdit.numericalGrade || 0,
        credits: selectedGradeForEdit.credits,
        attendance: selectedGradeForEdit.attendance || 0,
        participation: selectedGradeForEdit.participation || 0,
        facultyComments: selectedGradeForEdit.facultyComments || ''
      });
    } else {
      // Reset form data for new grade - course is automatically set from context
      const courseId = selectedCourse || (student.courses && student.courses.length > 0 ? student.courses[0]._id : '');
      setFormData({
        course: courseId,
        semester: getCurrentSemesterInfo().semester,
        academicYear: getCurrentSemesterInfo().academicYear,
        finalGrade: '',
        numericalGrade: 0,
        credits: 3,
        attendance: 0,
        participation: 0,
        facultyComments: ''
      });
    }
  }, [selectedGradeForEdit, selectedCourse, student]);

  // Update form data when course changes
  const handleCourseChange = (courseId: string) => {
    const selectedCourseData = validCourses.find(course => course._id === courseId);
    
    setFormData(prev => ({
      ...prev,
      course: courseId,
      credits: selectedCourseData?.creditHours || 3
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter courses to only show courses the student is enrolled in
  const enrolledCourses = student.courses && student.courses.length > 0 
    ? validCourses.filter(course => 
    student.courses.some((studentCourse: any) => studentCourse._id === course._id)
      )
    : validCourses; // Show all courses if student.courses is not available

  // Initialize credits when component mounts or selectedCourse changes (only for new grades)
  React.useEffect(() => {
    // Only update credits if we're not editing an existing grade
    if (selectedCourse && !selectedGradeForEdit) {
      const selectedCourseData = validCourses.find(course => course._id === selectedCourse);
      
      if (selectedCourseData) {
        setFormData(prev => ({
          ...prev,
          credits: selectedCourseData.creditHours || 3
        }));
      }
    }
  }, [selectedCourse, validCourses, selectedGradeForEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student || !student._id) return null;
    
    // Validation
    if (!formData.finalGrade) {
      toast.error('Please select a final grade');
      return;
    }

    if (formData.numericalGrade < 0 || formData.numericalGrade > 100) {
      toast.error('Numerical grade must be between 0 and 100');
      return;
    }

    if (formData.attendance < 0 || formData.attendance > 100) {
      toast.error('Attendance must be between 0 and 100');
      return;
    }

    if (formData.participation < 0 || formData.participation > 100) {
      toast.error('Participation must be between 0 and 100');
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedGradeForEdit) {
        // Update existing grade
        console.log('🔄 Updating existing grade:', selectedGradeForEdit._id);
        const updateData = {
          finalGrade: formData.finalGrade,
          numericalGrade: formData.numericalGrade,
          attendance: formData.attendance,
          participation: formData.participation,
          facultyComments: formData.facultyComments
        };

        console.log('📝 Update data:', updateData);
        await onUpdateGrade.mutateAsync({
          gradeId: selectedGradeForEdit._id,
          gradeData: updateData
        });

        toast.success('Grade updated successfully!');
      } else {
        // Create new grade
        console.log('🆕 Creating new grade for student:', student._id);
        const gradeData = {
          ...formData,
          student: student._id,
          faculty: student.faculty || '', // Use student's faculty or empty string
          semester: getCurrentSemesterInfo().semester,
          academicYear: getCurrentSemesterInfo().academicYear,
          credits: 3 // Default credits
        };

        console.log('📝 Create data:', gradeData);
        await onCreateGrade.mutateAsync(gradeData);
        toast.success('Grade submitted successfully!');
      }

      onClose();
    } catch (error: any) {
      console.error('Grade submission error:', error);
      
      // Handle specific error messages
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes('Cannot update grade that is already submitted or finalized')) {
          toast.error('This grade has already been submitted and cannot be edited. Only draft grades can be modified.');
        } else if (errorMessage.includes('Grade already exists')) {
          toast.error('A grade already exists for this student in this course.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Failed to save grade. Please try again.');
      }
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
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedGradeForEdit ? 'Edit Student Grade' : 'Manage Student Grade'}
              </h2>
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
                  {/* Always read-only since course is assigned by admin during enrollment */}
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {(() => {
                      // When editing an existing grade, show the grade's course
                      if (selectedGradeForEdit) {
                        return `${selectedGradeForEdit.course.name} (${selectedGradeForEdit.course.code})`;
                      }
                      
                      // When creating a new grade, show selected course or student's courses
                      if (selectedCourse) {
                        const course = validCourses.find(c => c._id === selectedCourse);
                        return course ? `${course.name} (${course.code})` : 'Course not found';
                      } else {
                        // Show student's enrolled courses
                        if (student.courses && student.courses.length > 0) {
                          const courseNames = student.courses
                            .map((course: any) => `${course.name || course.title} (${course.code})`)
                            .join(', ');
                          return courseNames;
                        }
                        return 'No courses assigned';
                      }
                    })()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Course assigned by admin during enrollment</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically set from course credit hours</p>
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
                    value={isNaN(formData.numericalGrade) ? '' : formData.numericalGrade}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        numericalGrade: isNaN(value) ? 0 : value 
                      }));
                    }}
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
                    value={isNaN(formData.attendance) ? '' : formData.attendance}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        attendance: isNaN(value) ? 0 : value 
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participation (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={isNaN(formData.participation) ? '' : formData.participation}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        participation: isNaN(value) ? 0 : value 
                      }));
                    }}
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
                  <input
                    type="text"
                    value={`Semester ${formData.semester}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically determined by system</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically determined by system</p>
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {selectedGradeForEdit ? 'Updating...' : 'Submitting...'}
                  </span>
                ) : (
                  selectedGradeForEdit ? 'Update Grade' : 'Submit Grade'
            )}
          </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Grades; 