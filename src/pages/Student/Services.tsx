import React, { useState } from 'react';
import { Settings, Clock, MapPin, Phone, Mail, Calendar, Search, Filter, Plus, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  hours: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'closed';
  waitTime?: string;
  appointmentRequired: boolean;
  services: string[];
}

interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const StudentServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const dummyServices: Service[] = [
    {
      id: '1',
      name: 'Student Health Center',
      description: 'Comprehensive health services including physical exams, immunizations, mental health counseling, and urgent care.',
      category: 'Health',
      location: 'Student Center, 2nd Floor',
      hours: 'Mon-Fri 8:00 AM - 6:00 PM, Sat 9:00 AM - 2:00 PM',
      phone: '(555) 123-4567',
      email: 'health@university.edu',
      status: 'available',
      waitTime: '15 minutes',
      appointmentRequired: true,
      services: ['Physical Exams', 'Immunizations', 'Mental Health', 'Urgent Care', 'Lab Tests']
    },
    {
      id: '2',
      name: 'Career Services Office',
      description: 'Career counseling, resume reviews, interview preparation, job search assistance, and internship opportunities.',
      category: 'Career',
      location: 'Business Building, Room 201',
      hours: 'Mon-Fri 9:00 AM - 5:00 PM',
      phone: '(555) 123-4568',
      email: 'career@university.edu',
      status: 'available',
      appointmentRequired: true,
      services: ['Career Counseling', 'Resume Review', 'Interview Prep', 'Job Search', 'Internships']
    },
    {
      id: '3',
      name: 'IT Help Desk',
      description: 'Technical support for computer issues, software installation, network connectivity, and device troubleshooting.',
      category: 'Technology',
      location: 'Library, 1st Floor',
      hours: 'Mon-Fri 8:00 AM - 8:00 PM, Sat-Sun 10:00 AM - 6:00 PM',
      phone: '(555) 123-4569',
      email: 'helpdesk@university.edu',
      status: 'busy',
      waitTime: '45 minutes',
      appointmentRequired: false,
      services: ['Computer Repair', 'Software Support', 'Network Issues', 'Device Setup', 'Password Reset']
    },
    {
      id: '4',
      name: 'Financial Aid Office',
      description: 'Assistance with scholarships, grants, loans, work-study programs, and financial planning.',
      category: 'Financial',
      location: 'Administration Building, Room 105',
      hours: 'Mon-Fri 8:00 AM - 5:00 PM',
      phone: '(555) 123-4570',
      email: 'finaid@university.edu',
      status: 'available',
      appointmentRequired: true,
      services: ['Scholarships', 'Grants', 'Loans', 'Work-Study', 'Financial Planning']
    },
    {
      id: '5',
      name: 'Writing Center',
      description: 'Free writing assistance for essays, research papers, creative writing, and academic projects.',
      category: 'Academic',
      location: 'Humanities Building, Room 301',
      hours: 'Mon-Thu 9:00 AM - 8:00 PM, Fri 9:00 AM - 5:00 PM',
      phone: '(555) 123-4571',
      email: 'writing@university.edu',
      status: 'available',
      waitTime: '10 minutes',
      appointmentRequired: false,
      services: ['Essay Writing', 'Research Papers', 'Creative Writing', 'Grammar Help', 'Citation Support']
    },
    {
      id: '6',
      name: 'Counseling Center',
      description: 'Professional mental health services including individual therapy, group sessions, and crisis intervention.',
      category: 'Health',
      location: 'Student Center, 3rd Floor',
      hours: 'Mon-Fri 9:00 AM - 5:00 PM',
      phone: '(555) 123-4572',
      email: 'counseling@university.edu',
      status: 'available',
      appointmentRequired: true,
      services: ['Individual Therapy', 'Group Sessions', 'Crisis Intervention', 'Stress Management', 'Academic Support']
    },
    {
      id: '7',
      name: 'Housing Office',
      description: 'On-campus housing applications, room assignments, maintenance requests, and housing policies.',
      category: 'Housing',
      location: 'Residence Hall A, Ground Floor',
      hours: 'Mon-Fri 8:00 AM - 6:00 PM',
      phone: '(555) 123-4573',
      email: 'housing@university.edu',
      status: 'busy',
      waitTime: '30 minutes',
      appointmentRequired: false,
      services: ['Housing Applications', 'Room Assignments', 'Maintenance Requests', 'Housing Policies', 'Room Changes']
    },
    {
      id: '8',
      name: 'Library Services',
      description: 'Research assistance, book borrowing, study spaces, printing services, and digital resources.',
      category: 'Academic',
      location: 'Main Library',
      hours: 'Mon-Thu 7:00 AM - 11:00 PM, Fri 7:00 AM - 8:00 PM, Sat-Sun 10:00 AM - 8:00 PM',
      phone: '(555) 123-4574',
      email: 'library@university.edu',
      status: 'available',
      appointmentRequired: false,
      services: ['Research Help', 'Book Borrowing', 'Study Spaces', 'Printing', 'Digital Resources']
    }
  ];

  const dummyAppointments: Appointment[] = [
    {
      id: '1',
      serviceId: '1',
      serviceName: 'Student Health Center',
      date: '2024-03-15',
      time: '2:00 PM',
      status: 'scheduled',
      notes: 'Annual physical examination'
    },
    {
      id: '2',
      serviceId: '2',
      serviceName: 'Career Services Office',
      date: '2024-03-12',
      time: '10:00 AM',
      status: 'completed',
      notes: 'Resume review session'
    }
  ];

  const categories = ['all', 'Health', 'Career', 'Technology', 'Financial', 'Academic', 'Housing'];

  const filteredServices = dummyServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health': return 'text-red-600 bg-red-100';
      case 'Career': return 'text-blue-600 bg-blue-100';
      case 'Technology': return 'text-purple-600 bg-purple-100';
      case 'Financial': return 'text-green-600 bg-green-100';
      case 'Academic': return 'text-indigo-600 bg-indigo-100';
      case 'Housing': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBookAppointment = (serviceId: string) => {
    // In a real app, this would open an appointment booking form
    console.log(`Booking appointment for service ${serviceId}`);
    setShowAppointmentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Services</h1>
          <p className="text-gray-600">Access campus services and book appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{dummyServices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyServices.filter(s => s.status === 'available').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{dummyAppointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
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
                    placeholder="Search services..."
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {service.hours}
                  </div>
                  {service.waitTime && (
                    <div className="flex items-center text-sm text-yellow-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Wait time: {service.waitTime}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                  {service.appointmentRequired && (
                    <span className="text-xs text-blue-600 font-medium">Appointment Required</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {service.services.slice(0, 3).map((serviceItem) => (
                    <span
                      key={serviceItem}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {serviceItem}
                    </span>
                  ))}
                  {service.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{service.services.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${service.phone}`;
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${service.email}`;
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </button>
                  {service.appointmentRequired && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAppointment(service.id);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                        {selectedService.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedService.category)}`}>
                        {selectedService.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-6 w-6 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedService.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedService.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedService.hours}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedService.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{selectedService.email}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Service Details</h4>
                      <div className="space-y-3">
                        {selectedService.waitTime && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current Wait Time:</span>
                            <span className="text-yellow-600 font-medium">{selectedService.waitTime}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Appointment Required:</span>
                          <span className={`font-medium ${selectedService.appointmentRequired ? 'text-red-600' : 'text-green-600'}`}>
                            {selectedService.appointmentRequired ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Available Services</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedService.services.map((serviceItem) => (
                        <div
                          key={serviceItem}
                          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg"
                        >
                          {serviceItem}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  {selectedService.appointmentRequired && (
                    <button
                      onClick={() => {
                        handleBookAppointment(selectedService.id);
                        setSelectedService(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Booking Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Appointment</h3>
                <p className="text-gray-600 mb-6">
                  Appointment booking functionality would be implemented here with a form for date, time, and service selection.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book
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

export default StudentServices; 