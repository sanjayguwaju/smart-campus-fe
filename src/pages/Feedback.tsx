import React from 'react';
import { useAppStore } from '../store/appStore';
import { Feedback } from '../types';

const FeedbackPage: React.FC = () => {
  const { feedbacks } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map((fb: Feedback) => (
              <tr key={fb.id}>
                <td className="px-4 py-2 whitespace-nowrap">{fb.userId}</td>
                <td className="px-4 py-2 whitespace-nowrap">{fb.content}</td>
                <td className="px-4 py-2 whitespace-nowrap">{fb.rating}</td>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(fb.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackPage; 