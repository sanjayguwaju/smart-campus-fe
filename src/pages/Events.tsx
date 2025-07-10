import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Search, Heart, Share2, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useEvents, useRegisterForEvent } from '../api/hooks/useEvents';
import { Event } from '../api/types/events';

const Events: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Use the events hook with search and category filters
  const { data: eventsData, isLoading, error } = useEvents({
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  // Use the register for event hook
  const registerForEvent = useRegisterForEvent();

  const events = (eventsData?.data?.events || []).filter((event: Event) => event.isPublished === true);

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'lecture', label: 'Lectures' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'general', label: 'General' },
  ];

  const filteredEvents = events
    .sort((a: Event, b: Event) => {
      if (sortBy === 'date') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return b.currentAttendees - a.currentAttendees;
    });

  const handleRSVP = (eventId: string) => {
    console.log("eventId", eventId);
    if (!isAuthenticated || !user) {
      toast.error('Please login to RSVP for events');
      return;
    }

    // Prevent admin and faculty from registering for events
    if (user.role === 'admin' || user.role === 'faculty') {
      toast.error('Admin and faculty members cannot register for events');
      return;
    }

    registerForEvent.mutate(eventId);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      lecture: 'bg-green-100 text-green-800',
      sports: 'bg-orange-100 text-orange-800',
      cultural: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">Error loading events</div>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Campus Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exciting events, workshops, and activities happening on our smart campus.
            Join the community and enhance your learning experience.
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
                placeholder="Search events..."
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

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'popularity')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Event location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer
                    </label>
                    <input
                      type="text"
                      placeholder="Event organizer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredEvents.map((event: Event, index: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.images?.[0]?.url || 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.eventType)}`}>
                      {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {formatDate(event.startDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {event.location.venue}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      {event.currentAttendees} / {event.maxAttendees || 'Unlimited'} attendees
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Organized by <span className="font-medium text-gray-700">{event.organizer.fullName}</span>
                    </p>
                  </div>

                  {/* RSVP Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {event.maxAttendees && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRSVP(event._id)}
                      disabled={
                        (event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false) ||
                        (user ? (user.role === 'admin' || user.role === 'faculty') : false)
                      }
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${user && event.attendees.some(attendee => attendee.user && attendee.user._id === user.id)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : user && (user.role === 'admin' || user.role === 'faculty')
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {user && event.attendees.some(attendee => attendee.user && attendee.user._id === user.id)
                        ? 'Registered'
                        : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                          ? 'Full'
                          : user && (user.role === 'admin' || user.role === 'faculty')
                            ? 'Not Available'
                            : 'RSVP'
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Events Found */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new events.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Want to organize an event?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Share your ideas and create memorable experiences for the campus community.
            Contact our events team to get started.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
            Contact Events Team
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;