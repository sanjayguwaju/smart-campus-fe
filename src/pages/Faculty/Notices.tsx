import React from 'react';
import { facultyNotices } from '../../data/facultyDummyData';

const Notices: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Faculty Notices</h2>
    <div className="space-y-4">
      {facultyNotices.map(notice => (
        <div key={notice.noticeId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1 border-l-4" style={{ borderColor: notice.priority === 'High' ? '#f87171' : '#fbbf24' }}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">{notice.title}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${notice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{notice.priority} Priority</span>
          </div>
          <div className="text-xs text-gray-400">{notice.date}</div>
          <div className="text-gray-600 text-sm mt-1">{notice.content}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Notices; 