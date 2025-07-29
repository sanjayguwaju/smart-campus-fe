import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Filter, Calendar, User, Pin, AlertTriangle, BookOpen, GraduationCap, ChevronDown, Eye } from 'lucide-react';
import { useNotices } from '../api/hooks/useNotices';
import { Notice } from '../api/types/notices';

const Noticeboard: React.FC = () => {
  // Fetch notices from backend API
  const { data, isLoading, error } = useNotices();
  const notices: Notice[] = data?.data?.notices?.filter((notice: Notice) =>
    notice.isPublished || notice.status === 'published'
  ) || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'academic', label: 'Academic' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'event', label: 'Event' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const filteredNotices = notices
    .filter((notice: Notice) => {
      const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority;
      return matchesSearch && matchesCategory && matchesPriority;
    })
    .sort((a: Notice, b: Notice) => {
      // Sort by pinned first, then by priority, then by date
      const aPinned = a.settings?.pinToTop || a.pinned;
      const bPinned = b.settings?.pinToTop || b.pinned;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      const aDate = new Date(a.publishDate);
      const bDate = new Date(b.publishDate);
      return bDate.getTime() - aDate.getTime();
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      exam: GraduationCap,
      alert: AlertTriangle,
      academic: BookOpen,
      general: Bell,
    };
    return icons[category as keyof typeof icons] || Bell;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      exam: 'bg-blue-100 text-blue-800 border-blue-200',
      alert: 'bg-red-100 text-red-800 border-red-200',
      academic: 'bg-green-100 text-green-800 border-green-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const toggleNoticeExpansion = (noticeId: string) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load notices. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Bell className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Noticeboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest announcements, alerts, and important information
            from the campus administration and academic departments.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date From
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date To
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Notices List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredNotices.map((notice, index) => {
              const CategoryIcon = getCategoryIcon(notice.category);
              const isExpanded = expandedNotice === notice.id;

              return (
                <motion.div
                  key={notice.id || `notice-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${notice.pinned ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                    }`}
                >
                  <div className="p-6">
                    {/* Notice Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Priority Indicator */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(notice.priority)}`}></div>
                          {notice.pinned && <Pin className="h-4 w-4 text-blue-600" />}
                        </div>

                        {/* Notice Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(notice.category)}`}>
                              {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${notice.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {notice.priority.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {notice.title}
                          </h3>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>
                                {typeof notice.author === "object" && notice.author !== null
                                  ? notice.author.name || notice.author.email || "Unknown"
                                  : notice.author || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(new Date(notice.publishDate))}</span>
                            </div>
                          </div>

                          {/* Notice Content Preview */}
                          <div className="text-gray-700 leading-relaxed">
                            {isExpanded ? (
                              <div className="whitespace-pre-wrap">{notice.content}</div>
                            ) : (
                              <div className="line-clamp-3">{notice.content}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    {notice.content.length > 200 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => toggleNoticeExpansion(notice.id)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                          <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                        </button>
                      </div>
                    )}

                    {/* Expiry Date */}
                    {notice.expiryDate && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          <strong>Expires:</strong> {formatDate(new Date(notice.expiryDate))}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* No Notices Found */}
        {filteredNotices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new announcements.
            </p>
          </motion.div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {notices.length}
            </div>
            <div className="text-gray-600">Total Notices</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {notices.filter((n: Notice) => n.priority === 'high').length}
            </div>
            <div className="text-gray-600">High Priority</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {notices.filter((n: Notice) => n.settings?.pinToTop || n.pinned).length}
            </div>
            <div className="text-gray-600">Pinned</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {notices.filter((n: Notice) => n.category === 'exam').length}
            </div>
            <div className="text-gray-600">Exam Related</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Noticeboard;