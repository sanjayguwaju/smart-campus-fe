import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, Building, GraduationCap, Camera } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUpdateUser } from '../../api/hooks/useUsers';
import { UpdateUserRequest } from '../../api/types/users';
import toast from 'react-hot-toast';

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const updateUserMutation = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserRequest>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = async (data: UpdateUserRequest) => {
    if (!user?.id) {
      toast.error('User information not found');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        userData: data
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      reset(data); // Reset form with new values
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateUserMutation.isPending || !isDirty}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-500">{user?.role}</p>
                <p className="text-sm text-gray-400 mt-1">Student ID: {user?.id}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>


                </div>

                {/* Account Information (Read-only) */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="inline h-4 w-4 mr-1" />
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={user?.id || 'Not assigned'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Status
                      </label>
                      <input
                        type="text"
                        value={user?.isActive ? 'Active' : 'Inactive'}
                        disabled
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 ${
                          user?.isActive ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 