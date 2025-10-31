import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Travelpackages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    priceRange: '',
    duration: '',
    category: '',
    status: ''
  });
  const [newPackage, setNewPackage] = useState({
    name: '',
    destination: '',
    duration: '',
    price: '',
    category: '',
    description: '',
    inclusions: '',
    exclusions: '',
    itinerary: '',
    images: [],
    status: 'active'
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockPackages = [
      {
        id: 1,
        name: 'Kashmir Paradise 5D/4N',
        destination: 'Srinagar, Kashmir',
        duration: '5 Days / 4 Nights',
        price: 25000,
        category: 'Adventure',
        status: 'active',
        description: 'Experience the beauty of Kashmir',
        inclusions: 'Accommodation, Meals, Transport',
        exclusions: 'Personal expenses',
        itinerary: 'Day 1: Arrival, Day 2: Sightseeing...',
        images: ['image1.jpg', 'image2.jpg'],
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Gulmarg Snow Adventure',
        destination: 'Gulmarg, Kashmir',
        duration: '3 Days / 2 Nights',
        price: 18000,
        category: 'Snow Sports',
        status: 'active',
        description: 'Snow adventure in Gulmarg',
        inclusions: 'Hotel, Meals, Gondola',
        exclusions: 'Shopping, Tips',
        itinerary: 'Day 1: Arrival, Day 2: Gondola...',
        images: ['image3.jpg'],
        createdAt: '2024-01-10'
      }
    ];
    setPackages(mockPackages);
    setFilteredPackages(mockPackages);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = packages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Other filters
    if (filters.destination) {
      filtered = filtered.filter(pkg => pkg.destination.includes(filters.destination));
    }
    if (filters.category) {
      filtered = filtered.filter(pkg => pkg.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(pkg => pkg.status === filters.status);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(pkg => pkg.price >= min && pkg.price <= max);
    }

    setFilteredPackages(filtered);
  }, [searchTerm, filters, packages]);

  const handleAddPackage = (e) => {
    e.preventDefault();
    const packageData = {
      ...newPackage,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      price: Number(newPackage.price)
    };
    
    setPackages([...packages, packageData]);
    setNewPackage({
      name: '',
      destination: '',
      duration: '',
      price: '',
      category: '',
      description: '',
      inclusions: '',
      exclusions: '',
      itinerary: '',
      images: [],
      status: 'active'
    });
    setIsAddModalOpen(false);
    toast.success('Package added successfully!');
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
      toast.success('Package deleted successfully!');
    }
  };

  const handleStatusToggle = (id) => {
    setPackages(packages.map(pkg => 
      pkg.id === id 
        ? { ...pkg, status: pkg.status === 'active' ? 'inactive' : 'active' }
        : pkg
    ));
    toast.success('Package status updated!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Package
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filters.destination}
              onChange={(e) => setFilters({...filters, destination: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Destinations</option>
              <option value="Srinagar">Srinagar</option>
              <option value="Gulmarg">Gulmarg</option>
              <option value="Pahalgam">Pahalgam</option>
              <option value="Sonamarg">Sonamarg</option>
            </select>
          </div>
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Adventure">Adventure</option>
              <option value="Snow Sports">Snow Sports</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Family">Family</option>
            </select>
          </div>
          <div>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              <option value="0-15000">₹0 - ₹15,000</option>
              <option value="15000-25000">₹15,000 - ₹25,000</option>
              <option value="25000-50000">₹25,000 - ₹50,000</option>
              <option value="50000-999999">₹50,000+</option>
            </select>
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  destination: '',
                  priceRange: '',
                  duration: '',
                  category: '',
                  status: ''
                });
              }}
              className="w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 text-center text-white">
                <div className="text-4xl mb-2">🏔️</div>
                <p className="text-sm font-medium">{pkg.destination}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{pkg.destination}</p>
              <p className="text-gray-600 text-sm mb-2">{pkg.duration}</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">₹{pkg.price.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {pkg.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusToggle(pkg.id)}
                    className={`px-3 py-1 rounded text-xs ${
                      pkg.status === 'active'
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No packages found matching your criteria.</p>
        </div>
      )}

      {/* Add Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Travel Package</h2>
            <form onSubmit={handleAddPackage}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={newPackage.destination}
                    onChange={(e) => setNewPackage({...newPackage, destination: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 5 Days / 4 Nights"
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    required
                    value={newPackage.category}
                    onChange={(e) => setNewPackage({...newPackage, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Snow Sports">Snow Sports</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newPackage.status}
                    onChange={(e) => setNewPackage({...newPackage, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Inclusions</label>
                <textarea
                  value={newPackage.inclusions}
                  onChange={(e) => setNewPackage({...newPackage, inclusions: e.target.value})}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Exclusions</label>
                <textarea
                  value={newPackage.exclusions}
                  onChange={(e) => setNewPackage({...newPackage, exclusions: e.target.value})}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Travelpackages;