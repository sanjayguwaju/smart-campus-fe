import React from 'react';
import { facultyEvents } from '../../data/facultyDummyData';

const Events: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Faculty Events</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facultyEvents.map(event => (
        <div key={event.eventId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1">
          <span className="font-bold text-purple-700">{event.title}</span>
          <span className="text-sm text-gray-500">{event.date} at {event.time}</span>
          <span className="text-xs text-gray-400">{event.location}</span>
          <span className="text-xs text-gray-400">{event.type}</span>
          <span className="text-gray-600 text-sm mt-1">{event.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Events; 