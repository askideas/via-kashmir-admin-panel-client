import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bell, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Plus,
  X,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Tag,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';

const Appnotifications = () => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'all', // all, category, specific
    category: '',
    userIds: '',
    scheduledTime: '',
    priority: 'medium', // low, medium, high
    notificationType: 'general', // general, promotion, alert, reminder
    actionUrl: '',
    imageUrl: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = (import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app/').replace(/\/$/, '') + '/';

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: 'Special Kashmir Tour Offer',
      message: 'Get 20% off on all Kashmir tour packages this weekend!',
      targetAudience: 'all',
      category: 'All Users',
      createdDate: '2024-10-25T10:30:00',
      scheduledTime: '2024-10-25T12:00:00',
      status: 'sent',
      priority: 'high',
      notificationType: 'promotion',
      sentCount: 1250,
      openedCount: 890,
      clickedCount: 234,
      imageUrl: null,
      actionUrl: '/tours/kashmir'
    },
    {
      id: 2,
      title: 'Booking Confirmation Required',
      message: 'Please confirm your upcoming booking for Gulmarg Adventure trip.',
      targetAudience: 'specific',
      category: 'Specific Users',
      createdDate: '2024-10-24T15:45:00',
      scheduledTime: '2024-10-24T16:00:00',
      status: 'sent',
      priority: 'medium',
      notificationType: 'reminder',
      sentCount: 45,
      openedCount: 42,
      clickedCount: 38,
      imageUrl: null,
      actionUrl: '/bookings/confirm'
    },
    {
      id: 3,
      title: 'New Destination Added',
      message: 'Explore our new destination: Ladakh Adventure packages now available!',
      targetAudience: 'category',
      category: 'Adventure Travelers',
      createdDate: '2024-10-23T09:15:00',
      scheduledTime: '2024-10-23T18:00:00',
      status: 'scheduled',
      priority: 'medium',
      notificationType: 'general',
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      imageUrl: '/images/ladakh.jpg',
      actionUrl: '/destinations/ladakh'
    },
    {
      id: 4,
      title: 'System Maintenance Alert',
      message: 'Our app will be under maintenance from 2 AM to 4 AM IST tonight.',
      targetAudience: 'all',
      category: 'All Users',
      createdDate: '2024-10-22T14:20:00',
      scheduledTime: '2024-10-22T20:00:00',
      status: 'sent',
      priority: 'high',
      notificationType: 'alert',
      sentCount: 2100,
      openedCount: 1890,
      clickedCount: 145,
      imageUrl: null,
      actionUrl: null
    },
    {
      id: 5,
      title: 'Payment Reminder',
      message: 'Your payment for Kashmir Valley Tour is due in 2 days.',
      targetAudience: 'specific',
      category: 'Pending Payments',
      createdDate: '2024-10-21T11:30:00',
      scheduledTime: null,
      status: 'draft',
      priority: 'low',
      notificationType: 'reminder',
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      imageUrl: null,
      actionUrl: '/payments/pending'
    }
  ];

  // Categories for targeting
  const userCategories = [
    'Adventure Travelers',
    'Cultural Tourists',
    'Family Travelers',
    'Solo Travelers',
    'Business Travelers',
    'Photography Enthusiasts',
    'Honeymoon Couples',
    'Budget Travelers',
    'Luxury Travelers',
    'Frequent Bookers'
  ];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}api/notifications`);
      // const data = await response.json();
      
      // Using mock data
      setTimeout(() => {
        setNotifications(mockNotifications);
        setFilteredNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Error fetching notifications. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      setLoading(false);
    }
  };

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (searchTerm.trim()) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(notification => notification.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(notification => notification.category === categoryFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(notification => {
        const notificationDate = new Date(notification.createdDate).toISOString().split('T')[0];
        return notificationDate === dateFilter;
      });
    }

    setFilteredNotifications(filtered);
  }, [searchTerm, statusFilter, categoryFilter, dateFilter, notifications]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return;
    }

    if (formData.targetAudience === 'category' && !formData.category) {
      toast.error('Please select a user category.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return;
    }

    if (formData.targetAudience === 'specific' && !formData.userIds.trim()) {
      toast.error('Please enter user IDs for specific targeting.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}api/notifications`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Mock success
      setTimeout(() => {
        toast.success('Notification sent successfully!', {
          autoClose: 1500,
          hideProgressBar: true
        });
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          targetAudience: 'all',
          category: '',
          userIds: '',
          scheduledTime: '',
          priority: 'medium',
          notificationType: 'general',
          actionUrl: '',
          imageUrl: ''
        });
        setShowSendForm(false);
        
        // Refresh notifications list
        fetchNotifications();
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      toast.error('Error sending notification. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      setSubmitting(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get notification type icon
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'promotion':
        return <Tag className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto font-sans px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">App Notifications</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Send and manage push notifications to your users</p>
        </div>
        
        <button
          onClick={() => setShowSendForm(true)}
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Send Notification
        </button>
      </div>

      {/* Send Notification Form */}
      {showSendForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Send New Notification</h2>
            <button
              onClick={() => setShowSendForm(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter notification title"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter notification message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="category">Specific Category</option>
                    <option value="specific">Specific Users</option>
                  </select>
                </div>

                {formData.targetAudience === 'category' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      User Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {userCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.targetAudience === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      User IDs (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.userIds}
                      onChange={(e) => setFormData({ ...formData, userIds: e.target.value })}
                      placeholder="e.g., 123, 456, 789"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    value={formData.notificationType}
                    onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="general">General</option>
                    <option value="promotion">Promotion</option>
                    <option value="alert">Alert</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Schedule Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Action URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.actionUrl}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                    placeholder="https://example.com/action"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={16} />
                {submitting ? 'Sending...' : 'Send Now'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowSendForm(false)}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Notification History</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Filter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications by title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Categories</option>
                <option value="All Users">All Users</option>
                <option value="Specific Users">Specific Users</option>
                {userCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCategoryFilter('');
                  setDateFilter('');
                }}
                className="w-full px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 cursor-pointer text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">
              All Notifications ({filteredNotifications.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <div className="text-slate-400 mb-2">
                {searchTerm || statusFilter || categoryFilter || dateFilter 
                  ? 'No notifications found matching your search' 
                  : 'No notifications sent yet'}
              </div>
              {!searchTerm && !statusFilter && !categoryFilter && !dateFilter && (
                <button
                  onClick={() => setShowSendForm(true)}
                  className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer"
                >
                  Send your first notification
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-1 rounded ${getPriorityColor(notification.priority)}`}>
                              {getNotificationTypeIcon(notification.notificationType)}
                            </div>
                            <h3 className="font-semibold text-slate-900 text-lg">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-slate-700 mb-3">{notification.message}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-sm text-slate-600 mb-3">
                        <div>
                          <span className="font-medium">Target:</span> {notification.category}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(notification.createdDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Sent:</span> {notification.sentCount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Opened:</span> {notification.openedCount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Clicked:</span> {notification.clickedCount.toLocaleString()}
                        </div>
                      </div>

                      {notification.scheduledTime && (
                        <div className="text-sm text-slate-600 mb-2">
                          <Clock size={14} className="inline mr-1" />
                          Scheduled: {new Date(notification.scheduledTime).toLocaleString()}
                        </div>
                      )}

                      {notification.actionUrl && (
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Action URL:</span>
                          <a href={notification.actionUrl} className="text-indigo-600 hover:text-indigo-800 ml-1 cursor-pointer">
                            {notification.actionUrl}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-2">
                      {notification.status === 'sent' && (
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-1">Open Rate</div>
                          <div className="text-lg font-semibold text-indigo-600">
                            {notification.sentCount > 0 
                              ? Math.round((notification.openedCount / notification.sentCount) * 100)
                              : 0}%
                          </div>
                        </div>
                      )}
                      
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appnotifications;