import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Search, Eye, ChevronLeft, ChevronRight, Calendar, Phone, User } from 'lucide-react';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const USERS_PER_PAGE = 22;
  const API_BASE_URL = (import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app/').replace(/\/$/, '') + '/';

  // Mock data for demonstration - replace with actual API call
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', mobile: '+91-9876543210', joinDate: '2024-01-15', status: 'Active', avatar: null },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', mobile: '+91-8765432109', joinDate: '2024-02-20', status: 'Active', avatar: null },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@email.com', mobile: '+91-7654321098', joinDate: '2024-03-10', status: 'Inactive', avatar: null },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', mobile: '+91-6543210987', joinDate: '2024-01-25', status: 'Active', avatar: null },
    { id: 5, name: 'David Brown', email: 'david.brown@email.com', mobile: '+91-5432109876', joinDate: '2024-04-05', status: 'Active', avatar: null },
    { id: 6, name: 'Emma Davis', email: 'emma.davis@email.com', mobile: '+91-4321098765', joinDate: '2024-02-14', status: 'Pending', avatar: null },
    { id: 7, name: 'Chris Miller', email: 'chris.miller@email.com', mobile: '+91-3210987654', joinDate: '2024-03-20', status: 'Active', avatar: null },
    { id: 8, name: 'Lisa Garcia', email: 'lisa.garcia@email.com', mobile: '+91-2109876543', joinDate: '2024-04-12', status: 'Active', avatar: null },
    { id: 9, name: 'Tom Anderson', email: 'tom.anderson@email.com', mobile: '+91-1098765432', joinDate: '2024-01-08', status: 'Inactive', avatar: null },
    { id: 10, name: 'Amy Taylor', email: 'amy.taylor@email.com', mobile: '+91-9087654321', joinDate: '2024-03-30', status: 'Active', avatar: null }
  ];

  // Generate more mock users for pagination demo
  const generateMockUsers = () => {
    const additionalUsers = [];
    for (let i = 11; i <= 100; i++) {
      additionalUsers.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@email.com`,
        mobile: `+91-${9000000000 + i}`,
        joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
        avatar: null
      });
    }
    return [...mockUsers, ...additionalUsers];
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace this with actual API call
      // const response = await fetch(`${API_BASE_URL}api/users`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = generateMockUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error('Error fetching users. Please try again.', { 
        autoClose: 1500,
        hideProgressBar: true 
      });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search criteria
  useEffect(() => {
    let filtered = users;

    // Filter by name or email
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by mobile number
    if (mobileFilter.trim()) {
      filtered = filtered.filter(user =>
        user.mobile.includes(mobileFilter)
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(user =>
        user.joinDate === dateFilter
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, mobileFilter, dateFilter, users]);

  // Calculate pagination
  useEffect(() => {
    const total = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    setTotalPages(total);
  }, [filteredUsers]);

  // Get current page users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto font-sans px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Users</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Manage your users and their accounts</p>
        </div>
        
        <NavLink
          to="/users/add"
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add User
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by Name/Email */}
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Search by Mobile */}
          <div className="relative">
            <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by mobile number..."
              value={mobileFilter}
              onChange={(e) => setMobileFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              placeholder="Filter by join date..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setMobileFilter('');
              setDateFilter('');
            }}
            className="px-4 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">
              All Users ({filteredUsers.length})
            </h2>
            <div className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : getCurrentPageUsers().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">
                {searchTerm || mobileFilter || dateFilter ? 'No users found matching your search' : 'No users available'}
              </div>
              {!searchTerm && !mobileFilter && !dateFilter && (
                <NavLink
                  to="/users/add"
                  className="text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  Add your first user
                </NavLink>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {getCurrentPageUsers().map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.mobile}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <NavLink
                            to={`/users/${user.id}`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </NavLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {getCurrentPageUsers().map((user) => (
                  <div key={user.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-slate-900">{user.name}</h3>
                          <p className="text-xs text-slate-500">ID: {user.id}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Email:</span>
                        <div className="font-medium text-slate-900 break-all">{user.email}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Mobile:</span>
                        <div className="font-medium text-slate-900">{user.mobile}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Join Date:</span>
                        <div className="font-medium text-slate-900">{new Date(user.joinDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200">
                      <NavLink
                        to={`/users/${user.id}`}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-900 transition-colors font-medium text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-700">
                Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="hidden sm:flex items-center space-x-1">
                  {renderPaginationButtons()}
                </div>
                
                <div className="sm:hidden">
                  <span className="px-3 py-2 text-sm font-medium text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;