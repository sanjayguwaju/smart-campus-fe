import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useBlogs } from '../../api/hooks/useBlogs';
import { BlogPost } from '../../api/services/blogService';
import { Eye, Pencil, Trash2, Filter, Search } from 'lucide-react';
import ViewBlogModal from '../../components/Admin/ViewBlogModal';

const AdminBlog: React.FC = () => {
  const { user } = useAuthStore();
  const { blogsQuery, createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog } = useBlogs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    author: user?.displayName || user?.fullName || '',
    coverImage: undefined as File | undefined,
    content: '',
    summary: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    credits: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewBlog, setViewBlog] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  const handleContentChange = (val: string) => {
    setForm((prev) => ({ ...prev, content: val }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.slug || !form.slug.trim()) newErrors.slug = 'Slug is required';
    if (!form.author.trim()) newErrors.author = 'Author is required';
    if (!form.content.trim()) newErrors.content = 'Content is required';
    if (!form.summary.trim()) newErrors.summary = 'Summary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      title: '', slug: '', author: user?.displayName || user?.fullName || '', coverImage: undefined, content: '', summary: '', tags: '', status: 'draft', credits: '',
    });
    setErrors({});
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug);
    formData.append('author', form.author);
    formData.append('content', form.content);
    formData.append('summary', form.summary);
    formData.append('status', form.status);
    formData.append('isPublished', String(form.status === 'published'));
    formData.append('credits', form.credits);
    if (form.coverImage) {
      formData.append('coverImage', form.coverImage);
    }
    formData.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
    if (isEdit && editId) {
      updateBlog.mutate({ id: editId, data: formData } as any, { onSuccess: resetForm });
    } else {
      createBlog.mutate(formData as any, { onSuccess: resetForm });
    }
    setIsModalOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      author: post.author,
      coverImage: undefined,
      content: post.content,
      summary: post.summary,
      tags: post.tags.join(', '),
      status: post.status,
      credits: post.credits || '',
    });
    setIsEdit(true);
    setEditId(post._id!);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog.mutate(id as any);
    }
  };

  const handleView = (post: BlogPost) => {
    setViewBlog(post);
    setViewModalOpen(true);
  };

  const posts = Array.isArray(blogsQuery.data?.data?.data) ? blogsQuery.data.data.data : [];
  const isLoading = blogsQuery.isLoading;
  const error = blogsQuery.error;

  const filteredPosts = posts.filter((post: BlogPost) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(search) ||
      post.summary.toLowerCase().includes(search) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(search)));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.status === 'published') ||
      (statusFilter === 'draft' && post.status === 'draft') ||
      (statusFilter === 'archived' && post.status === 'archived');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Blog Post</button>
      </div>
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input name="title" value={form.title} onChange={handleTitleChange} className="w-full border rounded px-3 py-2" />
                {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                {errors.slug && <span className="text-red-500 text-xs">{errors.slug}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Author</label>
                <input name="author" value={form.author} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                {errors.author && <span className="text-red-500 text-xs">{errors.author}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Content</label>
                {/* @ts-ignore */}
                <ReactQuill theme="snow" value={form.content} onChange={(val: string) => handleContentChange(val)} className="mb-2" />
                {errors.content && <span className="text-red-500 text-xs">{errors.content}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Summary</label>
                <input name="summary" value={form.summary} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                {errors.summary && <span className="text-red-500 text-xs">{errors.summary}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Credits (optional)</label>
                <input name="credits" value={form.credits} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{isEdit ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error loading blogs.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: BlogPost) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{post.tags[0]}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : post.status === 'archived' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">{post.author}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                {post.status === 'published' ? (
                  <button
                    title="Unpublish"
                    className="bg-red-600 text-white font-bold rounded-full px-4 py-1 hover:bg-red-700 transition"
                    onClick={() => unpublishBlog.mutate(post._id!)}
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    title="Publish"
                    className="bg-blue-600 text-white font-bold rounded-full px-4 py-1 hover:bg-blue-700 transition"
                    onClick={() => publishBlog.mutate(post._id!)}
                  >
                    Publish
                  </button>
                )}
                <button
                  title="View"
                  className="p-2 rounded-full hover:bg-gray-100 text-blue-600"
                  onClick={() => handleView(post)}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  title="Edit"
                  className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  title="Delete"
                  className="p-2 rounded-full hover:bg-red-100 text-red-600"
                  onClick={() => handleDelete(post._id!)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ViewBlogModal isOpen={viewModalOpen} blog={viewBlog} onClose={() => setViewModalOpen(false)} />
    </div>
  );
};

export default AdminBlog; 