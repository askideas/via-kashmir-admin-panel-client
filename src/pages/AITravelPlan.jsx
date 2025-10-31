import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Filter, X, Calendar, MapPin, Star, DollarSign, Bot, Users, Heart, UserCheck, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const AITravelPlan = () => {
  const [travelPlans, setTravelPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    tripType: '',
    budget: '',
    duration: '',
    dateFrom: '',
    dateTo: ''
  });

  // Form state for new travel plan
  const [formData, setFormData] = useState({
    location: 'Kashmir',
    startDate: '',
    endDate: '',
    budget: '',
    tripType: ''
  });

  const PLANS_PER_PAGE = 12;

  // Mock data for AI travel plans
  const mockTravelPlans = [
    {
      id: 1,
      title: 'Romantic Kashmir Getaway',
      location: 'Kashmir',
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      duration: '7 days',
      budget: 85000,
      tripType: 'Couple',
      status: 'Generated',
      generatedAt: '2024-10-25',
      highlights: ['Dal Lake Houseboat', 'Gulmarg Skiing', 'Pahalgam Valley', 'Srinagar Gardens'],
      itinerary: [
        { day: 1, activities: 'Arrival in Srinagar, Dal Lake Shikara ride' },
        { day: 2, activities: 'Gulmarg day trip, Gondola ride' },
        { day: 3, activities: 'Pahalgam excursion, Betaab Valley' }
      ],
      aiScore: 95,
      popularity: 4.8,
      bookings: 23
    },
    {
      id: 2,
      title: 'Family Adventure in Paradise',
      location: 'Kashmir',
      startDate: '2024-11-20',
      endDate: '2024-11-28',
      duration: '8 days',
      budget: 120000,
      tripType: 'With Family',
      status: 'Generated',
      generatedAt: '2024-10-22',
      highlights: ['Sonamarg Glacier', 'Dachigam Wildlife', 'Apple Orchards', 'Local Culture Tour'],
      itinerary: [
        { day: 1, activities: 'Arrival and city tour' },
        { day: 2, activities: 'Sonamarg excursion' },
        { day: 3, activities: 'Wildlife sanctuary visit' }
      ],
      aiScore: 92,
      popularity: 4.6,
      bookings: 18
    },
    {
      id: 3,
      title: 'Friends Trek & Adventure',
      location: 'Kashmir',
      startDate: '2024-12-01',
      endDate: '2024-12-06',
      duration: '5 days',
      budget: 45000,
      tripType: 'With Friends',
      status: 'Generating',
      generatedAt: '2024-10-28',
      highlights: ['Trekking Routes', 'Adventure Sports', 'Camping', 'Local Food'],
      itinerary: [
        { day: 1, activities: 'Base camp setup' },
        { day: 2, activities: 'Mountain trekking' },
        { day: 3, activities: 'Adventure activities' }
      ],
      aiScore: 88,
      popularity: 4.4,
      bookings: 12
    }
  ];

  // Generate more mock travel plans
  const generateMockPlans = () => {
    const tripTypes = ['Couple', 'With Family', 'With Friends', 'Solo Travel', 'Business Trip'];
    const statuses = ['Generated', 'Generating', 'Draft', 'Published'];
    const locations = ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Dachigam'];
    
    const additionalPlans = [];
    for (let i = 4; i <= 50; i++) {
      const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10) + 3);
      
      additionalPlans.push({
        id: i,
        title: `Kashmir ${tripTypes[Math.floor(Math.random() * tripTypes.length)]} Plan ${i}`,
        location: 'Kashmir',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        duration: `${Math.floor(Math.random() * 10) + 3} days`,
        budget: Math.floor(Math.random() * 100000) + 30000,
        tripType: tripTypes[Math.floor(Math.random() * tripTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        generatedAt: new Date(2024, Math.floor(Math.random() * 10), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        highlights: ['Scenic Views', 'Local Culture', 'Adventure Activities', 'Photography'],
        itinerary: [
          { day: 1, activities: 'Arrival and orientation' },
          { day: 2, activities: 'Sightseeing tour' },
          { day: 3, activities: 'Adventure activities' }
        ],
        aiScore: Math.floor(Math.random() * 20) + 80,
        popularity: Math.round((Math.random() * 2 + 3) * 10) / 10,
        bookings: Math.floor(Math.random() * 30)
      });
    }
    return [...mockTravelPlans, ...additionalPlans];
  };

  // Load travel plans
  useEffect(() => {
    const loadTravelPlans = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const allPlans = generateMockPlans();
        setTravelPlans(allPlans);
        setFilteredPlans(allPlans);
        setTotalPages(Math.ceil(allPlans.length / PLANS_PER_PAGE));
      } catch (error) {
        console.error('Error loading travel plans:', error);
        toast.error('Failed to load travel plans');
      } finally {
        setLoading(false);
      }
    };

    loadTravelPlans();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = travelPlans;

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tripType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(plan => plan.status === filters.status);
    }
    if (filters.tripType) {
      filtered = filtered.filter(plan => plan.tripType === filters.tripType);
    }
    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(Number);
      filtered = filtered.filter(plan => plan.budget >= min && plan.budget <= max);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(plan => new Date(plan.startDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(plan => new Date(plan.endDate) <= new Date(filters.dateTo));
    }

    setFilteredPlans(filtered);
    setTotalPages(Math.ceil(filtered.length / PLANS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, filters, travelPlans]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * PLANS_PER_PAGE;
    const endIndex = startIndex + PLANS_PER_PAGE;
    return filteredPlans.slice(startIndex, endIndex);
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

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: '',
      tripType: '',
      budget: '',
      duration: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  // Generate AI Travel Plan
  const handleGenerateAIPlan = async () => {
    if (!formData.startDate || !formData.endDate || !formData.budget || !formData.tripType) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsGenerating(true);
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPlan = {
        id: travelPlans.length + 1,
        title: `AI Generated ${formData.tripType} Kashmir Plan`,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: `${Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days`,
        budget: parseInt(formData.budget),
        tripType: formData.tripType,
        status: 'Generated',
        generatedAt: new Date().toISOString().split('T')[0],
        highlights: ['AI Curated Spots', 'Optimized Route', 'Budget Friendly', 'Local Experiences'],
        itinerary: [
          { day: 1, activities: 'AI planned arrival and city exploration' },
          { day: 2, activities: 'Recommended sightseeing based on preferences' },
          { day: 3, activities: 'Adventure activities suited for your group' }
        ],
        aiScore: Math.floor(Math.random() * 10) + 90,
        popularity: Math.round((Math.random() * 1 + 4) * 10) / 10,
        bookings: 0
      };

      setTravelPlans(prev => [newPlan, ...prev]);
      setFilteredPlans(prev => [newPlan, ...prev]);
      
      // Reset form
      setFormData({
        location: 'Kashmir',
        startDate: '',
        endDate: '',
        budget: '',
        tripType: ''
      });
      
      setShowAddModal(false);
      toast.success('AI Travel Plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI travel plan');
    } finally {
      setIsGenerating(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'Generated':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Generating':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Draft':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'Published':
          return 'bg-blue-100 text-blue-800 border-blue-200';
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

  // Trip type icon
  const getTripTypeIcon = (type) => {
    switch (type) {
      case 'Couple': return <Heart size={14} className="text-red-500" />;
      case 'With Family': return <Users size={14} className="text-blue-500" />;
      case 'With Friends': return <UserCheck size={14} className="text-green-500" />;
      case 'Solo Travel': return <Users size={14} className="text-purple-500" />;
      default: return <Users size={14} className="text-gray-500" />;
    }
  };

  // Travel plan card component
  const PlanCard = ({ plan }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{plan.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                {getTripTypeIcon(plan.tripType)}
                <span>{plan.tripType}</span>
              </div>
              <span>•</span>
              <span>{plan.duration}</span>
            </div>
          </div>
          <StatusBadge status={plan.status} />
        </div>

        <div className="space-y-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin size={12} className="mr-1" />
              <span>{plan.location}</span>
            </div>
            <div className="flex items-center">
              <Bot size={12} className="mr-1 text-indigo-500" />
              <span>{plan.aiScore}/100</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{new Date(plan.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Star size={12} className="mr-1 text-yellow-500" />
              <span>{plan.popularity}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign size={12} className="mr-1" />
              <span>₹{plan.budget.toLocaleString()}</span>
            </div>
            <span>{plan.bookings} bookings</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Highlights:</div>
          <div className="flex flex-wrap gap-1">
            {plan.highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs">
                {highlight}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedPlan(plan);
              setShowDetailsModal(true);
            }}
            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
          >
            <Eye size={12} className="mr-1" />
            View Details
          </button>
          <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer">
            <Edit size={12} className="mr-1" />
            Edit Plan
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
          Showing {((currentPage - 1) * PLANS_PER_PAGE) + 1} to {Math.min(currentPage * PLANS_PER_PAGE, filteredPlans.length)} of {filteredPlans.length} travel plans
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="text-indigo-500" />
              AI Travel Plans
            </h1>
            <p className="text-gray-600">Generate and manage AI-powered travel plans for Kashmir</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center cursor-pointer"
          >
            <Plus size={16} className="mr-2" />
            Add AI Travel Plan
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
                  placeholder="Search travel plans, trip types..."
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
                    <option value="Generated">Generated</option>
                    <option value="Generating">Generating</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                {/* Trip Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select
                    value={filters.tripType}
                    onChange={(e) => handleFilterChange('tripType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Trip Types</option>
                    <option value="Couple">Couple</option>
                    <option value="With Family">With Family</option>
                    <option value="With Friends">With Friends</option>
                    <option value="Solo Travel">Solo Travel</option>
                    <option value="Business Trip">Business Trip</option>
                  </select>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <select
                    value={filters.budget}
                    onChange={(e) => handleFilterChange('budget', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Budgets</option>
                    <option value="0-50000">₹0 - ₹50,000</option>
                    <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                    <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                    <option value="200000-999999">₹2,00,000+</option>
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
              Found <span className="font-semibold text-gray-900">{filteredPlans.length}</span> AI travel plans
              {searchTerm && (
                <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{filteredPlans.filter(plan => plan.status === 'Generated').length} Generated</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>{filteredPlans.filter(plan => plan.status === 'Generating').length} Generating</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>{filteredPlans.filter(plan => plan.status === 'Published').length} Published</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Plans Grid */}
      {filteredPlans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {getCurrentPageData().map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <Pagination />}
        </>
      ) : (
        <div className="text-center py-12">
          <Bot size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No travel plans found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(filter => filter !== '')
              ? "Try adjusting your search criteria or filters"
              : "No AI travel plans have been generated yet"}
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

      {/* Add AI Travel Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-indigo-500" />
                Generate AI Travel Plan
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Location (Fixed) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Location is set to Kashmir by default</p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleFormChange('budget', e.target.value)}
                  placeholder="Enter your total budget"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-text"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Total budget for the entire trip</p>
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'Couple', label: 'Couple', icon: <Heart size={16} className="text-red-500" /> },
                    { value: 'With Family', label: 'With Family', icon: <Users size={16} className="text-blue-500" /> },
                    { value: 'With Friends', label: 'With Friends', icon: <UserCheck size={16} className="text-green-500" /> },
                    { value: 'Solo Travel', label: 'Solo Travel', icon: <Users size={16} className="text-purple-500" /> }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleFormChange('tripType', type.value)}
                      className={`p-3 border rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                        formData.tripType === type.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Generation Info */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bot size={20} className="text-indigo-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">AI Travel Plan Generation</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      Our AI will create a personalized itinerary based on your preferences, including attractions, 
                      accommodations, activities, and optimal routes within your budget.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAIPlan}
                  disabled={isGenerating || !formData.startDate || !formData.endDate || !formData.budget || !formData.tripType}
                  className="flex-2 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate AI Travel Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Travel Plan Details Modal */}
      {showDetailsModal && selectedPlan && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bot className="text-indigo-500" />
                {selectedPlan.title}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Plan Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Overview</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-900">{selectedPlan.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Trip Type:</span>
                        <div className="flex items-center gap-1 text-gray-900">
                          {getTripTypeIcon(selectedPlan.tripType)}
                          {selectedPlan.tripType}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Start Date:</span>
                        <p className="text-gray-900">{new Date(selectedPlan.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">End Date:</span>
                        <p className="text-gray-900">{new Date(selectedPlan.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.highlights.map((highlight, index) => (
                        <span key={index} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Itinerary</h3>
                    <div className="space-y-3">
                      {selectedPlan.itinerary.map((day, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                            {day.day}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{day.activities}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Stats and Actions */}
                <div className="space-y-6">
                  <div>
                    <StatusBadge status={selectedPlan.status} />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Plan Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Score:</span>
                        <span className="font-medium text-indigo-600">{selectedPlan.aiScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Popularity:</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          <span className="font-medium">{selectedPlan.popularity}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium text-green-600">₹{selectedPlan.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bookings:</span>
                        <span className="font-medium">{selectedPlan.bookings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                      <Edit size={16} className="mr-2" />
                      Edit Plan
                    </button>
                    <button className="w-full bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                      <Clock size={16} className="mr-2" />
                      Publish Plan
                    </button>
                    <button className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                      <Trash2 size={16} className="mr-2" />
                      Delete Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITravelPlan;