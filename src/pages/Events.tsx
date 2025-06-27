import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Search, Heart, Share2, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { Event } from '../types';

const eventTypes = [
  'academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'seminar', 'conference', 'other'
];
const eventCategories = [
  'student', 'faculty', 'admin', 'public', 'invitation-only'
];

const defaultForm = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  location: { venue: '' },
  category: 'public',
  eventType: 'academic',
  organizer: '',
  maxAttendees: '',
  image: '',
};

const Events: React.FC = () => {
  const { events, rsvpEvent, loadEvents, addEvent, updateEvent, deleteEvent } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<any>(defaultForm);
  const [modalError, setModalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'lecture', label: 'Lectures' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'general', label: 'General' },
  ];

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const aDate = a.date || a.startDate;
        const bDate = b.date || b.startDate;
        const aTime = aDate ? new Date(aDate).getTime() : 0;
        const bTime = bDate ? new Date(bDate).getTime() : 0;
        return aTime - bTime;
      }
      return b.currentAttendees - a.currentAttendees;
    });

  const handleRSVP = (eventId: string) => {
    if (!isAuthenticated || !user) {
      alert('Please login to RSVP for events');
      return;
    }
    rsvpEvent(eventId, user.id);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    if (typeof date === 'string') {
      if (!date) return '';
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    }
    if (date instanceof Date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    }
    return '';
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

  const isFacultyOrAdmin = user && (user.role === 'faculty' || user.role === 'admin');

  const openCreateModal = () => {
    setEditEvent(null);
    setForm({ ...defaultForm, organizer: user?.id || '' });
    setShowModal(true);
    setModalError(null);
  };

  const openEditModal = (event: Event) => {
    setEditEvent(event);
    setForm({
      title: event.title || '',
      description: event.description || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: { venue: event.location?.venue || '' },
      category: event.category || 'public',
      eventType: event.eventType || 'academic',
      organizer: event.organizer || user?.id || '',
      maxAttendees: event.maxAttendees || '',
      image: event.image || '',
    });
    setShowModal(true);
    setModalError(null);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      setForm((prev: any) => ({ ...prev, location: { ...prev.location, [name.split('.')[1]]: value } }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
        location: { venue: form.location.venue },
        category: form.category,
        eventType: form.eventType,
        organizer: typeof form.organizer === 'object' && form.organizer !== null
          ? form.organizer._id || form.organizer.id || ''
          : form.organizer,
        maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : undefined,
        image: form.image,
        currentAttendees: 0,
        rsvpUsers: [],
      };
      if (editEvent) {
        await updateEvent(editEvent._id || editEvent.id, payload);
      } else {
        await addEvent(payload);
      }
      setShowModal(false);
      setForm(defaultForm);
      setEditEvent(null);
      await loadEvents();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      try {
        await deleteEvent(id);
        await loadEvents();
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      } finally {
        setLoading(false);
      }
    }
  };

  const modal = showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-0">
        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-8 py-4 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-2xl font-bold">{editEvent ? 'Edit Event' : 'Create Event'}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-3xl text-gray-400 hover:text-gray-600 font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-8 py-6">
          {modalError && <div className="mb-4 text-red-600">{modalError}</div>}
          <form onSubmit={handleModalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input name="startTime" type="time" value={form.startTime} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input name="endTime" type="time" value={form.endTime} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input name="location.venue" value={form.location.venue} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  {eventCategories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select name="eventType" value={form.eventType} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  {eventTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                <input name="maxAttendees" type="number" min={1} value={form.maxAttendees} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input name="image" type="text" value={form.image} onChange={handleModalChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 text-right pt-2">
              <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200" disabled={loading}>
                {editEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Event Button (Top Right) */}
        {isFacultyOrAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" /> Create Event
            </button>
          </div>
        )}

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
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
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
                    src={event.image || 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
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
                      {(() => {
                        let dateStr = '';
                        if (typeof event.date === 'string' && event.date) dateStr = event.date;
                        else if (typeof event.startDate === 'string' && event.startDate) dateStr = event.startDate;
                        if (!dateStr || typeof dateStr !== 'string') return '';
                        return dateStr ? formatDate(dateStr) : '';
                      })()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      {event.startTime && event.endTime
                        ? `${event.startTime} - ${event.endTime}`
                        : event.startTime || event.endTime || ''}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {event.location?.venue}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      {event.currentAttendees} / {event.maxAttendees || 'Unlimited'} attendees
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Organized by <span className="font-medium text-gray-700">{
                        typeof event.organizer === 'object' && event.organizer !== null
                          ? ('firstName' in event.organizer && 'lastName' in event.organizer && event.organizer.firstName && event.organizer.lastName
                              ? `${event.organizer.firstName} ${event.organizer.lastName}`
                              : ('email' in event.organizer && event.organizer.email)
                                ? event.organizer.email
                                : ('_id' in event.organizer && event.organizer._id)
                                  ? event.organizer._id
                                  : 'Unknown')
                          : event.organizer
                      }</span>
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
                      onClick={() => handleRSVP(event._id || event.id)}
                      disabled={event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                        user && Array.isArray(event.rsvpUsers) && event.rsvpUsers.includes(user.id)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {user && Array.isArray(event.rsvpUsers) && event.rsvpUsers.includes(user.id)
                        ? 'Registered'
                        : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                        ? 'Full'
                        : 'RSVP'
                      }
                    </button>
                  </div>

                  {/* Edit/Delete Buttons */}
                  {isFacultyOrAdmin && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openEditModal(event)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id || event.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    </div>
                  )}
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

      {/* Modal */}
      {modal}
    </div>
  );
};

export default Events;