import React, { useState, useEffect } from 'react';
import { useBlogs } from '../../../api/hooks/useBlogs';
import { BlogPost } from '../../../api/services/blogService';
import ImageUpload from '../../common/ImageUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogPost | null;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ isOpen, onClose, blog }) => {
  const { updateBlog } = useBlogs();
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    author: '',
    coverImage: '',
    content: '',
    summary: '',
    tags: [],
    isPublished: false,
    status: 'draft',
    credits: '',
    attachments: []
  });

  const [tagInput, setTagInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Update form data when blog prop changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        author: blog.author || '',
        coverImage: blog.coverImage || '',
        content: blog.content || '',
        summary: blog.summary || '',
        tags: blog.tags || [],
        isPublished: blog.isPublished || false,
        credits: blog.credits || '',
        attachments: blog.attachments || []
      });
    }
  }, [blog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog?._id) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('slug', formData.slug || '');
      formDataToSend.append('author', formData.author || '');
      formDataToSend.append('content', formData.content || '');
      formDataToSend.append('summary', formData.summary || '');
      formDataToSend.append('isPublished', formData.isPublished?.toString() || 'false');
      (formData.tags || []).forEach(tag => {
        formDataToSend.append('tags', tag);
      });
      
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      if (formData.credits) {
        formDataToSend.append('credits', formData.credits);
      }

      await updateBlog.mutateAsync({ id: blog._id, data: formDataToSend });
      onClose();
      setFieldErrors({});
      setServerError(null);
    } catch (error: any) {
      if (error?.response?.data?.error) {
        const errors = error.response.data.error;
        const errorMap: { [key: string]: string } = {};
        errors.forEach((err: any) => {
          errorMap[err.field] = err.message;
        });
        setFieldErrors(errorMap);
        setServerError(error.response.data.message || 'Validation failed');
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  if (!isOpen || !blog) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Blog Post</h2>
              <p className="text-sm text-gray-600">Update the blog post information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter blog post title"
                    required
                  />
                  {fieldErrors.title && <div className="text-red-500 text-xs">{fieldErrors.title}</div>}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Author name"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="blog-post-url-slug"
                    required
                  />
                  {fieldErrors.slug && <div className="text-red-500 text-xs">{fieldErrors.slug}</div>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      status: value as 'published' | 'draft' | 'archived',
                      isPublished: value === 'published'
                    }));
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {fieldErrors.status && <div className="text-red-500 text-xs">{fieldErrors.status}</div>}
              </div>
            </div>

            {/* Summary and Cover Image Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary & Cover</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary *
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Brief summary of the blog post"
                    required
                  />
                  {fieldErrors.summary && <div className="text-red-500 text-xs">{fieldErrors.summary}</div>}
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.coverImage}
                    className="w-full h-40"
                  />
                </div>
              </div>
            </div>

            {/* Tags and Settings Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags & Settings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {fieldErrors.tags && <div className="text-red-500 text-xs">{fieldErrors.tags}</div>}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  {/* Published Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.isPublished}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Publish immediately
                    </label>
                  </div>

                  {/* Credits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="text"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Photo credits, sources, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write your blog post content here..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="mb-4"
                style={{ height: '400px' }}
              />
              {fieldErrors.content && <div className="text-red-500 text-xs">{fieldErrors.content}</div>}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={updateBlog.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateBlog.isPending ? 'Updating...' : 'Update Blog Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal; 