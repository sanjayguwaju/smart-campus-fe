import React, { useState } from 'react';
import { useBlogs } from '../../api/hooks/useBlogs';
import { BlogPost } from '../../api/services/blogService';
import { Eye, Pencil, Trash2, Filter, Search, Plus } from 'lucide-react';
import { 
  ViewBlogModal, 
  AddBlogModal, 
  EditBlogModal, 
  DeleteBlogModal, 
  BlogsFilterDrawer 
} from '../../components/Admin/Blogs';

const AdminBlog: React.FC = () => {
  const { blogsQuery } = useBlogs();
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Selected blog states
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string } | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    status: '',
    tags: '',
    dateRange: '',
    featured: '',
  });

  const handleView = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleDelete = (blog: BlogPost) => {
    setBlogToDelete({ id: blog._id!, title: blog.title });
    setIsDeleteModalOpen(true);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      author: '',
      status: '',
      tags: '',
      dateRange: '',
      featured: '',
    });
    setSearchTerm('');
  };

  const posts = Array.isArray(blogsQuery.data?.data?.data) ? blogsQuery.data.data.data : [];
  const isLoading = blogsQuery.isLoading;

  const filteredPosts = posts.filter((post: BlogPost) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(search) ||
      post.summary.toLowerCase().includes(search) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(search))) ||
      post.author.toLowerCase().includes(search);
    
    const matchesAuthor = !filters.author || post.author.toLowerCase().includes(filters.author.toLowerCase());
    const matchesStatus = !filters.status || 
      (filters.status === 'published' && post.published) ||
      (filters.status === 'draft' && !post.published);
    const matchesTags = !filters.tags || 
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase())));
    
    return matchesSearch && matchesAuthor && matchesStatus && matchesTags;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : blogsQuery.error ? (
        <div className="text-red-600 text-center py-12">Error loading blogs.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: BlogPost) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  {post.tags && post.tags.length > 0 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">{post.author}</span>
                  {post.published ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  title="View"
                  className="p-2 rounded-full hover:bg-gray-100 text-blue-600 transition-colors"
                  onClick={() => handleView(post)}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  title="Edit"
                  className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition-colors"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  title="Delete"
                  className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                  onClick={() => handleDelete(post)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddBlogModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditBlogModal 
        isOpen={isEditModalOpen} 
        blog={selectedBlog}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
        }} 
      />
      
      <DeleteBlogModal 
        isOpen={isDeleteModalOpen}
        blogId={blogToDelete?.id || ''}
        blogTitle={blogToDelete?.title || ''}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
      />
      
      <ViewBlogModal 
        isOpen={isViewModalOpen} 
        blog={selectedBlog} 
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBlog(null);
        }} 
      />
      
      <BlogsFilterDrawer
        isOpen={isFilterDrawerOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onClose={() => setIsFilterDrawerOpen(false)}
      />
    </div>
  );
};

export default AdminBlog; 