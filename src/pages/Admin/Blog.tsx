import React, { useState } from 'react';
import { useBlogs } from '../../api/hooks/useBlogs';
import { BlogPost } from '../../api/services/blogService';
import { Eye, Pencil, Trash2, Filter, Search, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select, { StylesConfig } from 'react-select';
import { 
  ViewBlogModal, 
  AddBlogModal, 
  EditBlogModal, 
  DeleteBlogModal, 
  BlogsFilterDrawer 
} from '../../components/Admin/Blogs';

const AdminBlog: React.FC = () => {
  const { blogsQuery, publishBlog, unpublishBlog } = useBlogs();
  
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
    searchTerm: '',
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

  const handlePublish = async (blog: BlogPost) => {
    try {
      await publishBlog.mutateAsync(blog._id!);
      toast.success('Blog published successfully');
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('Failed to publish blog. Please try again.');
    }
  };

  const handleUnpublish = async (blog: BlogPost) => {
    try {
      await unpublishBlog.mutateAsync(blog._id!);
      toast.success('Blog unpublished successfully');
    } catch (error) {
      console.error('Failed to unpublish blog:', error);
      toast.error('Failed to unpublish blog. Please try again.');
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      author: '',
      status: '',
      tags: '',
      searchTerm: '',
      dateRange: '',
      featured: '',
    });
    setSearchTerm('');
  };

  // Custom styles for react-select
  const selectStyles: StylesConfig<{ value: string; label: string }> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    })
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  const posts = Array.isArray(blogsQuery.data) ? blogsQuery.data : [];
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
      (filters.status === 'published' && post.isPublished) ||
      (filters.status === 'draft' && !post.isPublished);
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
          <Select<{ value: string; label: string }>
            options={statusOptions}
            value={statusOptions.find(option => option.value === filters.status) || null}
            onChange={(selectedOption) => 
              setFilters(prev => ({ ...prev, status: selectedOption?.value || '' }))
            }
            styles={selectStyles}
            placeholder="All Statuses"
            isClearable
            className="min-w-[150px]"
          />
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
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria, or create a new blog post.</p>
        </div>
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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{post.author}</span>
                    {post.isPublished ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!post.isPublished ? (
                      <button
                        onClick={() => handlePublish(post)}
                        disabled={publishBlog.isPending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded text-xs font-medium text-white transition-colors"
                        title="Publish Blog"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(post)}
                        disabled={unpublishBlog.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded text-xs font-medium text-white transition-colors"
                        title="Unpublish Blog"
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
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