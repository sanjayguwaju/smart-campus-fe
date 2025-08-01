import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Tag, 
  Star, 
  Download,
  Building,
  GraduationCap,
  Award,
  Link,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Image
} from 'lucide-react';
import { Event } from '../../../api/types/events';

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  if (!isOpen || !event) return null;

  // Helper function to get event type icon
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
      case 'workshop':
        return <Award className="h-4 w-4" />;
      case 'seminar':
        return <FileText className="h-4 w-4" />;
      case 'conference':
        return <Users className="h-4 w-4" />;
      case 'sports':
        return <Award className="h-4 w-4" />;
      case 'cultural':
        return <Star className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Helper function to get event type color
  const getEventTypeColor = (eventType: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      seminar: 'bg-purple-100 text-purple-800',
      conference: 'bg-orange-100 text-orange-800',
      sports: 'bg-red-100 text-red-800',
      cultural: 'bg-pink-100 text-pink-800',
      technical: 'bg-indigo-100 text-indigo-800',
      social: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[eventType as keyof typeof colors] || colors.other;
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
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

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Helper function to format time
  const formatTime = (time: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(`2000-01-01T${time}`));
  };

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
              <p className="text-sm text-gray-500">
                View detailed information for {event.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Image and Basic Info */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Event Image */}
            <div className="lg:w-1/3">
              <div className="relative h-48 lg:h-64 rounded-lg overflow-hidden">
                <img
                  src={event.images?.[0]?.url || event.imageUrl || 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Basic Info */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getEventTypeColor(event.eventType)}`}>
                  {getEventTypeIcon(event.eventType)}
                  <span className="ml-1 capitalize">{event.eventType}</span>
                </span>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(event.status)}`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(event.priority)}`}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{event.currentAttendees}</div>
                  <div className="text-sm text-gray-500">Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{event.statistics?.views || 0}</div>
                  <div className="text-sm text-gray-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{event.statistics?.shares || 0}</div>
                  <div className="text-sm text-gray-500">Shares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{event.averageRating || 0}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery - Show if there are multiple images */}
          {event.images && event.images.length > 1 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Event Gallery ({event.images.length} images)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {event.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.caption || `${event.title} - Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        // You can implement a lightbox here
                        window.open(image.url, '_blank');
                      }}
                    />
                    {image.isPrimary && (
                      <div className="absolute top-1 left-1">
                        <span className="px-1 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                          Primary
                        </span>
                      </div>
                    )}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date and Time Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date & Time
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>
                {event.registrationDeadline && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Registration Deadline</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(event.registrationDeadline)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Venue</p>
                    <p className="text-sm font-medium text-gray-900">{event.location.venue}</p>
                  </div>
                </div>
                {event.location.room && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Room</p>
                      <p className="text-sm font-medium text-gray-900">{event.location.room}</p>
                    </div>
                  </div>
                )}
                {event.location.building && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Building</p>
                      <p className="text-sm font-medium text-gray-900">{event.location.building}</p>
                    </div>
                  </div>
                )}
                {event.location.campus && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Campus</p>
                      <p className="text-sm font-medium text-gray-900">{event.location.campus}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Organizer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {event.organizer.firstName.charAt(0)}{event.organizer.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{event.organizer.email}</p>
                </div>
              </div>
              {event.coOrganizers && event.coOrganizers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Co-organizers:</p>
                  <div className="space-y-1">
                    {event.coOrganizers.map((coOrg, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        {coOrg.firstName} {coOrg.lastName}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Registration Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Current Attendees</p>
                  <p className="text-sm font-medium text-gray-900">{event.currentAttendees}</p>
                </div>
              </div>
              {event.maxAttendees && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Maximum Attendees</p>
                    <p className="text-sm font-medium text-gray-900">{event.maxAttendees}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Registration Required</p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.isRegistrationRequired ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Registration Open</p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.isRegistrationOpen ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {event.contactInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.contactInfo.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{event.contactInfo.email}</p>
                    </div>
                  </div>
                )}
                {event.contactInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{event.contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {event.contactInfo.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <p className="text-sm font-medium text-gray-900">{event.contactInfo.website}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags and Categories */}
          {(event.tags && event.tags.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags & Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {event.category}
                </span>
              </div>
            </div>
          )}

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Attachments
              </h4>
              <div className="space-y-2">
                {event.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{attachment.name}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {event.externalLinks && event.externalLinks.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Link className="h-4 w-4 mr-2" />
                External Links
              </h4>
              <div className="space-y-2">
                {event.externalLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-gray-400" />
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {link.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Event Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(event.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(event.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal; 