import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Filter, X, Calendar, MapPin, Star, DollarSign, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Vendorsadvertisement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    priceRange: '',
    placement: ''
  });

  const ADS_PER_PAGE = 24;

  // Mock data for advertisements
  const mockAdvertisements = [
    {
      id: 1,
      title: 'Kashmir Valley Trek Adventure',
      vendorName: 'Mountain Explorers',
      vendorId: 'VEN001',
      description: 'Experience the breathtaking beauty of Kashmir Valley with our guided trek packages.',
      category: 'Adventure Tourism',
      location: 'Gulmarg, Kashmir',
      placement: 'Home Screen Banner',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      budget: 50000,
      status: 'Active',
      impressions: 15420,
      clicks: 1240,
      ctr: 8.04,
      imageUrl: 'https://via.placeholder.com/300x200?text=Kashmir+Trek',
      contactInfo: {
        phone: '+91-9876543210',
        email: 'contact@mountainexplorers.com'
      },
      createdAt: '2024-10-15',
      rating: 4.5
    },
    {
      id: 2,
      title: 'Luxury Houseboat Stay',
      vendorName: 'Dal Lake Resorts',
      vendorId: 'VEN002',
      description: 'Stay in traditional Kashmiri houseboats with modern amenities on pristine Dal Lake.',
      category: 'Accommodation',
      location: 'Dal Lake, Srinagar',
      placement: 'Search Results',
      startDate: '2024-11-01',
      endDate: '2025-03-31',
      budget: 75000,
      status: 'Active',
      impressions: 12890,
      clicks: 980,
      ctr: 7.61,
      imageUrl: 'https://via.placeholder.com/300x200?text=Houseboat+Stay',
      contactInfo: {
        phone: '+91-8765432109',
        email: 'bookings@dallakeresorts.com'
      },
      createdAt: '2024-10-20',
      rating: 4.8
    },
    {
      id: 3,
      title: 'Authentic Kashmiri Cuisine Tour',
      vendorName: 'Taste of Kashmir',
      vendorId: 'VEN003',
      description: 'Discover the rich culinary heritage of Kashmir with our food walking tours.',
      category: 'Food & Dining',
      location: 'Srinagar Old City',
      placement: 'Category Page',
      startDate: '2024-10-10',
      endDate: '2024-11-30',
      budget: 25000,
      status: 'Pending',
      impressions: 8560,
      clicks: 420,
      ctr: 4.91,
      imageUrl: 'https://via.placeholder.com/300x200?text=Kashmir+Cuisine',
      contactInfo: {
        phone: '+91-7654321098',
        email: 'info@tasteofkashmir.com'
      },
      createdAt: '2024-10-12',
      rating: 4.2
    },
    {
      id: 4,
      title: 'Pahalgam Horse Riding Experience',
      vendorName: 'Valley Adventures',
      vendorId: 'VEN004',
      description: 'Explore the scenic beauty of Pahalgam on horseback with experienced guides.',
      category: 'Adventure Tourism',
      location: 'Pahalgam, Kashmir',
      placement: 'Home Screen Carousel',
      startDate: '2024-09-15',
      endDate: '2024-12-15',
      budget: 40000,
      status: 'Active',
      impressions: 11200,
      clicks: 890,
      ctr: 7.95,
      imageUrl: 'https://via.placeholder.com/300x200?text=Horse+Riding',
      contactInfo: {
        phone: '+91-6543210987',
        email: 'adventure@valleyadventures.com'
      },
      createdAt: '2024-09-20',
      rating: 4.6
    },
    {
      id: 5,
      title: 'Sonamarg Glacier Expedition',
      vendorName: 'High Altitude Treks',
      vendorId: 'VEN005',
      description: 'Join us for an unforgettable glacier expedition in the pristine Sonamarg region.',
      category: 'Adventure Tourism',
      location: 'Sonamarg, Kashmir',
      placement: 'Push Notification',
      startDate: '2024-11-15',
      endDate: '2025-04-30',
      budget: 80000,
      status: 'Inactive',
      impressions: 5420,
      clicks: 210,
      ctr: 3.87,
      imageUrl: 'https://via.placeholder.com/300x200?text=Glacier+Trek',
      contactInfo: {
        phone: '+91-5432109876',
        email: 'expeditions@highaltitudetreks.com'
      },
      createdAt: '2024-11-10',
      rating: 4.3
    }
  ];

  // Generate more mock advertisements for pagination
  const generateMockAds = () => {
    const categories = ['Adventure Tourism', 'Accommodation', 'Food & Dining', 'Transportation', 'Shopping', 'Cultural Tours'];
    const locations = ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Dal Lake', 'Jammu'];
    const placements = ['Home Screen Banner', 'Search Results', 'Category Page', 'Home Screen Carousel', 'Push Notification', 'In-App Banner'];
    const statuses = ['Active', 'Inactive', 'Pending', 'Expired'];
    
    const additionalAds = [];
    for (let i = 6; i <= 100; i++) {
      additionalAds.push({
        id: i,
        title: `Advertisement ${i}`,
        vendorName: `Vendor ${i}`,
        vendorId: `VEN${String(i).padStart(3, '0')}`,
        description: `This is a sample advertisement description for vendor ${i}.`,
        category: categories[Math.floor(Math.random() * categories.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        placement: placements[Math.floor(Math.random() * placements.length)],
        startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        endDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        budget: Math.floor(Math.random() * 100000) + 10000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        impressions: Math.floor(Math.random() * 20000) + 1000,
        clicks: Math.floor(Math.random() * 2000) + 100,
        ctr: Math.round((Math.random() * 10 + 1) * 100) / 100,
        imageUrl: `https://via.placeholder.com/300x200?text=Ad+${i}`,
        contactInfo: {
          phone: `+91-${9000000000 + i}`,
          email: `vendor${i}@email.com`
        },
        createdAt: new Date(2024, Math.floor(Math.random() * 10), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10
      });
    }
    return [...mockAdvertisements, ...additionalAds];
  };

  // Load advertisements
  useEffect(() => {
    const loadAdvertisements = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const allAds = generateMockAds();
        setAdvertisements(allAds);
        setFilteredAds(allAds);
        setTotalPages(Math.ceil(allAds.length / ADS_PER_PAGE));
      } catch (error) {
        console.error('Error loading advertisements:', error);
        toast.error('Failed to load advertisements');
      } finally {
        setLoading(false);
      }
    };

    loadAdvertisements();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = advertisements;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.status) {
      filtered = filtered.filter(ad => ad.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(ad => ad.category === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter(ad => ad.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.placement) {
      filtered = filtered.filter(ad => ad.placement === filters.placement);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(ad => new Date(ad.startDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(ad => new Date(ad.endDate) <= new Date(filters.dateTo));
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(ad => ad.budget >= min && ad.budget <= max);
    }

    setFilteredAds(filtered);
    setTotalPages(Math.ceil(filtered.length / ADS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, filters, advertisements]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ADS_PER_PAGE;
    const endIndex = startIndex + ADS_PER_PAGE;
    return filteredAds.slice(startIndex, endIndex);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: '',
      category: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      priceRange: '',
      placement: ''
    });
    setSearchTerm('');
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Inactive':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Expired':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
        {status}
      </span>
    );
  };

  // Advertisement card component
  const AdCard = ({ ad }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <ImageIcon size={48} className="text-indigo-400" />
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={ad.status} />
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {ad.placement}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {ad.title}
          </h3>
          <div className="flex items-center text-yellow-500 text-xs">
            <Star size={12} className="mr-1 fill-current" />
            {ad.rating}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{ad.description}</p>
        
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">{ad.vendorName}</span>
            <span className="ml-2 text-gray-400">({ad.vendorId})</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            <span>{ad.location}</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign size={12} className="mr-1" />
            <span>₹{ad.budget.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>{ad.impressions.toLocaleString()} views</span>
            <span>{ad.ctr}% CTR</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setSelectedAd(ad);
              setShowDetailsModal(true);
            }}
            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <Eye size={12} className="mr-1" />
            View Details
          </button>
          <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center">
            <Edit size={12} className="mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  // Pagination component
  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * ADS_PER_PAGE) + 1} to {Math.min(currentPage * ADS_PER_PAGE, filteredAds.length)} of {filteredAds.length} advertisements
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={typeof page !== 'number'}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                page === currentPage
                  ? 'bg-indigo-500 text-white'
                  : typeof page === 'number'
                  ? 'border border-gray-300 hover:bg-gray-50'
                  : 'cursor-default'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Advertisements</h1>
            <p className="text-gray-600">Manage and monitor vendor promotional content across the app</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Advertisement
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search advertisements, vendors, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Filters
              {Object.values(filters).some(filter => filter !== '') && (
                <span className="ml-2 bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5">
                  {Object.values(filters).filter(filter => filter !== '').length}
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Adventure Tourism">Adventure Tourism</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Cultural Tours">Cultural Tours</option>
                  </select>
                </div>

                {/* Placement Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                  <select
                    value={filters.placement}
                    onChange={(e) => handleFilterChange('placement', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Placements</option>
                    <option value="Home Screen Banner">Home Screen Banner</option>
                    <option value="Search Results">Search Results</option>
                    <option value="Category Page">Category Page</option>
                    <option value="Home Screen Carousel">Home Screen Carousel</option>
                    <option value="Push Notification">Push Notification</option>
                    <option value="In-App Banner">In-App Banner</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Budgets</option>
                    <option value="0-25000">₹0 - ₹25,000</option>
                    <option value="25000-50000">₹25,000 - ₹50,000</option>
                    <option value="50000-75000">₹50,000 - ₹75,000</option>
                    <option value="75000-100000">₹75,000 - ₹1,00,000</option>
                    <option value="100000-999999">₹1,00,000+</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                  >
                    <X size={16} className="mr-2" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredAds.length}</span> advertisements
              {searchTerm && (
                <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{filteredAds.filter(ad => ad.status === 'Active').length} Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>{filteredAds.filter(ad => ad.status === 'Pending').length} Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>{filteredAds.filter(ad => ad.status === 'Inactive').length} Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisements Grid */}
      {filteredAds.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getCurrentPageData().map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <Pagination />}
        </>
      ) : (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(filter => filter !== '')
              ? "Try adjusting your search criteria or filters"
              : "No advertisements have been created yet"}
          </p>
          {(searchTerm || Object.values(filters).some(filter => filter !== '')) && (
            <button
              onClick={clearAllFilters}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Advertisement Details Modal */}
      {showDetailsModal && selectedAd && (
        <div className="fixed inset-0 bg-[#000000b0] bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Advertisement Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Image and Basic Info */}
                <div>
                  <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center rounded-lg mb-4">
                    <ImageIcon size={64} className="text-indigo-400" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedAd.title}</h3>
                      <p className="text-gray-600">{selectedAd.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <StatusBadge status={selectedAd.status} />
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="mr-1 fill-current" />
                        {selectedAd.rating}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                      <p className="text-gray-900">{selectedAd.vendorName}</p>
                      <p className="text-sm text-gray-500">{selectedAd.vendorId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <p className="text-gray-900">{selectedAd.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <p className="text-gray-900">{selectedAd.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                      <p className="text-gray-900">{selectedAd.placement}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <p className="text-gray-900">{new Date(selectedAd.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <p className="text-gray-900">{new Date(selectedAd.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <p className="text-gray-900 text-lg font-semibold">₹{selectedAd.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">{selectedAd.impressions.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Impressions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{selectedAd.clicks.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Clicks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{selectedAd.ctr}%</p>
                        <p className="text-sm text-gray-500">CTR</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">Phone: <span className="text-gray-900">{selectedAd.contactInfo.phone}</span></p>
                      <p className="text-gray-600">Email: <span className="text-gray-900">{selectedAd.contactInfo.email}</span></p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center">
                  <Edit size={16} className="mr-2" />
                  Edit Advertisement
                </button>
                <button className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center">
                  <Trash2 size={16} className="mr-2" />
                  Delete Advertisement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Advertisement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000b0] bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Advertisement</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Advertisement Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertisement Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter advertisement title"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Enter advertisement description"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* Vendor Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vendor *
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select a vendor</option>
                        <option value="VEN001">Mountain Explorers</option>
                        <option value="VEN002">Dal Lake Resorts</option>
                        <option value="VEN003">Taste of Kashmir</option>
                        <option value="VEN004">Valley Adventures</option>
                        <option value="VEN005">High Altitude Treks</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Adventure Tourism">Adventure Tourism</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Cultural Tours">Cultural Tours</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter location (e.g., Srinagar, Kashmir)"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertisement Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                        <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-block mt-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Placement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertisement Placement *
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select placement</option>
                        <option value="Home Screen Banner">Home Screen Banner</option>
                        <option value="Search Results">Search Results</option>
                        <option value="Category Page">Category Page</option>
                        <option value="Home Screen Carousel">Home Screen Carousel</option>
                        <option value="Push Notification">Push Notification</option>
                        <option value="In-App Banner">In-App Banner</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter budget amount"
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        defaultValue="Pending"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue="Medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter contact phone number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter contact email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                        Mark as Featured Advertisement
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoRenew"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoRenew" className="ml-2 text-sm text-gray-700">
                        Auto-renew advertisement
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendNotification"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="sendNotification" className="ml-2 text-sm text-gray-700">
                        Send notification to vendor
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="analytics"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="analytics" className="ml-2 text-sm text-gray-700">
                        Enable analytics tracking
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 font-medium"
                  >
                    Create Advertisement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendorsadvertisement;