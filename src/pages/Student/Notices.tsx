import React, { useState } from 'react';
import { Bell, Calendar, Tag, Search, Filter, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  author: string;
  department: string;
  isRead: boolean;
  tags: string[];
  attachments?: string[];
}

const StudentNotices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const dummyNotices: Notice[] = [
    {
      id: '1',
      title: 'Final Exam Schedule Released',
      content: 'The final examination schedule for the Spring 2024 semester has been published. Please check your student portal for your specific exam dates and times. All exams will be held in the designated classrooms as specified in the schedule. Students are required to bring their student ID and necessary stationery. No electronic devices will be allowed during the examinations.',
      category: 'Academic',
      priority: 'high',
      date: '2024-03-10',
      author: 'Academic Affairs Office',
      department: 'Academic Affairs',
      isRead: false,
      tags: ['exams', 'schedule', 'spring2024'],
      attachments: ['exam_schedule.pdf', 'exam_rules.pdf']
    },
    {
      id: '2',
      title: 'Campus WiFi Maintenance',
      content: 'Scheduled maintenance for campus WiFi networks will take place on March 15th from 2:00 AM to 6:00 AM. During this time, internet connectivity may be intermittent. We apologize for any inconvenience and recommend planning your online activities accordingly.',
      category: 'Infrastructure',
      priority: 'medium',
      date: '2024-03-08',
      author: 'IT Services',
      department: 'Information Technology',
      isRead: true,
      tags: ['wifi', 'maintenance', 'internet']
    },
    {
      id: '3',
      title: 'Student Health Center Hours Update',
      content: 'The Student Health Center will be extending its operating hours during the final exam period. New hours: Monday-Friday 8:00 AM - 8:00 PM, Saturday 9:00 AM - 5:00 PM. Walk-in appointments are available, but we recommend scheduling in advance.',
      category: 'Health',
      priority: 'medium',
      date: '2024-03-07',
      author: 'Health Services',
      department: 'Student Health',
      isRead: false,
      tags: ['health', 'hours', 'exams']
    },
    {
      id: '4',
      title: 'Library Extended Hours',
      content: 'The main library will be open 24/7 during the final exam period starting from March 12th. Additional study spaces have been set up in the student center. Please remember to bring your student ID for access.',
      category: 'Academic',
      priority: 'medium',
      date: '2024-03-06',
      author: 'Library Services',
      department: 'Library',
      isRead: true,
      tags: ['library', 'study', 'exams']
    },
    {
      id: '5',
      title: 'Parking Lot Construction',
      content: 'Construction work on Parking Lot B will begin on March 20th and is expected to last for 3 weeks. Alternative parking is available in Lots A and C. Shuttle service will be provided between the affected areas.',
      category: 'Infrastructure',
      priority: 'low',
      date: '2024-03-05',
      author: 'Facilities Management',
      department: 'Facilities',
      isRead: false,
      tags: ['parking', 'construction', 'shuttle']
    },
    {
      id: '6',
      title: 'Career Services Workshop Series',
      content: 'Join us for a series of career development workshops this month. Topics include resume writing, interview preparation, and networking skills. All workshops are free for enrolled students. Registration is required.',
      category: 'Career',
      priority: 'medium',
      date: '2024-03-04',
      author: 'Career Services',
      department: 'Career Development',
      isRead: false,
      tags: ['career', 'workshop', 'development']
    },
    {
      id: '7',
      title: 'Emergency Contact Information Update',
      content: 'All students are required to update their emergency contact information in the student portal by March 31st. This information is crucial for campus safety and emergency response procedures.',
      category: 'Administrative',
      priority: 'high',
      date: '2024-03-03',
      author: 'Student Affairs',
      department: 'Student Affairs',
      isRead: false,
      tags: ['emergency', 'contact', 'safety']
    },
    {
      id: '8',
      title: 'Spring Break Campus Services',
      content: 'During Spring Break (March 18-22), campus services will operate on reduced hours. The dining hall will be closed, but limited food options will be available at the student center. Library hours will be 9:00 AM - 5:00 PM.',
      category: 'Administrative',
      priority: 'low',
      date: '2024-03-02',
      author: 'Student Services',
      department: 'Student Services',
      isRead: true,
      tags: ['spring_break', 'services', 'hours']
    }
  ];

  const categories = ['all', 'Academic', 'Administrative', 'Career', 'Health', 'Infrastructure'];
  const priorities = ['all', 'high', 'medium', 'low'];

  const filteredNotices = dummyNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'text-blue-600 bg-blue-100';
      case 'Administrative': return 'text-purple-600 bg-purple-100';
      case 'Career': return 'text-indigo-600 bg-indigo-100';
      case 'Health': return 'text-pink-600 bg-pink-100';
      case 'Infrastructure': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const markAsRead = (noticeId: string) => {
    // In a real app, this would make an API call
    console.log(`Marked notice ${noticeId} as read`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Notices</h1>
          <p className="text-gray-600">Stay updated with important announcements and information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{dummyNotices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyNotices.filter(n => !n.isRead).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Info className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyNotices.filter(n => n.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${
                !notice.isRead ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedNotice(notice)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                      {!notice.isRead && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(notice.date)}
                    </span>
                    <span>By {notice.author}</span>
                    <span>{notice.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notice.attachments && notice.attachments.length > 0 && (
                      <span className="text-blue-600 text-xs">
                        {notice.attachments.length} attachment(s)
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {notice.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {notice.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{notice.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Detail Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedNotice.title}</h2>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedNotice.priority)}`}>
                        {selectedNotice.priority} Priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedNotice.category)}`}>
                        {selectedNotice.category}
                      </span>
                      {!selectedNotice.isRead && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notice Details</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedNotice.content}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Notice Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-900">{formatDate(selectedNotice.date)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Author:</span>
                          <span className="text-gray-900">{selectedNotice.author}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Department:</span>
                          <span className="text-gray-900">{selectedNotice.department}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${selectedNotice.isRead ? 'text-green-600' : 'text-blue-600'}`}>
                            {selectedNotice.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Attachments</h4>
                        <div className="space-y-2">
                          {selectedNotice.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                              <Tag className="h-4 w-4 mr-2" />
                              {attachment}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotice.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {!selectedNotice.isRead && (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotice.id);
                        setSelectedNotice(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotices; 