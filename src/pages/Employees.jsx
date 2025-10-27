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
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { generateAPIToken } from '../utils/apitoken';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const EMPLOYEES_PER_PAGE = 24;
  const API_BASE_URL = import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app';

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const tokenData = await generateAPIToken();
      
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.data.access_token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both array response and object with data property
      const employeesArray = Array.isArray(data) ? data : (data.employees || data.data || []);
      
      // Sort by latest (createdAt or updatedAt) - newest first
      const sortedEmployees = employeesArray.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA; // Descending order (latest first)
      });
      
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
    } catch (error) {
      const errorMessage = error.message.includes('HTTP error') 
        ? 'Error communicating with server. Please check your connection and try again.'
        : error.message || 'Error fetching employees. Please try again.';
      toast.error(errorMessage, {
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

    // Filter by search term (firstName, lastName, email, phone, employeeId)
    if (searchTerm.trim()) {
      filtered = filtered.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.mobileNumber.includes(searchTerm) ||
        employee.employeeId.includes(searchTerm)
      );
    }

    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(employee => employee.department === departmentFilter);
    }

    // Filter by status (based on isActive)
    if (statusFilter) {
      if (statusFilter === 'Active') {
        filtered = filtered.filter(employee => employee.isActive === true);
      } else if (statusFilter === 'Inactive') {
        filtered = filtered.filter(employee => employee.isActive === false);
      }
    }

    // Filter by designation/role
    if (roleFilter) {
      filtered = filtered.filter(employee => 
        employee.designation && employee.designation.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }

    // Filter by city/location
    if (locationFilter) {
      filtered = filtered.filter(employee => employee.city === locationFilter);
    }

    // Filter by join date
    if (dateFilter) {
      filtered = filtered.filter(employee => employee.joiningDate === dateFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, departmentFilter, statusFilter, roleFilter, locationFilter, dateFilter, employees]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const endIndex = startIndex + EMPLOYEES_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

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

  // Get status based on isActive
  const getEmployeeStatus = (employee) => {
    return employee.isActive ? 'Active' : 'Inactive';
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique filter options
  const getUniqueOptions = (field) => {
    const values = employees.map(emp => {
      if (field === 'status') {
        return getEmployeeStatus(emp);
      }
      return emp[field];
    }).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Handle employee deletion
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const tokenData = await generateAPIToken();
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.data.access_token}`
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        toast.success('Employee deleted successfully!', { 
          autoClose: 1500,
          hideProgressBar: true 
        });
        await fetchEmployees(); // Refresh the list
      } catch (error) {
        const errorMessage = error.message.includes('HTTP error') 
          ? 'Error communicating with server. Please check your connection and try again.'
          : error.message || 'Error deleting employee. Please try again.';
        toast.error(errorMessage, { 
          autoClose: 1500,
          hideProgressBar: true 
        });
      }
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
    <div className="max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Employees</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">
            Manage your team members and their information ({filteredEmployees.length} total)
          </p>
        </div>
        
        <NavLink
          to="/addemployee"
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
            placeholder="Search employees by name, email, phone, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle and Stats */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Filter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {searchTerm && (
            <div className="text-sm text-slate-600">
              Showing {filteredEmployees.length} result{filteredEmployees.length !== 1 ? 's' : ''} for "{searchTerm}"
            </div>
          )}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
              <input
                type="text"
                placeholder="Filter by designation..."
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
              >
                <option value="">All Cities</option>
                {getUniqueOptions('city').map(city => (
                  <option key={city} value={city}>{city}</option>
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
              All Employees
            </h2>
            {totalPages > 1 && (
              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages} • Showing {currentEmployees.length} of {filteredEmployees.length}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : currentEmployees.length === 0 ? (
          <div className="text-center py-20">
            <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <div className="text-slate-400 mb-2">
              {searchTerm || departmentFilter || statusFilter || roleFilter || locationFilter || dateFilter
                ? 'No employees found matching your search'
                : 'No employees available'}
            </div>
            {!searchTerm && !departmentFilter && !statusFilter && !roleFilter && !locationFilter && !dateFilter && (
              <NavLink
                to="/addemployee"
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
                {currentEmployees.map((employee) => {
                  const status = getEmployeeStatus(employee);
                  return (
                    <div key={employee.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                      {/* Employee Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {employee.profilePicture ? (
                            <img 
                              src={employee.profilePicture} 
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-indigo-600 font-semibold text-sm">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm truncate">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-slate-500 text-xs truncate">{employee.designation}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                          {status}
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
                          <span>{employee.mobileNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Briefcase size={12} className="flex-shrink-0" />
                          <span className="truncate">{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin size={12} className="flex-shrink-0" />
                          <span>{employee.city}, {employee.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar size={12} className="flex-shrink-0" />
                          <span>
                            Joined {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          ID: {employee.employeeId}
                        </div>
                        <div className="flex items-center gap-1">
                          <NavLink
                            to={`/employees/${employee.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </NavLink>
                          
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
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