import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Eye, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useEvents, usePublishEvent, useUnpublishEvent } from '../../api/hooks/useEvents';
import { Event } from '../../api/types/events';
import { 
  AddEventModal, 
  EditEventModal, 
  DeleteEventModal, 
  ViewEventModal, 
  EventsFilterDrawer 
} from '../../components/Admin/Events';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const Events: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{ id: string; title: string } | null>(null);
  const [viewedEvent, setViewedEvent] = useState<Event | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    eventType: '',
    status: '',
    category: '',
    searchTerm: '',
    dateRange: '',
    featured: '',
    location: '',
  });

  // Debounce searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [filters.searchTerm]);

  const { data: eventsData, isLoading, error } = useEvents({
    page: currentPage,
    limit: 10,
    search: filters.searchTerm,
    eventType: filters.eventType,
    status: filters.status
  });

  const publishEventMutation = usePublishEvent();
  const unpublishEventMutation = useUnpublishEvent();

  const events = eventsData?.events || [];
  const pagination = eventsData?.pagination;

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDelete = (event: Event) => {
    setDeletingEvent({ id: event._id, title: event.title });
  };

  const handlePublish = async (event: Event) => {
    try {
      await publishEventMutation.mutateAsync(event._id);
      toast.success('Event published successfully');
    } catch (error) {
      console.error('Failed to publish event:', error);
      toast.error('Failed to publish event. Please try again.');
    }
  };

  const handleUnpublish = async (event: Event) => {
    try {
      await unpublishEventMutation.mutateAsync(event._id);
      toast.success('Event unpublished successfully');
    } catch (error) {
      console.error('Failed to unpublish event:', error);
      toast.error('Failed to unpublish event. Please try again.');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventTypeColors: Record<string, string> = {
    academic: 'bg-blue-50 text-blue-700',
    cultural: 'bg-purple-50 text-purple-700',
    sports: 'bg-green-50 text-green-700',
    technical: 'bg-orange-50 text-orange-700',
    social: 'bg-pink-50 text-pink-700',
    workshop: 'bg-indigo-50 text-indigo-700',
    seminar: 'bg-teal-50 text-teal-700',
    conference: 'bg-red-50 text-red-700',
    other: 'bg-gray-50 text-gray-700',
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading events: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage all events in the system</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow p-7 flex flex-col border border-gray-100 hover:shadow-xl transition-shadow"
          >
            {/* Event Image */}
            {event.imageUrl && (
              <div className="mb-4">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${eventTypeColors[event.eventType] || 'bg-gray-50 text-gray-700'} border border-gray-200`}>{event.eventType}</span>
              {!event.isPublished ? (
                <button
                  onClick={() => handlePublish(event)}
                  disabled={publishEventMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                >
                  Publish
                </button>
              ) : event.isPublished ? (
                <button
                  onClick={() => handleUnpublish(event)}
                  disabled={unpublishEventMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                >
                  Unpublish
                </button>
              ) : null}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
            <p className="text-gray-500 mb-4 line-clamp-3 text-sm">{event.shortDescription || event.description}</p>
            <div className="space-y-2 mb-5">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(event.startDate)} {formatTime(event.startTime)} - {formatDate(event.endDate)} {formatTime(event.endTime)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {[event.location.venue, event.location.room, event.location.building, event.location.campus].filter(Boolean).join(', ')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {event.currentAttendees} / {event.maxAttendees || '∞'} attendees
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(event.status)} border border-gray-200`}>{event.status}</span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.isPublished ? null : 'bg-gray-100 text-gray-800'} `}>
                  {event.isPublished ? null : 'Unpublished'}
                </span>
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">Created by {event.organizer?.firstName && event.organizer?.lastName ? `${event.organizer.firstName} ${event.organizer.lastName}` : event.organizer?.email || 'Unknown'}</span>
              <div className="flex items-center space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-900"
                  title="View Event"
                  onClick={() => setViewedEvent(event)}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(event)}
                  className="text-green-600 hover:text-green-900"
                  title="Edit Event"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(event)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete Event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pagination.limit, pagination.total)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{pagination.total}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      <ViewEventModal
        isOpen={!!viewedEvent}
        onClose={() => setViewedEvent(null)}
        event={viewedEvent}
      />

      {/* Modals */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
      />

      <DeleteEventModal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        eventId={deletingEvent?.id || ''}
        eventTitle={deletingEvent?.title || ''}
      />

      {/* Filter Drawer */}
      <EventsFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onClearFilters={() => {
          setFilters({
            eventType: '',
            status: '',
            category: '',
            searchTerm: '',
            dateRange: '',
            featured: '',
            location: '',
          });
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default Events; 