import React from 'react';
import { useAppStore } from '../store/appStore';
import { Exam } from '../types';

const ExamPage: React.FC = () => {
  const { exams } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Exams</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam: Exam) => (
              <tr key={exam.id}>
                <td className="px-4 py-2 whitespace-nowrap">{exam.title}</td>
                <td className="px-4 py-2 whitespace-nowrap">{exam.course}</td>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(exam.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{exam.duration}</td>
                <td className="px-4 py-2 whitespace-nowrap">{exam.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamPage; 