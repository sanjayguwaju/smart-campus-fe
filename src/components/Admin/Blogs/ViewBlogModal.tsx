import React from 'react';
import { BlogPost } from '../../../api/services/blogService';

interface ViewBlogModalProps {
  isOpen: boolean;
  blog: BlogPost | null;
  onClose: () => void;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({ isOpen, blog, onClose }) => {
  if (!isOpen || !blog) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-600">By {blog.author}</span>
            <span className="text-sm text-gray-400">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</span>
            {blog.isPublished ? (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Published</span>
            ) : (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Draft</span>
            )}
          </div>
          {blog.coverImage?.url && (
            <img src={blog.coverImage.url} alt={blog.coverImage.alt || "Cover"} className="w-full max-h-64 object-cover rounded mb-4" />
          )}
          <div className="mb-2">
            <strong>Summary:</strong> {blog.summary}
          </div>
          <div className="mb-2">
            <strong>Content:</strong>
            <div className="prose prose-sm max-w-none mt-1" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
          <div className="mb-2">
            <strong>Tags:</strong> {blog.tags && blog.tags.length > 0 ? blog.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mr-1">{tag}</span>
            )) : 'None'}
          </div>
          {blog.credits && (
            <div className="mb-2">
              <strong>Credits:</strong> {blog.credits}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBlogModal; 
