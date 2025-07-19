import React, { useState } from 'react';
import { useBlogs } from '../../api/hooks/useBlogs';
import { BlogPost } from '../../api/services/blogService';
import { Search, Filter, User, Calendar } from 'lucide-react';

const Blog: React.FC = () => {
  const { blogsQuery } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', name: 'All Posts' },
    { key: 'academic', name: 'Academic' },
    { key: 'technology', name: 'Technology' },
    { key: 'student-life', name: 'Student Life' },
    { key: 'research', name: 'Research' },
    { key: 'events', name: 'Events' },
  ];

  // Get published blogs from API
  const blogPosts: BlogPost[] = Array.isArray(blogsQuery.data) 
    ? blogsQuery.data.filter((post: BlogPost) => post.isPublished)
    : [];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.tags.some(tag => tag.toLowerCase() === selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Loading state
  if (blogsQuery.isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (blogsQuery.error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Blogs</h2>
        <p className="text-gray-600">Unable to load blog posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Faculty Blog</h2>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-500 mt-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow">
              {blog.coverImage ? (
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-40 object-cover rounded mb-2" 
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-2 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <span className="font-bold text-blue-700 line-clamp-2">{blog.title}</span>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span>By {blog.author}</span>
                <span className="mx-2">•</span>
                <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <span className="text-xs text-gray-400">{blog.tags.join(', ')}</span>
              )}
              <span className="text-gray-600 text-sm mt-1 line-clamp-3">{blog.summary}</span>
              <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Read More
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Blog; 