import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Filter, X, Calendar, MapPin, Star, DollarSign, Image as ImageIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Travelpackages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    destination: '',
    priceRange: '',
    duration: '',
    dateFrom: '',
    dateTo: ''
  });

  const PACKAGES_PER_PAGE = 24;

  // Mock data for travel packages
  const mockPackages = [
    {
      id: 1,
      name: 'Kashmir Paradise 5D/4N',
      destination: 'Srinagar, Kashmir',
      duration: '5 Days / 4 Nights',
      price: 25000,
      category: 'Adventure',
      status: 'Active',
      description: 'Experience the breathtaking beauty of Kashmir Valley with our comprehensive tour package.',
      inclusions: 'Accommodation, Meals, Transport, Sightseeing',
      exclusions: 'Personal expenses, Shopping',
      itinerary: 'Day 1: Arrival in Srinagar, Day 2: Dal Lake tour, Day 3: Gulmarg excursion...',
      images: ['image1.jpg', 'image2.jpg'],
      createdAt: '2024-01-15',
      rating: 4.5,
      bookings: 156,
      views: 2340,
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Gulmarg Snow Adventure',
      destination: 'Gulmarg, Kashmir',
      duration: '3 Days / 2 Nights',
      price: 18000,
      category: 'Snow Sports',
      status: 'Active',
      description: 'Perfect winter getaway with snow activities and gondola rides in Gulmarg.',
      inclusions: 'Hotel, Meals, Gondola tickets, Equipment',
      exclusions: 'Personal shopping, Tips',
      itinerary: 'Day 1: Arrival and local sightseeing, Day 2: Gondola and snow activities...',
      images: ['image3.jpg'],
      createdAt: '2024-01-10',
      rating: 4.8,
      bookings: 89,
      views: 1890,
      availability: 'Available'
    },
    {
      id: 3,
      name: 'Pahalgam Romantic Retreat',
      destination: 'Pahalgam, Kashmir',
      duration: '4 Days / 3 Nights',
      price: 35000,
      category: 'Honeymoon',
      status: 'Pending',
      description: 'Romantic honeymoon package with luxury accommodations and private experiences.',
      inclusions: 'Luxury hotel, Candlelight dinner, Horse riding, Private transport',
      exclusions: 'Airfare, Personal expenses',
      itinerary: 'Day 1: Arrival and welcome dinner, Day 2: Betaab Valley tour...',
      images: ['image4.jpg'],
      createdAt: '2024-01-20',
      rating: 4.6,
      bookings: 45,
      views: 1234,
      availability: 'Limited'
    },
    {
      id: 4,
      name: 'Sonamarg Family Adventure',
      destination: 'Sonamarg, Kashmir',
      duration: '6 Days / 5 Nights',
      price: 42000,
      category: 'Family',
      status: 'Active',
      description: 'Family-friendly adventure package with activities suitable for all ages.',
      inclusions: 'Family rooms, All meals, Activities, Guide',
      exclusions: 'Travel insurance, Personal shopping',
      itinerary: 'Day 1: Arrival and orientation, Day 2: Thajiwas Glacier trek...',
      images: ['image5.jpg'],
      createdAt: '2024-01-18',
      rating: 4.4,
      bookings: 78,
      views: 1567,
      availability: 'Available'
    },
    {
      id: 5,
      name: 'Kashmir Cultural Tour',
      destination: 'Multiple Cities',
      duration: '7 Days / 6 Nights',
      price: 38000,
      category: 'Cultural',
      status: 'Inactive',
      description: 'Explore the rich cultural heritage of Kashmir with guided tours and local experiences.',
      inclusions: 'Accommodation, Cultural shows, Local guide, Traditional meals',
      exclusions: 'Shopping, Personal expenses',
      itinerary: 'Day 1: Srinagar heritage walk, Day 2: Traditional craft workshops...',
      images: ['image6.jpg'],
      createdAt: '2024-01-12',
      rating: 4.3,
      bookings: 34,
      views: 987,
      availability: 'Unavailable'
    }
  ];

  // Generate more mock packages for pagination
  const generateMockPackages = () => {
    const categories = ['Adventure', 'Honeymoon', 'Family', 'Cultural', 'Snow Sports', 'Trekking'];
    const destinations = ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Dachigam', 'Yusmarg'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const durations = ['2D/1N', '3D/2N', '4D/3N', '5D/4N', '6D/5N', '7D/6N'];
    
    const additionalPackages = [];
    for (let i = 6; i <= 100; i++) {
      additionalPackages.push({
        id: i,
        name: `Package ${i}`,
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        price: Math.floor(Math.random() * 50000) + 10000,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `This is a sample travel package description for package ${i}.`,
        inclusions: 'Accommodation, Meals, Transport',
        exclusions: 'Personal expenses',
        itinerary: `Sample itinerary for package ${i}`,
        images: [`image${i}.jpg`],
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        bookings: Math.floor(Math.random() * 200) + 10,
        views: Math.floor(Math.random() * 3000) + 500,
        availability: ['Available', 'Limited', 'Unavailable'][Math.floor(Math.random() * 3)]
      });
    }
    return [...mockPackages, ...additionalPackages];
  };

  // Load packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const allPackages = generateMockPackages();
        setPackages(allPackages);
        setFilteredPackages(allPackages);
        setTotalPages(Math.ceil(allPackages.length / PACKAGES_PER_PAGE));
      } catch (error) {
        console.error('Error loading packages:', error);
        toast.error('Failed to load travel packages');
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = packages;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.status) {
      filtered = filtered.filter(pkg => pkg.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(pkg => pkg.category === filters.category);
    }
    if (filters.destination) {
      filtered = filtered.filter(pkg => pkg.destination.toLowerCase().includes(filters.destination.toLowerCase()));
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(pkg => pkg.price >= min && pkg.price <= max);
    }

    setFilteredPackages(filtered);
    setTotalPages(Math.ceil(filtered.length / PACKAGES_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, filters, packages]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * PACKAGES_PER_PAGE;
    const endIndex = startIndex + PACKAGES_PER_PAGE;
    return filteredPackages.slice(startIndex, endIndex);
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
      destination: '',
      priceRange: '',
      duration: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  // Handle add package
  const handleAddPackage = (packageData) => {
    const newPackage = {
      ...packageData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      bookings: 0,
      views: 0,
      availability: 'Available'
    };
    
    setPackages([newPackage, ...packages]);
    setShowAddModal(false);
    toast.success('Travel package added successfully!');
  };

  // Handle delete package
  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
      toast.success('Package deleted successfully!');
    }
  };

  // Handle status toggle
  const handleStatusToggle = (id) => {
    setPackages(packages.map(pkg => 
      pkg.id === id 
        ? { ...pkg, status: pkg.status === 'Active' ? 'Inactive' : 'Active' }
        : pkg
    ));
    toast.success('Package status updated!');
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

  // Package card component
  const PackageCard = ({ pkg }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 text-center text-white">
            <div className="text-4xl mb-2">🏔️</div>
            <p className="text-sm font-medium">{pkg.destination}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={pkg.status} />
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {pkg.duration}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {pkg.name}
          </h3>
          <div className="flex items-center text-yellow-500 text-xs">
            <Star size={12} className="mr-1 fill-current" />
            {pkg.rating}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pkg.description}</p>
        
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            <span>{pkg.destination}</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign size={12} className="mr-1" />
            <span className="text-lg font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{pkg.duration}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {pkg.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              pkg.availability === 'Available' ? 'bg-green-100 text-green-800' :
              pkg.availability === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {pkg.availability}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>{pkg.bookings} bookings</span>
            <span>{pkg.views} views</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setSelectedPackage(pkg);
              setShowDetailsModal(true);
            }}
            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
          >
            <Eye size={12} className="mr-1" />
            View Details
          </button>
          <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer">
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
          Showing {((currentPage - 1) * PACKAGES_PER_PAGE) + 1} to {Math.min(currentPage * PACKAGES_PER_PAGE, filteredPackages.length)} of {filteredPackages.length} packages
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  ? 'bg-indigo-500 text-white cursor-pointer'
                  : typeof page === 'number'
                  ? 'border border-gray-300 hover:bg-gray-50 cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
            <p className="text-gray-600">Manage travel packages and tour offerings across the platform</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center cursor-pointer"
          >
            <Plus size={16} className="mr-2" />
            Add New Package
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
                  placeholder="Search packages, destinations, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center cursor-pointer"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Snow Sports">Snow Sports</option>
                    <option value="Trekking">Trekking</option>
                  </select>
                </div>

                {/* Destination Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Enter destination"
                    value={filters.destination}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Prices</option>
                    <option value="0-15000">₹0 - ₹15,000</option>
                    <option value="15000-25000">₹15,000 - ₹25,000</option>
                    <option value="25000-35000">₹25,000 - ₹35,000</option>
                    <option value="35000-50000">₹35,000 - ₹50,000</option>
                    <option value="50000-999999">₹50,000+</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center cursor-pointer"
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
              Found <span className="font-semibold text-gray-900">{filteredPackages.length}</span> travel packages
              {searchTerm && (
                <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{filteredPackages.filter(pkg => pkg.status === 'Active').length} Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>{filteredPackages.filter(pkg => pkg.status === 'Pending').length} Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>{filteredPackages.filter(pkg => pkg.status === 'Inactive').length} Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getCurrentPageData().map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <Pagination />}
        </>
      ) : (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No travel packages found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(filter => filter !== '')
              ? "Try adjusting your search criteria or filters"
              : "No travel packages have been created yet"}
          </p>
          {(searchTerm || Object.values(filters).some(filter => filter !== '')) && (
            <button
              onClick={clearAllFilters}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Image and Basic Info */}
                <div>
                  <div className="w-full h-64 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center text-white">
                      <div className="text-6xl mb-2">🏔️</div>
                      <p className="text-lg font-medium">{selectedPackage.destination}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPackage.name}</h3>
                      <p className="text-gray-600">{selectedPackage.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <StatusBadge status={selectedPackage.status} />
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="mr-1 fill-current" />
                        {selectedPackage.rating}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <p className="text-gray-900">{selectedPackage.duration}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <p className="text-gray-900">{selectedPackage.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                      <p className="text-gray-900">{selectedPackage.destination}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <p className="text-gray-900">{selectedPackage.availability}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <p className="text-gray-900 text-2xl font-bold">₹{selectedPackage.price.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions</label>
                    <p className="text-gray-900">{selectedPackage.inclusions}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
                    <p className="text-gray-900">{selectedPackage.exclusions}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">{selectedPackage.views.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Views</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{selectedPackage.bookings.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Bookings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{((selectedPackage.bookings / selectedPackage.views) * 100).toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">Conversion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                  <Edit size={16} className="mr-2" />
                  Edit Package
                </button>
                <button
                  onClick={() => handleStatusToggle(selectedPackage.id)}
                  className="flex-1 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Toggle Status
                </button>
                <button
                  onClick={() => handleDeletePackage(selectedPackage.id)}
                  className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal - simplified version matching the style */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Travel Package</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                      <input
                        type="text"
                        placeholder="Enter package name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                      <input
                        type="text"
                        placeholder="Enter destination"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        placeholder="e.g., 5 Days / 4 Nights"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Family">Family</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Snow Sports">Snow Sports</option>
                        <option value="Trekking">Trekking</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        defaultValue="Active"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        rows="4"
                        placeholder="Enter package description"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions</label>
                    <textarea
                      rows="3"
                      placeholder="What's included in this package"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
                    <textarea
                      rows="3"
                      placeholder="What's not included in this package"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Create Package
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

export default Travelpackages;