import React from 'react';
import { X, Building, Users, UserCheck, Calendar, BarChart2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { DepartmentData } from '../../../api/types/departments';

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentData | null;
}

const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  if (!isOpen || !department) return null;
  
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700' : 'text-red-700';
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
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Department Details</h3>
              <p className="text-sm text-gray-500">View detailed information for {department.name}</p>
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
          {/* Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              {department.logo ? (
                <img src={department.logo} alt={department.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-medium text-white">
                  {department.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{department.name}</h2>
              <p className="text-gray-500">{department.code}</p>
              <div className="mt-2 text-gray-700 text-sm">
                {department.description || 'No description provided.'}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {department.contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{department.contactEmail}</p>
                  </div>
                </div>
              )}
              {department.contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{department.contactPhone}</p>
                  </div>
                </div>
              )}
              {department.location && (
                <div className="flex items-center space-x-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{department.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {department.address && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.address.street && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Street Address</p>
                    <p className="text-sm font-medium text-gray-900">{department.address.street}</p>
                  </div>
                )}
                {department.address.city && (
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-medium text-gray-900">{department.address.city}</p>
                  </div>
                )}
                {department.address.state && (
                  <div>
                    <p className="text-xs text-gray-500">State/Province</p>
                    <p className="text-sm font-medium text-gray-900">{department.address.state}</p>
                  </div>
                )}
                {department.address.postalCode && (
                  <div>
                    <p className="text-xs text-gray-500">Postal Code</p>
                    <p className="text-sm font-medium text-gray-900">{department.address.postalCode}</p>
                  </div>
                )}
                {department.address.country && (
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm font-medium text-gray-900">{department.address.country}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics & Status */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Faculty Count</p>
                <p className="text-sm font-medium text-gray-900">{department.facultyCount ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Student Count</p>
                <p className="text-sm font-medium text-gray-900">{department.studentCount ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-sm font-medium ${getStatusColor(department.status)}`}>
                  {department.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {department.fullName && (
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{department.fullName}</p>
                </div>
              )}
              {department.fullAddress && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Full Address</p>
                  <p className="text-sm font-medium text-gray-900">{department.fullAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">{new Date(department.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="text-sm font-medium text-gray-900">{new Date(department.updatedAt).toLocaleString()}</p>
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

export default ViewDepartmentModal; 