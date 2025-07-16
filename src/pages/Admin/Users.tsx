import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, UserCheck, UserX, ChevronLeft, ChevronRight, MoreHorizontal, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select, { StylesConfig } from 'react-select';
import { useUsers, useDeleteUser, useActivateUser, useDeactivateUser, useResetPassword } from '../../api/hooks/useUsers';
import { UserData } from '../../api/types/users';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { AddUserModal } from '../../components/Admin/Users';
import { 
  EditUserModal, 
  ResetPasswordModal, 
  DeactivateUserModal, 
  ActivateUserModal, 
  ViewUserModal, 
  UsersFilterDrawer 
} from '../../components/Admin/Users';
import { DeleteConfirmationModal } from '../../components/Admin/Shared';

// Select option interface
interface SelectOption {
  value: string;
  label: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserData | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserData | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState<UserData | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedUserForActivate, setSelectedUserForActivate] = useState<UserData | null>(null);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<UserData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    searchTerm: '',
    dateRange: '',
    isEmailVerified: ''
  });

  // Role filter options
  const roleOptions: SelectOption[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'student', label: 'Student' }
  ];

  // Custom styles for React Select
  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // TanStack Query hooks
  const { data, isLoading, error } = useUsers(currentPage, pageSize);
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const resetPasswordMutation = useResetPassword();

  // Extract users and pagination from data
  const users = data?.users || [];
  const pagination = data?.pagination;

  // Helper function to get display name
  const getDisplayName = (user: UserData) => {
    if (user.displayName && user.displayName !== 'undefined undefined') {
      return user.displayName;
    }
    if (user.fullName && user.fullName !== 'undefined undefined') {
      return user.fullName;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    return user.email;
  };

  // Helper function to get initials
  const getInitials = (user: UserData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return nameParts[0].charAt(0);
    }
    return user.email.charAt(0).toUpperCase();
  };

  // Get unique departments from users
  const departments = Array.from(new Set(users.map((user: UserData) => user.department).filter(Boolean))) as string[];

  const filteredUsers = users.filter((user: UserData) => {
    const displayName = getDisplayName(user);
    
    // Search filter
    const searchMatch = !filters.searchTerm || 
      displayName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Role filter
    const roleMatch = !filters.role || user.role === filters.role;
    
    // Status filter
    const statusMatch = !filters.status || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);
    
    // Department filter
    const departmentMatch = !filters.department || user.department === filters.department;
    
    // Email verification filter
    const emailMatch = !filters.isEmailVerified ||
      (filters.isEmailVerified === 'verified' && user.isEmailVerified) ||
      (filters.isEmailVerified === 'unverified' && !user.isEmailVerified);
    
    // Date range filter
    let dateMatch = true;
    if (filters.dateRange) {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today': {
          dateMatch = userDate.toDateString() === now.toDateString();
          break;
        }
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateMatch = userDate >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateMatch = userDate >= monthAgo;
          break;
        }
        case 'quarter': {
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          dateMatch = userDate >= quarterAgo;
          break;
        }
        case 'year': {
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          dateMatch = userDate >= yearAgo;
          break;
        }
      }
    }
    
    return searchMatch && roleMatch && statusMatch && departmentMatch && emailMatch && dateMatch;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user: UserData) => user._id));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      setSelectedUserForDelete(null);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleDeleteClick = (user: UserData) => {
    setSelectedUserForDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected user(s)?`)) {
      try {
        // Delete users one by one
        for (const userId of selectedUsers) {
          await deleteUserMutation.mutateAsync(userId);
        }
        setSelectedUsers([]); // Clear selection after deletion
        toast.success(`${selectedUsers.length} user(s) deleted successfully`);
      } catch (error) {
        console.error('Failed to delete selected users:', error);
        toast.error('Failed to delete some users. Please try again.');
      }
    }
  };

  const handleActivateUser = (user: UserData) => {
    setSelectedUserForActivate(user);
    setIsActivateModalOpen(true);
  };

  const handleDeactivateUser = (user: UserData) => {
    setSelectedUserForDeactivate(user);
    setIsDeactivateModalOpen(true);
  };

  const handleActivateUserConfirm = async () => {
    if (!selectedUserForActivate) return;
    
    try {
      await activateUserMutation.mutateAsync(selectedUserForActivate._id);
      toast.success('User activated successfully');
      setIsActivateModalOpen(false);
      setSelectedUserForActivate(null);
    } catch (error) {
      console.error('Failed to activate user:', error);
      toast.error('Failed to activate user. Please try again.');
    }
  };

  const handleDeactivateUserConfirm = async () => {
    if (!selectedUserForDeactivate) return;
    
    try {
      await deactivateUserMutation.mutateAsync(selectedUserForDeactivate._id);
      toast.success('User deactivated successfully');
      setIsDeactivateModalOpen(false);
      setSelectedUserForDeactivate(null);
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      toast.error('Failed to deactivate user. Please try again.');
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUserForEdit(user);
    setIsEditUserModalOpen(true);
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUserForView(user);
    setIsViewUserModalOpen(true);
  };

  const handleResetPassword = (user: UserData) => {
    setSelectedUserForReset(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSubmit = async (userId: string, newPassword: string, confirmPassword: string) => {
    try {
      await resetPasswordMutation.mutateAsync({ userId, newPassword, confirmPassword });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    setFilters({
      role: '',
      status: '',
      department: '',
      searchTerm: '',
      dateRange: '',
      isEmailVerified: ''
    });
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getUserId = (user: UserData) => {
    return user.studentId || user.facultyId || user.employeeId || '-';
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]); // Clear selection when changing pages
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedUsers([]); // Clear selection
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load users. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              options={roleOptions}
              value={roleOptions.find(option => option.value === roleFilter)}
              onChange={(selectedOption) => setRoleFilter(selectedOption?.value || 'all')}
              styles={selectStyles}
              placeholder="Select Role"
              isSearchable={false}
              className="w-full"
            />
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {pagination ? `${pagination.total} users found` : `${filteredUsers.length} users found`}
            </h3>
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedUsers.length} selected
                </span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" onClick={handleDeleteSelected}>
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user: UserData) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {getInitials(user)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{getDisplayName(user)}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getUserId(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="relative inline-block dropdown-container">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === user._id ? null : user._id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        title="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {openDropdown === user._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleViewUser(user);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleEditUser(user);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit User
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleResetPassword(user);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Key className="h-4 w-4 mr-3" />
                              Reset Password
                            </button>
                            {user.isActive ? (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleDeactivateUser(user);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <UserX className="h-4 w-4 mr-3" />
                                Deactivate User
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  handleActivateUser(user);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <UserCheck className="h-4 w-4 mr-3" />
                                Activate User
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                                handleDeleteClick(user);
                              }}
                              disabled={deleteUserMutation.isPending}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{pagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Page size selector */}
        {pagination && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        user={selectedUserForEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserForDelete(null);
        }}
        onConfirm={() => {
          if (selectedUserForDelete) {
            handleDeleteUser(selectedUserForDelete._id);
          }
        }}
        user={selectedUserForDelete}
        isLoading={deleteUserMutation.isPending}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal 
        isOpen={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setSelectedUserForReset(null);
        }}
        user={selectedUserForReset}
        onResetPassword={handleResetPasswordSubmit}
        isLoading={resetPasswordMutation.isPending}
      />

      {/* Deactivate User Modal */}
      <DeactivateUserModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedUserForDeactivate(null);
        }}
        onConfirm={handleDeactivateUserConfirm}
        user={selectedUserForDeactivate}
        isLoading={deactivateUserMutation.isPending}
      />

      {/* Activate User Modal */}
      <ActivateUserModal 
        isOpen={isActivateModalOpen}
        onClose={() => {
          setIsActivateModalOpen(false);
          setSelectedUserForActivate(null);
        }}
        onConfirm={handleActivateUserConfirm}
        user={selectedUserForActivate}
        isLoading={activateUserMutation.isPending}
      />

      {/* View User Modal */}
      <ViewUserModal 
        isOpen={isViewUserModalOpen}
        onClose={() => {
          setIsViewUserModalOpen(false);
          setSelectedUserForView(null);
        }}
        user={selectedUserForView}
      />

      {/* Filter Drawer */}
      <UsersFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        departments={departments}
      />
    </div>
  );
};

export default Users; 