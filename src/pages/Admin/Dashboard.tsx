import React from 'react';
import { Users, Calendar, FileText, GraduationCap, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Active Events',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      name: 'Published Notices',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Programs',
      value: '45',
      change: '+2%',
      changeType: 'positive',
      icon: GraduationCap,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'New student registered: John Doe',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'event',
      message: 'Event "Tech Workshop" created',
      time: '15 minutes ago',
    },
    {
      id: 3,
      type: 'notice',
      message: 'Notice "Exam Schedule" published',
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'program',
      message: 'Program "Computer Science" updated',
      time: '2 hours ago',
    },
  ];

  const quickActions = [
    { name: 'Add User', href: '/admin/users/new', icon: Users },
    { name: 'Create Event', href: '/admin/events/new', icon: Calendar },
    { name: 'Post Notice', href: '/admin/notices/new', icon: FileText },
    { name: 'Add Program', href: '/admin/programs/new', icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your campus.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">{stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="mr-3 h-5 w-5 text-blue-600" />
                    {action.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 