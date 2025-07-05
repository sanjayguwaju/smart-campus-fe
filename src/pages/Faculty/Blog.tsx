import React from 'react';
import { facultyBlogs } from '../../data/facultyDummyData';

const Blog: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Faculty Blog</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facultyBlogs.map(blog => (
        <div key={blog.blogId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-40 object-cover rounded mb-2" />
          <span className="font-bold text-blue-700">{blog.title}</span>
          <span className="text-sm text-gray-500">By {blog.author} • {blog.date}</span>
          <span className="text-xs text-gray-400">{blog.tags.join(', ')}</span>
          <span className="text-gray-600 text-sm mt-1">{blog.summary}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Blog; 