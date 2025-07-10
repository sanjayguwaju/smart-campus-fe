import React, { useState } from 'react';
import { Calendar, User, Tag, ArrowRight, Search, Filter } from 'lucide-react';
import { useBlogs } from '../api/hooks/useBlogs';
import { BlogPost } from '../api/services/blogService';

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600&h=400&fit=crop';

  const categories = [
    { key: 'all', name: 'All Posts' },
    { key: 'academic', name: 'Academic' },
    { key: 'technology', name: 'Technology' },
    { key: 'student-life', name: 'Student Life' },
    { key: 'research', name: 'Research' },
    { key: 'events', name: 'Events' },
  ];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { blogsQuery } = useBlogs();

  // Loading and error states
  if (blogsQuery.isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading blogs...</div>;
  }
  if (blogsQuery.isError) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Failed to load blogs.</div>;
  }

  // Type guard for API response
  const blogs: BlogPost[] = Array.isArray(blogsQuery.data?.data?.data)
    ? blogsQuery.data.data.data
    : [];

  // Only published blogs
  const publishedBlogs = blogs.filter(
    (b) => b.published === true || b.status === 'published'
  );

  // Sort by createdAt (most recent first)
  const sortedBlogs = [...publishedBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime();
    const dateB = new Date(b.createdAt || '').getTime();
    return dateB - dateA;
  });

  // Filter by category and search
  const filteredPosts = sortedBlogs.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.tags?.includes(selectedCategory) ||
      post.status === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Smart Campus Blog</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Insights, stories, and updates from our community</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-500 mt-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Featured Post */}
      {featuredPost && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
                <img
                  src={featuredPost.coverImage || PLACEHOLDER_IMAGE}
                  alt={featuredPost.title}
                  className="h-64 md:h-full w-full object-cover"
                />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                  {featuredPost.tags && featuredPost.tags[0] && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {featuredPost.tags[0]}
                </span>
                  )}
                <span className="mx-2">•</span>
                  <span>{featuredPost.createdAt ? new Date(featuredPost.createdAt).toLocaleDateString() : ''}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{featuredPost.author}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restPosts.map((post) => (
            <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.coverImage || PLACEHOLDER_IMAGE}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  {post.tags && post.tags[0] && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {post.tags[0]}
                  </span>
                  )}
                  <span className="mx-2">•</span>
                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Read Article
                </button>
              </div>
            </article>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-500 py-16 text-lg">No blog posts found.</div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest articles, events, and campus updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 