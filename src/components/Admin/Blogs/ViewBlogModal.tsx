import React from 'react';
import { X, Calendar, User, Tag, Clock, Eye } from 'lucide-react';
import { BlogPost } from '../../../api/services/blogService';

interface ViewBlogModalProps {
  isOpen: boolean;
  blog: BlogPost | null;
  onClose: () => void;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({ isOpen, blog, onClose }) => {
  if (!isOpen || !blog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          {/* Cover Image */}
          {blog.coverImage?.url ? (
            <div className="h-64 md:h-80 relative overflow-hidden">
              <img 
                src={blog.coverImage.url} 
                alt={blog.coverImage.alt || blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium">Blog Article</p>
                </div>
              </div>
            </div>
          )}
          
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
            {blog.isPublished ? (
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  Published
                </span>
            ) : (
                <span className="bg-gray-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  Draft
                </span>
            )}
              <span className="text-sm opacity-90">•</span>
              <span className="text-sm opacity-90">{formatDate(blog.createdAt || '')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight break-words">{blog.title}</h1>
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
                  <p className="font-medium text-gray-900 break-words">{blog.author}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDate(blog.createdAt || '')}</span>
              </div>
            </div>

            {/* Summary */}
            {blog.summary && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{blog.summary}</p>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Article Content</h2>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed space-y-4 break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Credits */}
            {blog.credits && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Credits</h3>
                <p className="text-gray-600 break-words whitespace-pre-wrap">{blog.credits}</p>
          </div>
            )}
          </div>
          </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Reading time: ~{Math.ceil(blog.content?.length / 200 || 0)} min</span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Close Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlogModal; 
