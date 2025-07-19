import React from 'react';
import { studentAssignments } from '../../data/studentDummyData';

const AssignmentsPage: React.FC = () => {
  // Group assignments by course
  const grouped = studentAssignments.reduce((acc, assignment) => {
    if (!acc[assignment.courseTitle]) acc[assignment.courseTitle] = [];
    acc[assignment.courseTitle].push(assignment);
    return acc;
  }, {} as Record<string, typeof studentAssignments>);
  const courseTitles = Object.keys(grouped);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">View all your assignments, their status, grades, and feedback.</p>
      </div>
      {courseTitles.length === 0 ? (
        <div className="text-gray-500 italic">No assignments found.</div>
      ) : (
        <div className="space-y-8">
          {courseTitles.map(courseTitle => (
            <div key={courseTitle} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">{courseTitle}</h3>
                <span className="text-xs text-gray-500">{grouped[courseTitle][0].semester}</span>
              </div>
              <div className="divide-y divide-gray-200">
                {grouped[courseTitle].map(assignment => (
                  <div key={assignment.assignmentId} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-blue-700 text-base">{assignment.title}</div>
                      <div className="text-xs text-gray-500 mb-1">Due: {assignment.dueDate}</div>
                      <div className="text-xs text-gray-400">{assignment.description}</div>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${assignment.status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{assignment.status}</span>
                      <span className="text-xs text-gray-500">Grade: <span className="font-bold">{assignment.grade ?? '-'}</span> / {assignment.totalPoints}</span>
                      {assignment.feedback && (
                        <span className="text-xs text-blue-700">Feedback: {assignment.feedback}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage; 