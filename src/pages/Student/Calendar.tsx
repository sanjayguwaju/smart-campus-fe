import React from 'react';
import { Calendar, Clock, BookOpen, FileText, Users } from 'lucide-react';
import { studentCalendar } from '../../data/studentDummyData';

const CalendarPage: React.FC = () => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Assignment':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Exam':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Quiz':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Event':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'Assignment':
        return <FileText className="h-4 w-4" />;
      case 'Exam':
        return <BookOpen className="h-4 w-4" />;
      case 'Quiz':
        return <FileText className="h-4 w-4" />;
      case 'Event':
        return <Users className="h-4 w-4" />;
      case 'Meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
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

  const formatTime = (timeString: string) => {
    if (timeString === '23:59') return '11:59 PM';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (dateString: string, timeString: string) => {
    const eventDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    return eventDateTime > now;
  };

  const isToday = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: typeof studentCalendar } = {};
    studentCalendar.forEach(event => {
      const date = event.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-600 mt-2">Track your assignments, exams, and events</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold text-blue-600">{studentCalendar.length}</p>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentCalendar.filter(event => isUpcoming(event.date, event.time)).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assignments</p>
              <p className="text-2xl font-bold text-red-600">
                {studentCalendar.filter(event => event.type === 'Assignment').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Exams</p>
              <p className="text-2xl font-bold text-orange-600">
                {studentCalendar.filter(event => event.type === 'Exam').length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-green-600">
                {studentCalendar.filter(event => isToday(event.date)).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Calendar Events */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDate(date)}
                {isToday(date) && (
                  <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Today
                  </span>
                )}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {groupedEvents[date].map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          {event.type}
                        </span>
                        {event.course && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {event.course}
                          </span>
                        )}
                        {isUpcoming(event.date, event.time) && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(event.time)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Add to Calendar
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Set Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Event Type Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {studentCalendar.filter(event => event.type === 'Assignment').length}
            </div>
            <div className="text-sm text-gray-600">Assignments</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {studentCalendar.filter(event => event.type === 'Exam').length}
            </div>
            <div className="text-sm text-gray-600">Exams</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {studentCalendar.filter(event => event.type === 'Quiz').length}
            </div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {studentCalendar.filter(event => event.type === 'Event').length}
            </div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {studentCalendar.filter(event => event.type === 'Meeting').length}
            </div>
            <div className="text-sm text-gray-600">Meetings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 