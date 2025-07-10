import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Eye,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useEvents,
  usePublishEvent,
  useUnpublishEvent,
} from "../../api/hooks/useEvents";
import { Event } from "../../api/types/events";
import AddEventModal from "../../components/Admin/AddEventModal";
import EditEventModal from "../../components/Admin/EditEventModal";
import DeleteEventModal from "../../components/Admin/DeleteEventModal";
import LoadingSpinner from "../../components/Layout/LoadingSpinner";
import { useAuthStore } from "../../store/authStore";

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [viewedEvent, setViewedEvent] = useState<Event | null>(null);

  // Debounce searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: eventsData,
    isLoading,
    error,
  } = useEvents({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
    eventType: eventTypeFilter,
    status: statusFilter,
  });

  // Debug logging
  console.log('Events component state:', {
    isLoading,
    error,
    eventsData,
    events: eventsData?.data?.events,
    eventsCount: eventsData?.data?.events?.length
  });

  const publishEventMutation = usePublishEvent();
  const unpublishEventMutation = useUnpublishEvent();
  const { user: currentUser } = useAuthStore();

  const events = eventsData?.data?.events || [];
  const pagination = eventsData?.data?.pagination;

  // Permission check function
  const canPublishUnpublishEvent = (event: Event): boolean => {
    if (!currentUser) return false;

    // Admins can publish/unpublish any event
    if (currentUser.role === 'admin') return true;

    // Event organizer can publish/unpublish their own event
    // Check both _id and id fields to handle different ID formats
    const currentUserId = currentUser._id || currentUser.id;
    if (event.organizer._id === currentUserId) return true;

    return false;
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDelete = (event: Event) => {
    setDeletingEvent({ id: event._id, title: event.title });
  };

  const handlePublish = async (event: Event) => {
    // Check permissions before attempting to publish
    if (!canPublishUnpublishEvent(event)) {
      toast.error("You do not have permission to publish this event. Only admins or the event organizer can publish events.");
      return;
    }

    try {
      await publishEventMutation.mutateAsync(event._id);
      toast.success("Event published successfully");
    } catch (error: any) {
      console.error("Failed to publish event:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to publish event. Please try again.");
    }
  };

  const handleUnpublish = async (event: Event) => {
    // Check permissions before attempting to unpublish
    if (!canPublishUnpublishEvent(event)) {
      toast.error("You do not have permission to unpublish this event. Only admins or the event organizer can unpublish events.");
      return;
    }

    try {
      await unpublishEventMutation.mutateAsync(event._id);
      toast.success("Event unpublished successfully");
    } catch (error: any) {
      console.error("Failed to unpublish event:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to unpublish event. Please try again.");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "postponed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const eventTypeColors: Record<string, string> = {
    academic: "bg-blue-50 text-blue-700",
    cultural: "bg-purple-50 text-purple-700",
    sports: "bg-green-50 text-green-700",
    technical: "bg-orange-50 text-orange-700",
    social: "bg-pink-50 text-pink-700",
    workshop: "bg-indigo-50 text-indigo-700",
    seminar: "bg-teal-50 text-teal-700",
    conference: "bg-red-50 text-red-700",
    other: "bg-gray-50 text-gray-700",
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
      {/* Debug info - remove this later */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          Debug: Loading: {isLoading.toString()}, Error: {error ? String(error) : 'none'}, Events count: {events.length}
        </p>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center w-full md:w-1/2 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title or description..."
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="academic">Academic</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="technical">Technical</option>
            <option value="social">Social</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p>There are no events to display. Create your first event to get started.</p>
            </div>
          </div>
        ) : (
          events.map((event) => (
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${eventTypeColors[event.eventType] || "bg-gray-50 text-gray-700"
                    } border border-gray-200`}
                >
                  {event.eventType}
                </span>
                {!event.isPublished ? (
                  <button
                    onClick={() => handlePublish(event)}
                    disabled={publishEventMutation.isPending || !canPublishUnpublishEvent(event)}
                    className={`px-3 py-1 rounded-md transition-colors text-xs font-medium text-white ${canPublishUnpublishEvent(event)
                      ? 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    title={
                      canPublishUnpublishEvent(event)
                        ? 'Publish event'
                        : 'You do not have permission to publish this event'
                    }
                  >
                    Publish
                  </button>
                ) : event.isPublished ? (
                  <button
                    onClick={() => handleUnpublish(event)}
                    disabled={unpublishEventMutation.isPending || !canPublishUnpublishEvent(event)}
                    className={`px-3 py-1 rounded-md transition-colors text-xs font-medium text-white ${canPublishUnpublishEvent(event)
                      ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    title={
                      canPublishUnpublishEvent(event)
                        ? 'Unpublish event'
                        : 'You do not have permission to unpublish this event'
                    }
                  >
                    Unpublish
                  </button>
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-gray-500 mb-4 line-clamp-3 text-sm">
                {event.shortDescription || event.description}
              </p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(event.startDate)} {formatTime(event.startTime)} -{" "}
                  {formatDate(event.endDate)} {formatTime(event.endTime)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {[
                    event.location.venue,
                    event.location.room,
                    event.location.building,
                    event.location.campus,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.currentAttendees} / {event.maxAttendees || "∞"} attendees
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                      event.status
                    )} border border-gray-200`}
                  >
                    {event.status}
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                      } border border-gray-200`}
                  >
                    {event.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
              </div>
              <hr className="my-3" />
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">
                  Created by{" "}
                  {event.organizer?.fullName ||
                    event.organizer?.email ||
                    "Unknown"}
                </span>
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
          ))
        )}
      </div>
    </div>

      {/* Pagination */ }
  {
    pagination && pagination.pages > 1 && (
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
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              results
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
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
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
    )
  }

  {/* View Event Modal */ }
  {
    viewedEvent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={() => setViewedEvent(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">{viewedEvent.title}</h2>
          <p className="text-gray-600 mb-4">{viewedEvent.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="mb-2">
                <span className="font-semibold">Type:</span>{" "}
                {viewedEvent.eventType}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Category:</span>{" "}
                {viewedEvent.category}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    viewedEvent.status
                  )} border border-gray-200`}
                >
                  {viewedEvent.status}
                </span>
              </div>
              <div className="mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />{" "}
                <span>
                  <span className="font-semibold">Start:</span>{" "}
                  {formatDate(viewedEvent.startDate)}{" "}
                  {formatTime(viewedEvent.startTime)}
                </span>
              </div>
              <div className="mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />{" "}
                <span>
                  <span className="font-semibold">End:</span>{" "}
                  {formatDate(viewedEvent.endDate)}{" "}
                  {formatTime(viewedEvent.endTime)}
                </span>
              </div>
              <div className="mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />{" "}
                <span>
                  {[
                    viewedEvent.location.venue,
                    viewedEvent.location.room,
                    viewedEvent.location.building,
                    viewedEvent.location.campus,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-semibold">Organizer:</span>{" "}
                {viewedEvent.organizer?.fullName ||
                  viewedEvent.organizer?.email ||
                  "Unknown"}
              </div>
              {viewedEvent.coOrganizers &&
                viewedEvent.coOrganizers.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold">Co-Organizers:</span>
                    <ul className="list-disc list-inside ml-2">
                      {viewedEvent.coOrganizers.map((co, idx) => (
                        <li key={co._id || idx}>{co.fullName || co.email}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <div className="mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />{" "}
                <span>
                  {viewedEvent.currentAttendees} /{" "}
                  {viewedEvent.maxAttendees || "∞"} attendees
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Registration:</span>{" "}
                {viewedEvent.isRegistrationRequired
                  ? viewedEvent.isRegistrationOpen
                    ? "Open"
                    : "Closed"
                  : "Not required"}
              </div>
              {viewedEvent.registrationDeadline && (
                <div className="mb-2">
                  <span className="font-semibold">
                    Registration Deadline:
                  </span>{" "}
                  {formatDate(viewedEvent.registrationDeadline)}
                </div>
              )}
            </div>
          </div>
          {viewedEvent.tags && viewedEvent.tags.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {viewedEvent.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {viewedEvent.attachments && viewedEvent.attachments.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold">Attachments:</span>
              <ul className="list-disc list-inside ml-2">
                {viewedEvent.attachments.map((att, idx) => (
                  <li key={att.url || idx}>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {att.name || att.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {viewedEvent.contactInfo && (
            <div className="mb-4">
              <span className="font-semibold">Contact Info:</span>
              <div className="ml-2">
                {viewedEvent.contactInfo.email && (
                  <div>Email: {viewedEvent.contactInfo.email}</div>
                )}
                {viewedEvent.contactInfo.phone && (
                  <div>Phone: {viewedEvent.contactInfo.phone}</div>
                )}
                {viewedEvent.contactInfo.website && (
                  <div>
                    Website:{" "}
                    <a
                      href={viewedEvent.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {viewedEvent.contactInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="text-xs text-gray-400 mt-4">
            Created at: {formatDate(viewedEvent.createdAt)} | Updated at:{" "}
            {formatDate(viewedEvent.updatedAt)}
          </div>
        </div>
      </div>
    )
  }

  {/* Modals */ }
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
        eventId={deletingEvent?.id || ""}
        eventTitle={deletingEvent?.title || ""}
      />
    </div >
  );
};

export default Events;
