import React, { useState } from 'react';
import { facultyAdvisees, facultyCourses } from '../../data/facultyDummyData';

const Students: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = facultyAdvisees.find(s => s.studentId === selectedStudentId);

  // Find all courses this student is enrolled in (mock logic: enrolled if their studentId appears in any assignment submission)
  const enrolledCourses = facultyCourses.filter(course =>
    course.assignments.some(assignment =>
      assignment.submissions.some(sub => sub.studentId === selectedStudentId)
    )
  );

  // Mock GPA and credits
  const mockGPA = 3.67;
  const mockCredits = 90;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Advisees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyAdvisees.map(student => (
          <div
            key={student.studentId}
            className="bg-white rounded-lg shadow p-4 flex flex-col gap-1 border-l-4 border-blue-400 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedStudentId(student.studentId)}
          >
            <span className="font-bold text-blue-700 text-lg hover:underline">{student.name}</span>
            <span className="text-sm text-gray-500">{student.program} ({student.year})</span>
            <span className="text-xs text-gray-400">{student.email}</span>
          </div>
        ))}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedStudentId(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedStudent.name}</h3>
            <div className="mb-2 text-sm text-gray-500">{selectedStudent.program} ({selectedStudent.year})</div>
            <div className="mb-2 text-xs text-gray-400">{selectedStudent.email}</div>
            <div className="mb-4 flex gap-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-gray-500">GPA</div>
                <div className="text-lg font-bold text-blue-700">{mockGPA}</div>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-gray-500">Credits</div>
                <div className="text-lg font-bold text-green-700">{mockCredits}</div>
              </div>
            </div>
            <h4 className="font-semibold mb-2 mt-4">Enrolled Courses</h4>
            {enrolledCourses.length === 0 ? (
              <div className="text-gray-500 italic">No enrolled courses found.</div>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map(course => (
                  <div key={course.courseId} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-blue-900">{course.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{course.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{course.semester} &bull; {course.schedule}</div>
                    {/* Assignments for this course for this student */}
                    <div className="mt-2">
                      <div className="font-semibold text-xs mb-1">Assignments</div>
                      {course.assignments && course.assignments.length > 0 ? (
                        <div className="space-y-1">
                          {course.assignments.map(assignment => {
                            const submission = assignment.submissions.find(s => s.studentId === selectedStudentId);
                            return (
                              <div key={assignment.assignmentId} className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded border border-gray-100 px-2 py-1 text-xs">
                                <div>
                                  <span className="font-semibold text-blue-700">{assignment.title}</span>
                                  <span className="ml-2 text-gray-400">Due: {assignment.dueDate}</span>
                                </div>
                                <div className="flex gap-2 items-center mt-1 md:mt-0">
                                  <span className={`px-2 py-1 rounded-full ${submission?.status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{submission?.status || 'Not Submitted'}</span>
                                  <span className="text-gray-500">Grade: <span className="font-bold">{submission?.grade ?? '-'}</span></span>
                                  <span className="text-gray-400">{submission?.feedback ? `Feedback: ${submission.feedback}` : ''}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">No assignments.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h4 className="font-semibold mb-2 mt-6">Faculty Feedback</h4>
            <textarea
              className="w-full border rounded px-2 py-1 text-sm mb-2"
              placeholder="Add feedback for this student (mock only)"
              rows={3}
              disabled
              value={''}
            />
            <div className="text-xs text-gray-400">(Feedback is mock and not saved)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students; 