import React from 'react';
import { Phone, Mail, MapPin, Clock, Users, Building, Heart, Wrench, BookOpen, DollarSign } from 'lucide-react';
import { studentServices } from '../../data/studentDummyData';

const Services: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic':
        return <BookOpen className="h-6 w-6" />;
      case 'Career':
        return <Users className="h-6 w-6" />;
      case 'Health':
        return <Heart className="h-6 w-6" />;
      case 'Technical':
        return <Wrench className="h-6 w-6" />;
      case 'Financial':
        return <DollarSign className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Career':
        return 'bg-green-100 text-green-800';
      case 'Health':
        return 'bg-red-100 text-red-800';
      case 'Technical':
        return 'bg-purple-100 text-purple-800';
      case 'Financial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Services</h1>
          <p className="text-gray-600 mt-2">Access all campus services and support</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Available Services</p>
          <p className="text-2xl font-bold text-blue-600">{studentServices.length}</p>
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Academic</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentServices.filter(service => service.category === 'Academic').length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Career</p>
              <p className="text-2xl font-bold text-green-600">
                {studentServices.filter(service => service.category === 'Career').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Health</p>
              <p className="text-2xl font-bold text-red-600">
                {studentServices.filter(service => service.category === 'Health').length}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Technical</p>
              <p className="text-2xl font-bold text-purple-600">
                {studentServices.filter(service => service.category === 'Technical').length}
              </p>
            </div>
            <Wrench className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentServices.map((service) => (
          <div key={service.serviceId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Service Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(service.category)}
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>

              {/* Service Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{service.hours}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{service.contact}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{service.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book Appointment
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {studentServices.filter(service => service.category === 'Academic').length}
            </div>
            <div className="text-sm text-gray-600">Academic</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {studentServices.filter(service => service.category === 'Career').length}
            </div>
            <div className="text-sm text-gray-600">Career</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {studentServices.filter(service => service.category === 'Health').length}
            </div>
            <div className="text-sm text-gray-600">Health</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {studentServices.filter(service => service.category === 'Technical').length}
            </div>
            <div className="text-sm text-gray-600">Technical</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {studentServices.filter(service => service.category === 'Financial').length}
            </div>
            <div className="text-sm text-gray-600">Financial</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 