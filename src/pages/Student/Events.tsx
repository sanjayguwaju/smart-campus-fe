import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { studentEvents } from '../../data/studentDummyData';

const Events: React.FC = () => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Career':
        return 'bg-blue-100 text-blue-800';
      case 'Competition':
        return 'bg-purple-100 text-purple-800';
      case 'Meeting':
        return 'bg-green-100 text-green-800';
      case 'Sports':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional Development':
        return 'bg-indigo-100 text-indigo-800';
      case 'Academic':
        return 'bg-emerald-100 text-emerald-800';
      case 'Student Life':
        return 'bg-pink-100 text-pink-800';
      case 'Recreation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-600 mt-2">Stay updated with all campus activities and events</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold text-blue-600">{studentEvents.length}</p>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentEvents.filter(event => {
                  const eventDate = new Date(event.date);
                  const now = new Date();
                  return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Career Events</p>
              <p className="text-2xl font-bold text-green-600">
                {studentEvents.filter(event => event.type === 'Career').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Academic</p>
              <p className="text-2xl font-bold text-purple-600">
                {studentEvents.filter(event => event.category === 'Academic').length}
              </p>
            </div>
            <Tag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">
                {studentEvents.filter(event => new Date(event.date) > new Date()).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentEvents.map((event) => (
          <div key={event.eventId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Event Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{event.title}</h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Event Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Register
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {studentEvents.filter(event => event.category === 'Professional Development').length}
            </div>
            <div className="text-sm text-gray-600">Professional</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {studentEvents.filter(event => event.category === 'Academic').length}
            </div>
            <div className="text-sm text-gray-600">Academic</div>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">
              {studentEvents.filter(event => event.category === 'Student Life').length}
            </div>
            <div className="text-sm text-gray-600">Student Life</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {studentEvents.filter(event => event.category === 'Recreation').length}
            </div>
            <div className="text-sm text-gray-600">Recreation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 