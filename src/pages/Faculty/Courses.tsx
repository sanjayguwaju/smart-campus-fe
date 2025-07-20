import React, { useState } from 'react';
import { facultyCourses, facultyAdvisees } from '../../data/facultyDummyData';

const Courses: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', totalPoints: 100 });

  const selectedCourse = facultyCourses.find(c => c.courseId === selectedCourseId);
  const selectedAssignment = selectedCourse?.assignments?.find(a => a.assignmentId === selectedAssignmentId);

  // Mock grade/feedback update (does not persist)
  const [mockGrades, setMockGrades] = useState<Record<string, { grade: number | null; feedback: string | null }>>({});

  const handleGradeChange = (studentId: string, value: string) => {
    setMockGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        grade: value === '' ? null : Number(value)
      }
    }));
  };
  const handleFeedbackChange = (studentId: string, value: string) => {
    setMockGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        feedback: value
      }
    }));
  };

  const handleCreateAssignment = () => {
    // Mock: just close modal and reset
    setShowCreateAssignment(false);
    setNewAssignment({ title: '', description: '', dueDate: '', totalPoints: 100 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyCourses.map(course => (
          <div key={course.courseId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-700">{course.title}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{course.status}</span>
            </div>
            <div className="text-sm text-gray-500">{course.semester} &bull; {course.schedule}</div>
            <div className="text-xs text-gray-400">Enrolled: {course.enrolledStudents}</div>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => { setSelectedCourseId(course.courseId); setSelectedAssignmentId(null); }}
            >
              Manage Assignments
            </button>
          </div>
        ))}
      </div>

      {/* Assignments Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => { setSelectedCourseId(null); setSelectedAssignmentId(null); setShowCreateAssignment(false); }}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Assignments for {selectedCourse.title}</h3>
            <button
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={() => setShowCreateAssignment(true)}
            >
              + Create Assignment
            </button>
            {/* Create Assignment Modal (mock) */}
            {showCreateAssignment && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">New Assignment (Mock)</h4>
                <input
                  className="mb-2 w-full border rounded px-2 py-1"
                  placeholder="Title"
                  value={newAssignment.title}
                  onChange={e => setNewAssignment(a => ({ ...a, title: e.target.value }))}
                />
                <textarea
                  className="mb-2 w-full border rounded px-2 py-1"
                  placeholder="Description"
                  value={newAssignment.description}
                  onChange={e => setNewAssignment(a => ({ ...a, description: e.target.value }))}
                />
                <input
                  className="mb-2 w-full border rounded px-2 py-1"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={e => setNewAssignment(a => ({ ...a, dueDate: e.target.value }))}
                />
                <input
                  className="mb-2 w-full border rounded px-2 py-1"
                  type="number"
                  min={1}
                  max={500}
                  value={newAssignment.totalPoints}
                  onChange={e => setNewAssignment(a => ({ ...a, totalPoints: Number(e.target.value) }))}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={handleCreateAssignment}
                >
                  Save (Mock)
                </button>
              </div>
            )}
            {/* Assignment List */}
            {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? (
              <div className="space-y-6">
                {selectedCourse.assignments.map(assignment => (
                  <div key={assignment.assignmentId} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-semibold text-blue-900">{assignment.title}</span>
                        <span className="ml-2 text-xs text-gray-500">Due: {assignment.dueDate}</span>
                      </div>
                      <button
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setSelectedAssignmentId(assignment.assignmentId)}
                      >
                        View Submissions
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{assignment.description}</div>
                    <div className="text-xs text-gray-500">Total Points: {assignment.totalPoints}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">No assignments yet.</div>
            )}

            {/* Assignment Submissions Modal */}
            {selectedAssignment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedAssignmentId(null)}
                  >
                    &times;
                  </button>
                  <h4 className="text-lg font-bold mb-4">Submissions for {selectedAssignment.title}</h4>
                  {selectedAssignment.submissions.length === 0 ? (
                    <div className="text-gray-500 italic">No submissions yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {selectedAssignment.submissions.map(sub => {
                        const student = facultyAdvisees.find(s => s.studentId === sub.studentId);
                        return (
                          <div key={sub.studentId} className="bg-gray-50 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100">
                            <div>
                              <span className="font-semibold text-blue-900">{student?.name || sub.studentId}</span>
                              <span className="ml-2 text-xs text-gray-500">({sub.studentId})</span>
                              <div className="text-xs text-gray-500">{student?.program}</div>
                            </div>
                            <div className="flex flex-col gap-1 mt-2 md:mt-0 md:items-end">
                              <input
                                type="number"
                                min={0}
                                max={selectedAssignment.totalPoints}
                                className="w-20 border rounded px-2 py-1 text-sm"
                                placeholder="Grade"
                                value={mockGrades[sub.studentId]?.grade ?? sub.grade ?? ''}
                                onChange={e => handleGradeChange(sub.studentId, e.target.value)}
                                disabled={sub.status !== 'Submitted'}
                              />
                              <textarea
                                className="w-40 border rounded px-2 py-1 text-sm"
                                placeholder="Feedback"
                                value={mockGrades[sub.studentId]?.feedback ?? sub.feedback ?? ''}
                                onChange={e => handleFeedbackChange(sub.studentId, e.target.value)}
                                disabled={sub.status !== 'Submitted'}
                              />
                              <span className={`text-xs mt-1 ${sub.status === 'Submitted' ? 'text-green-700' : 'text-gray-400'}`}>{sub.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses; 