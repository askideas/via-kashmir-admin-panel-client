import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Building, 
  Star, 
  Award,
  Clock,
  CreditCard,
  Briefcase,
  Route,
  Gift,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - replace with actual API call
  const mockUserData = {
    id: id,
    name: 'John Doe',
    email: 'john.doe@email.com',
    mobile: '+91-9876543210',
    avatar: null,
    joinDate: '2024-01-15',
    lastLogin: '2024-10-25T14:30:00',
    status: 'Active',
    address: {
      street: '123 Main Street',
      city: 'Srinagar',
      state: 'Jammu & Kashmir',
      pincode: '190001',
      country: 'India'
    },
    personalDetails: {
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      occupation: 'Software Engineer',
      emergencyContact: '+91-9876543211',
      preferences: ['Adventure Tourism', 'Cultural Tours', 'Photography']
    },
    bookings: [
      {
        id: 'BK001',
        packageName: 'Kashmir Valley Tour',
        bookingDate: '2024-10-20',
        travelDate: '2024-11-15',
        status: 'Confirmed',
        amount: 15000,
        guests: 2,
        duration: '5 Days'
      },
      {
        id: 'BK002',
        packageName: 'Gulmarg Adventure',
        bookingDate: '2024-09-10',
        travelDate: '2024-09-25',
        status: 'Completed',
        amount: 8500,
        guests: 1,
        duration: '3 Days'
      },
      {
        id: 'BK003',
        packageName: 'Pahalgam Retreat',
        bookingDate: '2024-08-05',
        travelDate: '2024-08-20',
        status: 'Cancelled',
        amount: 12000,
        guests: 4,
        duration: '4 Days'
      }
    ],
    aiTripPlans: [
      {
        id: 'AI001',
        title: 'Romantic Kashmir Getaway',
        createdDate: '2024-10-18',
        duration: '7 Days',
        budget: 25000,
        destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
        status: 'Generated',
        preferences: ['Romantic', 'Luxury', 'Photography']
      },
      {
        id: 'AI002',
        title: 'Adventure Trek Plan',
        createdDate: '2024-09-15',
        duration: '5 Days',
        budget: 18000,
        destinations: ['Sonamarg', 'Baltal', 'Amarnath'],
        status: 'Booked',
        preferences: ['Adventure', 'Trekking', 'Nature']
      }
    ],
    businessDetails: {
      isVendor: true,
      businessName: 'Kashmir Travel Solutions',
      businessType: 'Travel Agency',
      licenseNumber: 'TL-KSH-2024-001',
      gstNumber: 'GST12345678901',
      registrationDate: '2024-01-10',
      address: {
        street: '456 Business Park',
        city: 'Srinagar',
        state: 'Jammu & Kashmir',
        pincode: '190002'
      },
      services: ['Tour Packages', 'Hotel Booking', 'Transportation'],
      rating: 4.5,
      totalBookings: 156,
      revenue: 450000,
      status: 'Verified'
    },
    loyaltyPoints: {
      totalPoints: 2450,
      currentBalance: 1200,
      totalEarned: 3650,
      totalRedeemed: 2450,
      tier: 'Gold',
      history: [
        {
          id: 'LP001',
          date: '2024-10-20',
          type: 'Earned',
          points: 150,
          description: 'Booking reward for Kashmir Valley Tour',
          bookingId: 'BK001'
        },
        {
          id: 'LP002',
          date: '2024-09-25',
          type: 'Earned',
          points: 85,
          description: 'Booking completion bonus',
          bookingId: 'BK002'
        },
        {
          id: 'LP003',
          date: '2024-09-10',
          type: 'Redeemed',
          points: -500,
          description: 'Discount applied on Gulmarg Adventure',
          bookingId: 'BK002'
        },
        {
          id: 'LP004',
          date: '2024-08-15',
          type: 'Earned',
          points: 200,
          description: 'Referral bonus',
          referralId: 'RF001'
        }
      ]
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setUserData(mockUserData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Error fetching user details. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Confirmed':
      case 'Completed':
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      case 'Generated':
        return 'bg-yellow-100 text-yellow-800';
      case 'Booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get loyalty tier color
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'Silver':
        return 'text-gray-600 bg-gray-100';
      case 'Bronze':
        return 'text-amber-600 bg-amber-100';
      case 'Platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'ai-trips', label: 'AI Trip Plans', icon: Route },
    { id: 'business', label: 'Business Details', icon: Briefcase },
    { id: 'loyalty', label: 'Loyalty Points', icon: Gift }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto font-sans">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto font-sans">
        <div className="text-center py-20">
          <div className="text-slate-400 mb-4">User not found</div>
          <NavLink to="/users" className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">
            Back to Users
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-6">
        <NavLink 
          to="/users" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Users
        </NavLink>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{userData.name}</h1>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(userData.status)}`}>
                  {userData.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} />
                  <span>{userData.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} />
                  <span>Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} />
                  <span>Last login {new Date(userData.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-indigo-500 bg-indigo-50'
                      : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Personal Details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Full Name</label>
                      <p className="text-slate-900 font-medium">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                      <p className="text-slate-900">{new Date(userData.personalDetails.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Gender</label>
                      <p className="text-slate-900">{userData.personalDetails.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Occupation</label>
                      <p className="text-slate-900">{userData.personalDetails.occupation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Emergency Contact</label>
                      <p className="text-slate-900">{userData.personalDetails.emergencyContact}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Address Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Street Address</label>
                      <p className="text-slate-900">{userData.address.street}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">City</label>
                      <p className="text-slate-900">{userData.address.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">State</label>
                      <p className="text-slate-900">{userData.address.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">PIN Code</label>
                      <p className="text-slate-900">{userData.address.pincode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Country</label>
                      <p className="text-slate-900">{userData.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Travel Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.personalDetails.preferences.map((preference, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                      {preference}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Booking History</h2>
                <div className="text-sm text-slate-500">
                  Total Bookings: {userData.bookings.length}
                </div>
              </div>

              <div className="grid gap-4">
                {userData.bookings.map((booking) => (
                  <div key={booking.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{booking.packageName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Booking ID:</span> {booking.id}
                          </div>
                          <div>
                            <span className="font-medium">Travel Date:</span> {new Date(booking.travelDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {booking.duration}
                          </div>
                          <div>
                            <span className="font-medium">Guests:</span> {booking.guests}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-900">₹{booking.amount.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">Amount</div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Trip Plans Tab */}
          {activeTab === 'ai-trips' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">AI Generated Trip Plans</h2>
                <div className="text-sm text-slate-500">
                  Total Plans: {userData.aiTripPlans.length}
                </div>
              </div>

              <div className="grid gap-4">
                {userData.aiTripPlans.map((plan) => (
                  <div key={plan.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{plan.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-sm text-slate-600 mb-3">
                          <div>
                            <span className="font-medium">Duration:</span> {plan.duration}
                          </div>
                          <div>
                            <span className="font-medium">Budget:</span> ₹{plan.budget.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(plan.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-medium text-slate-500">Destinations: </span>
                          <span className="text-sm text-slate-700">{plan.destinations.join(', ')}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {plan.preferences.map((pref, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Details Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              {userData.businessDetails.isVendor ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800">Business Information</h2>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(userData.businessDetails.status)}`}>
                      {userData.businessDetails.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Business Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-700 mb-3">Business Details</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-500">Business Name</label>
                          <p className="text-slate-900 font-medium">{userData.businessDetails.businessName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-500">Business Type</label>
                          <p className="text-slate-900">{userData.businessDetails.businessType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-500">License Number</label>
                          <p className="text-slate-900">{userData.businessDetails.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-500">GST Number</label>
                          <p className="text-slate-900">{userData.businessDetails.gstNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-500">Registration Date</label>
                          <p className="text-slate-900">{new Date(userData.businessDetails.registrationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Business Address & Stats */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-slate-700 mb-3">Business Address</h3>
                        <div className="space-y-2 text-slate-900">
                          <p>{userData.businessDetails.address.street}</p>
                          <p>{userData.businessDetails.address.city}, {userData.businessDetails.address.state}</p>
                          <p>PIN: {userData.businessDetails.address.pincode}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-700 mb-3">Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-slate-900">{userData.businessDetails.rating}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Star size={14} fill="currentColor" className="text-yellow-500" />
                              Rating
                            </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-slate-900">{userData.businessDetails.totalBookings}</div>
                            <div className="text-sm text-slate-500">Bookings</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg col-span-2">
                            <div className="text-2xl font-bold text-slate-900">₹{userData.businessDetails.revenue.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">Total Revenue</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-3">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.businessDetails.services.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Not a Business User</h3>
                  <p className="text-slate-500">This user is not registered as a vendor/business.</p>
                </div>
              )}
            </div>
          )}

          {/* Loyalty Points Tab */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Loyalty Points</h2>

              {/* Points Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{userData.loyaltyPoints.currentBalance}</div>
                      <div className="text-sm opacity-90">Current Balance</div>
                    </div>
                    <Gift className="h-8 w-8 opacity-75" />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userData.loyaltyPoints.totalEarned}</div>
                  <div className="text-sm text-green-700">Total Earned</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{userData.loyaltyPoints.totalRedeemed}</div>
                  <div className="text-sm text-red-700">Total Redeemed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTierColor(userData.loyaltyPoints.tier)}`}>
                      {userData.loyaltyPoints.tier}
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700 mt-2">Member Tier</div>
                </div>
              </div>

              {/* Points History */}
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-4">Points History</h3>
                <div className="space-y-3">
                  {userData.loyaltyPoints.history.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'Earned' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'Earned' ? 
                            <Award size={16} /> : 
                            <CreditCard size={16} />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{transaction.description}</div>
                          <div className="text-sm text-slate-500">
                            {new Date(transaction.date).toLocaleDateString()}
                            {transaction.bookingId && ` • Booking: ${transaction.bookingId}`}
                            {transaction.referralId && ` • Referral: ${transaction.referralId}`}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'Earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'Earned' ? '+' : ''}{transaction.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;