import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, Plus, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  capacity: number;
  registered: number;
  isRegistered: boolean;
  image?: string;
  tags: string[];
}

const StudentEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const dummyEvents: Event[] = [
    {
      id: '1',
      title: 'Career Fair 2024',
      description: 'Join us for the annual career fair featuring top companies from various industries. Network with professionals and explore internship and job opportunities.',
      date: '2024-03-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Student Center Grand Hall',
      category: 'Career',
      organizer: 'Career Services Office',
      capacity: 200,
      registered: 150,
      isRegistered: true,
      tags: ['networking', 'career', 'jobs']
    },
    {
      id: '2',
      title: 'Spring Music Festival',
      description: 'Celebrate spring with live performances from student bands and local artists. Food trucks and activities throughout the day.',
      date: '2024-03-20',
      time: '2:00 PM - 8:00 PM',
      location: 'Campus Green',
      category: 'Entertainment',
      organizer: 'Student Activities Board',
      capacity: 500,
      registered: 320,
      isRegistered: false,
      tags: ['music', 'festival', 'spring']
    },
    {
      id: '3',
      title: 'Academic Writing Workshop',
      description: 'Improve your academic writing skills with this comprehensive workshop covering research papers, citations, and proper formatting.',
      date: '2024-03-18',
      time: '3:00 PM - 5:00 PM',
      location: 'Library Study Room 201',
      category: 'Academic',
      organizer: 'Writing Center',
      capacity: 30,
      registered: 25,
      isRegistered: true,
      tags: ['academic', 'writing', 'workshop']
    },
    {
      id: '4',
      title: 'Basketball Tournament',
      description: 'Intramural basketball tournament for all skill levels. Form your team and compete for the championship title.',
      date: '2024-03-25',
      time: '9:00 AM - 6:00 PM',
      location: 'Recreation Center Gym',
      category: 'Sports',
      organizer: 'Athletics Department',
      capacity: 100,
      registered: 80,
      isRegistered: false,
      tags: ['sports', 'basketball', 'tournament']
    },
    {
      id: '5',
      title: 'Tech Innovation Summit',
      description: 'Explore the latest trends in technology with industry experts, startup founders, and innovative projects from fellow students.',
      date: '2024-03-22',
      time: '1:00 PM - 6:00 PM',
      location: 'Engineering Building Auditorium',
      category: 'Technology',
      organizer: 'Computer Science Department',
      capacity: 150,
      registered: 120,
      isRegistered: false,
      tags: ['technology', 'innovation', 'startups']
    },
    {
      id: '6',
      title: 'Environmental Awareness Day',
      description: 'Learn about sustainability initiatives, participate in campus clean-up activities, and discover ways to reduce your environmental impact.',
      date: '2024-03-28',
      time: '11:00 AM - 3:00 PM',
      location: 'Campus Various Locations',
      category: 'Community',
      organizer: 'Environmental Club',
      capacity: 200,
      registered: 95,
      isRegistered: true,
      tags: ['environment', 'sustainability', 'community']
    }
  ];

  const categories = ['all', 'Career', 'Entertainment', 'Academic', 'Sports', 'Technology', 'Community'];

  const filteredEvents = dummyEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Career': return 'bg-blue-100 text-blue-800';
      case 'Entertainment': return 'bg-purple-100 text-purple-800';
      case 'Academic': return 'bg-green-100 text-green-800';
      case 'Sports': return 'bg-orange-100 text-orange-800';
      case 'Technology': return 'bg-indigo-100 text-indigo-800';
      case 'Community': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegister = (eventId: string) => {
    // In a real app, this would make an API call
    console.log(`Registered for event ${eventId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
          <p className="text-gray-600">Discover and register for exciting campus events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{dummyEvents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyEvents.filter(e => e.isRegistered).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyEvents.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
                </p>
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
                    placeholder="Search events..."
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
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  {event.isRegistered && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Registered
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Organized by {event.organizer}</span>
                  <span>{event.registered}/{event.capacity} registered</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id);
                  }}
                  disabled={event.isRegistered || event.registered >= event.capacity}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    event.isRegistered
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : event.registered >= event.capacity
                      ? 'bg-red-100 text-red-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {event.isRegistered ? 'Registered' : event.registered >= event.capacity ? 'Full' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-6 w-6 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Event Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedEvent.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">Organized by {selectedEvent.organizer}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Registration</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="text-gray-900">{selectedEvent.capacity} people</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Registered:</span>
                          <span className="text-gray-900">{selectedEvent.registered} people</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="text-gray-900">{selectedEvent.capacity - selectedEvent.registered} spots</span>
                        </div>
                        {selectedEvent.isRegistered && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ You are registered for this event
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag) => (
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
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleRegister(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    disabled={selectedEvent.isRegistered || selectedEvent.registered >= selectedEvent.capacity}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedEvent.isRegistered
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : selectedEvent.registered >= selectedEvent.capacity
                        ? 'bg-red-100 text-red-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedEvent.isRegistered ? 'Already Registered' : selectedEvent.registered >= selectedEvent.capacity ? 'Event Full' : 'Register Now'}
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

export default StudentEvents; 