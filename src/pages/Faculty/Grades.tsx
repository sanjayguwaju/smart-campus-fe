import React from 'react';
import { facultyGrades } from '../../data/facultyDummyData';

const Grades: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Grades</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2 text-left">Grade</th>
            <th className="px-4 py-2 text-left">Semester</th>
          </tr>
        </thead>
        <tbody>
          {facultyGrades.map((grade, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{grade.student}</td>
              <td className="px-4 py-2">{grade.course}</td>
              <td className="px-4 py-2">{grade.grade}</td>
              <td className="px-4 py-2">{grade.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Grades; 