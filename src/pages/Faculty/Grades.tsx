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
  Calculator
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Mock data - replace with actual API calls
const mockCourses = [
  {
    _id: 'course1',
    name: 'Physics 101',
    code: 'PHY101',
    creditHours: 3,
    enrolledStudents: 45,
    semester: 1,
    academicYear: '2024-2025'
  },
  {
    _id: 'course2',
    name: 'Advanced Physics',
    code: 'PHY201',
    creditHours: 4,
    enrolledStudents: 32,
    semester: 1,
    academicYear: '2024-2025'
  }
];

const mockGrades = [
  {
    _id: 'grade1',
    student: {
      _id: 'student1',
      firstName: 'Ali',
      lastName: 'Raza',
      studentId: 'STU001'
    },
    course: {
      _id: 'course1',
      name: 'Physics 101',
      code: 'PHY101'
    },
    finalGrade: 'A-',
    numericalGrade: 87,
    credits: 3,
    status: 'draft',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: 'grade2',
    student: {
      _id: 'student2',
      firstName: 'Fatima',
      lastName: 'Noor',
      studentId: 'STU002'
    },
    course: {
      _id: 'course1',
      name: 'Physics 101',
      code: 'PHY101'
    },
    finalGrade: 'B+',
    numericalGrade: 83,
    credits: 3,
    status: 'submitted',
    submittedAt: '2024-01-15T11:00:00Z'
  }
];

const Grades: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [grades, setGrades] = useState(mockGrades);
  const [courses, setCourses] = useState(mockCourses);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [isAutoCalculateModalOpen, setIsAutoCalculateModalOpen] = useState(false);

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

  const handleAutoCalculate = () => {
    setIsAutoCalculateModalOpen(true);
  };

  const handleBulkSubmit = () => {
    // Implement bulk submit functionality
    console.log('Bulk submit grades');
  };

  const filteredGrades = selectedCourse 
    ? grades.filter(grade => grade.course._id === selectedCourse)
    : grades;

  const courseStats = courses.map(course => {
    const courseGrades = grades.filter(grade => grade.course._id === course._id);
    const submittedGrades = courseGrades.filter(grade => grade.status === 'submitted').length;
    const draftGrades = courseGrades.filter(grade => grade.status === 'draft').length;
    
    return {
      ...course,
      submittedGrades,
      draftGrades,
      totalGrades: courseGrades.length
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Grades</h1>
          <p className="text-gray-600 mt-2">Manage and submit final grades for your courses</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAutoCalculate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Auto Calculate
          </button>
          <button
            onClick={handleBulkSubmit}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Submit
          </button>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseStats.map((course) => (
            <div
              key={course._id}
              onClick={() => setSelectedCourse(course._id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCourse === course._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                <span className="text-sm text-gray-500">{course.code}</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>Credits: {course.creditHours}</p>
                <p>Students: {course.enrolledStudents}</p>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Submitted: {course.submittedGrades}</span>
                <span className="text-yellow-600">Draft: {course.draftGrades}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grades Table */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Grades for {courses.find(c => c._id === selectedCourse)?.name}
              </h2>
              <button
                onClick={() => setIsGradeModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </button>
            </div>
          </div>
          
    <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numerical
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
                {filteredGrades.map((grade) => (
                  <tr key={grade._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {grade.student.firstName[0]}{grade.student.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {grade.student.firstName} {grade.student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.finalGrade)}`}>
                        {grade.finalGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.numericalGrade}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(grade.status)}`}>
                        {getStatusIcon(grade.status)}
                        <span className="ml-1 capitalize">{grade.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grade.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditGrade(grade)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {grade.status === 'draft' && (
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </div>
      )}

      {/* Grade Statistics */}
      {selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredGrades.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredGrades.filter(g => g.status === 'submitted').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredGrades.filter(g => g.status === 'draft').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Grade</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredGrades.length > 0 
                    ? (filteredGrades.reduce((sum, g) => sum + g.numericalGrade, 0) / filteredGrades.length).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Grade Entry Modal */}
      {isGradeModalOpen && (
        <GradeEntryModal
          isOpen={isGradeModalOpen}
          onClose={() => {
            setIsGradeModalOpen(false);
            setSelectedGrade(null);
          }}
          grade={selectedGrade}
          course={courses.find(c => c._id === selectedCourse)}
        />
      )}

      {/* Auto Calculate Modal */}
      {isAutoCalculateModalOpen && (
        <AutoCalculateModal
          isOpen={isAutoCalculateModalOpen}
          onClose={() => setIsAutoCalculateModalOpen(false)}
          courses={courses}
        />
      )}
    </div>
  );
};

// Grade Entry Modal Component
const GradeEntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  grade?: any;
  course?: any;
}> = ({ isOpen, onClose, grade, course }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    finalGrade: grade?.finalGrade || '',
    numericalGrade: grade?.numericalGrade || '',
    attendance: grade?.attendance || '',
    participation: grade?.participation || '',
    facultyComments: grade?.facultyComments || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement grade submission
    console.log('Submit grade:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {grade ? 'Edit Grade' : 'Add Grade'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Grade
            </label>
            <select
              value={formData.finalGrade}
              onChange={(e) => setFormData({...formData, finalGrade: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="D-">D-</option>
              <option value="F">F</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numerical Grade (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.numericalGrade}
              onChange={(e) => setFormData({...formData, numericalGrade: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participation (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.participation}
                onChange={(e) => setFormData({...formData, participation: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              value={formData.facultyComments}
              onChange={(e) => setFormData({...formData, facultyComments: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any comments about the student's performance..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {grade ? 'Update Grade' : 'Add Grade'}
            </button>
          </div>
        </form>
    </div>
  </div>
);
};

// Auto Calculate Modal Component
const AutoCalculateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  courses: any[];
}> = ({ isOpen, onClose, courses }) => {
  if (!isOpen) return null;

  const [selectedCourse, setSelectedCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  const handleAutoCalculate = () => {
    // Implement auto-calculate functionality
    console.log('Auto calculate grades for:', { selectedCourse, semester, academicYear });
    onClose();
  };

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2024-2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAutoCalculate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades; 