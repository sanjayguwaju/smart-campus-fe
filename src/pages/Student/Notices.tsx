import React from 'react';
import { Bell, Calendar, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { studentNotices } from '../../data/studentDummyData';

const Notices: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Medium':
        return <Info className="h-4 w-4" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Facilities':
        return 'bg-green-100 text-green-800';
      case 'Administrative':
        return 'bg-purple-100 text-purple-800';
      case 'IT Services':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRecent = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - noticeDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notices & Announcements</h1>
          <p className="text-gray-600 mt-2">Stay informed about important campus updates</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Notices</p>
          <p className="text-2xl font-bold text-blue-600">{studentNotices.length}</p>
        </div>
      </div>

      {/* Notice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {studentNotices.filter(notice => notice.priority === 'High').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recent (7 days)</p>
              <p className="text-2xl font-bold text-green-600">
                {studentNotices.filter(notice => isRecent(notice.date)).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Academic</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentNotices.filter(notice => notice.category === 'Academic').length}
              </p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-orange-600">
                {studentNotices.filter(notice => isRecent(notice.date)).length}
              </p>
            </div>
            <Info className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {studentNotices.map((notice) => (
          <div key={notice.noticeId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Notice Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                      {getPriorityIcon(notice.priority)}
                      {notice.priority}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    {isRecent(notice.date) && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{notice.title}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(notice.date)}
                  </div>
                </div>
              </div>

              {/* Notice Content */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{notice.content}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Mark as Read
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Save
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notice Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {studentNotices.filter(notice => notice.category === 'Academic').length}
            </div>
            <div className="text-sm text-gray-600">Academic</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {studentNotices.filter(notice => notice.category === 'Facilities').length}
            </div>
            <div className="text-sm text-gray-600">Facilities</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {studentNotices.filter(notice => notice.category === 'Administrative').length}
            </div>
            <div className="text-sm text-gray-600">Administrative</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {studentNotices.filter(notice => notice.category === 'IT Services').length}
            </div>
            <div className="text-sm text-gray-600">IT Services</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices; 