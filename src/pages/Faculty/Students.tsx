import React from 'react';
import { facultyAdvisees } from '../../data/facultyDummyData';

const Students: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">My Advisees</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facultyAdvisees.map(student => (
        <div key={student.studentId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1">
          <span className="font-bold text-blue-700">{student.name}</span>
          <span className="text-sm text-gray-500">{student.program} ({student.year})</span>
          <span className="text-xs text-gray-400">{student.email}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Students; 