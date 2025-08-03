import React from 'react';
import { X, Calendar, User, Tag, Clock, Eye, AlertTriangle, Bell, Pin } from 'lucide-react';
import { Notice } from '../../api/types/notices';

interface ViewNoticeModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
}

const ViewNoticeModal: React.FC<ViewNoticeModalProps> = ({ isOpen, notice, onClose }) => {
  if (!isOpen || !notice) return null;

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPriorityColor = (priority: string) => {
    if (!priority) return 'bg-gray-500';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    if (!type) return <Bell className="h-6 w-6 text-gray-500" />;
    
    switch (type.toLowerCase()) {
      case 'emergency':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'maintenance':
        return <Tag className="h-6 w-6 text-blue-500" />;
      case 'academic':
        return <Calendar className="h-6 w-6 text-purple-500" />;
      case 'event':
        return <Bell className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getAuthorName = (author: string | any) => {
    if (!author) return 'Unknown';
    
    if (typeof author === 'object' && author !== null) {
      return author.name || author.email || 'Unknown';
    }
    return author || 'Unknown';
  };

  // Safe access to notice properties
  const noticeType = notice.noticeType || notice.type || 'other';
  const priority = notice.priority || 'low';
  const title = notice.title || 'Untitled Notice';
  const content = notice.content || 'No content available';
  const category = notice.category || 'general';
  const publishDate = notice.publishDate || new Date();
  const expiryDate = notice.expiryDate || new Date();
  const author = notice.author || 'Unknown';
  const isPublished = notice.isPublished !== undefined ? notice.isPublished : true;
  const pinned = notice.pinned || notice.settings?.pinToTop || false;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex-shrink-0">
          {/* Hero Section */}
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getTypeIcon(noticeType)}
                </div>
                <p className="text-lg font-medium">Notice Details</p>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white transition-all duration-200 shadow-lg"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className={`${getPriorityColor(priority)}/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {priority.toUpperCase()}
              </span>
              <span className="text-sm opacity-90">•</span>
              <span className="text-sm opacity-90">{formatDate(publishDate)}</span>
              {pinned && (
                <>
                  <span className="text-sm opacity-90">•</span>
                  <span className="text-sm opacity-90 flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight break-words">{title}</h1>
          </div>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Author and Meta Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 break-words">{getAuthorName(author)}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDate(publishDate)}</span>
              </div>
            </div>

            {/* Notice Type and Category */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                  {getTypeIcon(noticeType)}
                  <span className="text-sm font-medium text-blue-700 capitalize">{noticeType}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getPriorityColor(priority)}/10`}>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
                  <span className={`text-sm font-medium ${getPriorityColor(priority).replace('bg-', 'text-')}`}>
                    {priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notice Content</h2>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed space-y-4 break-words whitespace-pre-wrap"
                  >
                    {content}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Published</span>
                  </div>
                  <p className="text-green-700">{formatDate(publishDate)}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Expires</span>
                  </div>
                  <p className="text-orange-700">{formatDate(expiryDate)}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Additional Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {pinned && (
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-blue-500" />
                    <span>This notice is pinned to the top</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Notice ID: {notice.id || notice._id || 'N/A'}</span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Close Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNoticeModal; 