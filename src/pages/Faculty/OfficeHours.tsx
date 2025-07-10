import React from 'react';
import { facultyOfficeHours } from '../../data/facultyDummyData';

const OfficeHours: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Office Hours</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facultyOfficeHours.map((slot, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1">
          <span className="font-bold text-blue-700">{slot.day}</span>
          <span className="text-sm text-gray-500">{slot.time}</span>
          <span className="text-xs text-gray-400">{slot.location}</span>
        </div>
      ))}
    </div>
  </div>
);

export default OfficeHours; 