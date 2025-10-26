import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const EMPLOYEES_PER_PAGE = 24;
  const API_BASE_URL = (import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app/').replace(/\/$/, '') + '/';

  // Mock employees data
  const mockEmployees = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@viakashmir.com',
      phone: '+91-9876543210',
      role: 'Tour Manager',
      department: 'Operations',
      location: 'Srinagar',
      status: 'Active',
      joinDate: '2024-01-15',
      salary: 45000,
      avatar: null,
      address: 'Dal Lake Road, Srinagar',
      experience: '5 years'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@viakashmir.com',
      phone: '+91-8765432109',
      role: 'Marketing Executive',
      department: 'Marketing',
      location: 'Jammu',
      status: 'Active',
      joinDate: '2024-02-20',
      salary: 35000,
      avatar: null,
      address: 'Gandhi Nagar, Jammu',
      experience: '3 years'
    },
    {
      id: 3,
      name: 'Mohammad Ali',
      email: 'mohammad.ali@viakashmir.com',
      phone: '+91-7654321098',
      role: 'Customer Support',
      department: 'Customer Service',
      location: 'Srinagar',
      status: 'On Leave',
      joinDate: '2023-11-10',
      salary: 28000,
      avatar: null,
      address: 'Lal Chowk, Srinagar',
      experience: '2 years'
    },
    {
      id: 4,
      name: 'Anjali Devi',
      email: 'anjali.devi@viakashmir.com',
      phone: '+91-6543210987',
      role: 'HR Manager',
      department: 'Human Resources',
      location: 'Srinagar',
      status: 'Active',
      joinDate: '2023-08-05',
      salary: 55000,
      avatar: null,
      address: 'Residency Road, Srinagar',
      experience: '7 years'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@viakashmir.com',
      phone: '+91-5432109876',
      role: 'Accounts Manager',
      department: 'Finance',
      location: 'Jammu',
      status: 'Active',
      joinDate: '2024-03-12',
      salary: 48000,
      avatar: null,
      address: 'Tawi Bridge, Jammu',
      experience: '4 years'
    },
    {
      id: 6,
      name: 'Sunita Kumari',
      email: 'sunita.kumari@viakashmir.com',
      phone: '+91-4321098765',
      role: 'Travel Coordinator',
      department: 'Operations',
      location: 'Gulmarg',
      status: 'Inactive',
      joinDate: '2023-12-18',
      salary: 32000,
      avatar: null,
      address: 'Gulmarg Resort Area',
      experience: '1 year'
    }
  ];

  // Generate more mock employees for pagination demo
  const generateMockEmployees = () => {
    const departments = ['Operations', 'Marketing', 'Customer Service', 'Human Resources', 'Finance', 'IT', 'Sales'];
    const roles = ['Manager', 'Executive', 'Coordinator', 'Specialist', 'Assistant', 'Lead', 'Associate'];
    const locations = ['Srinagar', 'Jammu', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Leh', 'Kargil'];
    const statuses = ['Active', 'Inactive', 'On Leave'];
    
    const additionalEmployees = [];
    for (let i = 7; i <= 100; i++) {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      additionalEmployees.push({
        id: i,
        name: `Employee ${i}`,
        email: `employee${i}@viakashmir.com`,
        phone: `+91-${9000000000 + i}`,
        role: `${role}`,
        department: department,
        location: location,
        status: status,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        salary: Math.floor(Math.random() * 50000) + 25000,
        avatar: null,
        address: `Address ${i}, ${location}`,
        experience: `${Math.floor(Math.random() * 10) + 1} years`
      });
    }
    return [...mockEmployees, ...additionalEmployees];
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}api/employees`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = generateMockEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      toast.error('Error fetching employees. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search criteria
  useEffect(() => {
    let filtered = employees;

    // Filter by search term (name, email, phone)
    if (searchTerm.trim()) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm)
      );
    }

    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(employee => employee.department === departmentFilter);
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter(employee => 
        employee.role.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(employee => employee.location === locationFilter);
    }

    // Filter by join date
    if (dateFilter) {
      filtered = filtered.filter(employee => employee.joinDate === dateFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, departmentFilter, statusFilter, roleFilter, locationFilter, dateFilter, employees]);

  // Calculate pagination
  useEffect(() => {
    const total = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
    setTotalPages(total);
  }, [filteredEmployees]);

  // Get current page employees
  const getCurrentPageEmployees = () => {
    const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
    const endIndex = startIndex + EMPLOYEES_PER_PAGE;
    return filteredEmployees.slice(startIndex, endIndex);
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
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique filter options
  const getUniqueOptions = (field) => {
    return [...new Set(employees.map(emp => emp[field]))].sort();
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
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
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

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="max-w-7xl mx-auto font-sans px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Employees</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Manage your team members and their information</p>
        </div>
        
        <NavLink
          to="/employees/add"
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add Employee
        </NavLink>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Filter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Quick Stats */}
          <div className="text-sm text-slate-500">
            Total Employees: {filteredEmployees.length}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Departments</option>
                {getUniqueOptions('department').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Status</option>
                {getUniqueOptions('status').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <input
                type="text"
                placeholder="Filter by role..."
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Locations</option>
                {getUniqueOptions('location').map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Join Date</label>
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
                  setDepartmentFilter('');
                  setStatusFilter('');
                  setRoleFilter('');
                  setLocationFilter('');
                  setDateFilter('');
                }}
                className="w-full px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 cursor-pointer text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employees Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">
              All Employees ({filteredEmployees.length})
            </h2>
            <div className="text-sm text-slate-500">
              Page {currentPage} of {totalPages} • Showing {EMPLOYEES_PER_PAGE} per page
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : getCurrentPageEmployees().length === 0 ? (
          <div className="text-center py-20">
            <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <div className="text-slate-400 mb-2">
              {searchTerm || departmentFilter || statusFilter || roleFilter || locationFilter || dateFilter
                ? 'No employees found matching your search'
                : 'No employees available'}
            </div>
            {!searchTerm && !departmentFilter && !statusFilter && !roleFilter && !locationFilter && !dateFilter && (
              <NavLink
                to="/employees/add"
                className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer"
              >
                Add your first employee
              </NavLink>
            )}
          </div>
        ) : (
          <>
            {/* Employee Cards Grid */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getCurrentPageEmployees().map((employee) => (
                  <div key={employee.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                    {/* Employee Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{employee.name}</h3>
                        <p className="text-slate-500 text-xs truncate">{employee.role}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>

                    {/* Employee Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={12} className="flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={12} className="flex-shrink-0" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Briefcase size={12} className="flex-shrink-0" />
                        <span className="truncate">{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin size={12} className="flex-shrink-0" />
                        <span>{employee.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={12} className="flex-shrink-0" />
                        <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500">
                        ID: {employee.id}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                          title="Edit Employee"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-700">
                    Showing {((currentPage - 1) * EMPLOYEES_PER_PAGE) + 1} to {Math.min(currentPage * EMPLOYEES_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length} employees
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Employees;