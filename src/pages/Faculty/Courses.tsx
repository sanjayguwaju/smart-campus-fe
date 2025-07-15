import React from 'react';
import { facultyCourses } from '../../data/facultyDummyData';

const Courses: React.FC = () => (
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
        </div>
      ))}
    </div>
  </div>
);

export default Courses; 