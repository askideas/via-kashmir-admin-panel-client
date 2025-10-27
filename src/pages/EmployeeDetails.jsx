import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  FileText, 
  MapPin, 
  Briefcase, 
  Heart,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Building,
  Camera
} from 'lucide-react';
import { toast } from 'react-toastify';
import { generateAPIToken } from '../utils/apitoken';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app';

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'professional', label: 'Professional Details', icon: Briefcase },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'address', label: 'Address Details', icon: MapPin },
    { id: 'emergency', label: 'Emergency Contact', icon: Heart },
  ];

  // Fetch employee details
  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      
      const tokenData = await generateAPIToken();
      
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
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
      
      // Handle both direct employee object and nested response
      const employeeData = data.employee || data.data || data;
      
      if (!employeeData) {
        throw new Error('Employee data not found in response');
      }
      
      setEmployee(employeeData);
    } catch (error) {
      toast.error('Error fetching employee details. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect with proper logging
  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    } else {
      setLoading(false);
    }
  }, [id, API_BASE_URL]); // Added API_BASE_URL to dependencies

  // Handle edit mode
  const handleEdit = (section) => {
    setEditingSection(section);
    setEditData({ ...employee });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditData({});
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async (section) => {
    try {
      setSubmitting(true);
      const tokenData = await generateAPIToken();
      
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.data.access_token}`
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      
      // Handle the updated response properly
      const updatedEmployee = updatedData.employee || updatedData.data || updatedData;
      setEmployee(updatedEmployee);
      setEditingSection(null);
      setEditData({});
      
      toast.success('Employee details updated successfully!', {
        autoClose: 1500,
        hideProgressBar: true
      });
    } catch (error) {
      toast.error('Error updating employee details. Please try again.', {
        autoClose: 1500,
        hideProgressBar: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Render Personal Details Tab
  const renderPersonalDetails = () => {
    const isEditing = editingSection === 'personal';
    const data = isEditing ? editData : employee;

    if (!data) return <div>Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit('personal')}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveChanges('personal')}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={data.firstName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.firstName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={data.lastName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.lastName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={data.email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.email || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="mobileNumber"
                value={data.mobileNumber || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.mobileNumber || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">
                {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={data.gender || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-slate-900 capitalize">{data.gender || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
            {isEditing ? (
              <select
                name="maritalStatus"
                value={data.maritalStatus || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            ) : (
              <p className="text-slate-900 capitalize">{data.maritalStatus || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
            {isEditing ? (
              <select
                name="bloodGroup"
                value={data.bloodGroup || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="text-slate-900">{data.bloodGroup || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fatherName"
                value={data.fatherName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.fatherName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name</label>
            {isEditing ? (
              <input
                type="text"
                name="motherName"
                value={data.motherName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{data.motherName || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Professional Details Tab
  const renderProfessionalDetails = () => {
    const isEditing = editingSection === 'professional';
    const data = isEditing ? editData : employee;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Professional Information</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit('professional')}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveChanges('professional')}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
            <p className="text-slate-900">{employee.employeeId || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            {isEditing ? (
              <select
                name="department"
                value={data.department || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Department</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Administration">Administration</option>
              </select>
            ) : (
              <p className="text-slate-900">{employee.department || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
            {isEditing ? (
              <input
                type="text"
                name="designation"
                value={data.designation || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.designation || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
            {isEditing ? (
              <select
                name="employmentType"
                value={data.employmentType || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            ) : (
              <p className="text-slate-900">{employee.employmentType || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Joining Date</label>
            {isEditing ? (
              <input
                type="date"
                name="joiningDate"
                value={data.joiningDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">
                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Salary</label>
            {isEditing ? (
              <input
                type="number"
                name="salary"
                value={data.salary || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">₹{employee.salary ? Number(employee.salary).toLocaleString() : 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reporting Manager</label>
            {isEditing ? (
              <input
                type="text"
                name="reportingManager"
                value={data.reportingManager || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.reportingManager || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
            {isEditing ? (
              <input
                type="number"
                name="yearsOfExperience"
                value={data.yearsOfExperience || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.yearsOfExperience || 'N/A'} years</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.isActive)}`}>
              {employee.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render Bank Details Tab
  const renderBankDetails = () => {
    const isEditing = editingSection === 'bank';
    const data = isEditing ? editData : employee;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Bank Information</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit('bank')}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveChanges('bank')}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
            {isEditing ? (
              <input
                type="text"
                name="bankName"
                value={data.bankName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.bankName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Holder Name</label>
            {isEditing ? (
              <input
                type="text"
                name="accountHolderName"
                value={data.accountHolderName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.accountHolderName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
            {isEditing ? (
              <input
                type="text"
                name="accountNumber"
                value={data.accountNumber || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.accountNumber ? `****${employee.accountNumber.slice(-4)}` : 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">IFSC Code</label>
            {isEditing ? (
              <input
                type="text"
                name="ifscCode"
                value={data.ifscCode || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.ifscCode || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Documents Tab
  const renderDocuments = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Documents</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
            {employee.profilePicture ? (
              <div className="flex items-center gap-4">
                <img 
                  src={employee.profilePicture} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <a 
                  href={employee.profilePicture} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  View Image
                </a>
              </div>
            ) : (
              <p className="text-slate-500">No profile picture uploaded</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Government Proof</label>
            {employee.governmentProof ? (
              <div className="space-y-2">
                <p className="text-slate-900">
                  <span className="font-medium">Type:</span> {employee.governmentProofType || 'N/A'}
                </p>
                <p className="text-slate-900">
                  <span className="font-medium">Number:</span> {employee.governmentProofNumber || 'N/A'}
                </p>
                <a 
                  href={employee.governmentProof} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline block cursor-pointer"
                >
                  View Document
                </a>
              </div>
            ) : (
              <p className="text-slate-500">No government proof uploaded</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Address Details Tab
  const renderAddressDetails = () => {
    const isEditing = editingSection === 'address';
    const data = isEditing ? editData : employee;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Address Information</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit('address')}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveChanges('address')}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Address</label>
            {isEditing ? (
              <textarea
                name="currentAddress"
                value={data.currentAddress || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.currentAddress || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Permanent Address</label>
            {isEditing ? (
              <textarea
                name="permanentAddress"
                value={data.permanentAddress || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.permanentAddress || 'N/A'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={data.city || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-900">{employee.city || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={data.state || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-900">{employee.state || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">PIN Code</label>
              {isEditing ? (
                <input
                  type="text"
                  name="pincode"
                  value={data.pincode || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-900">{employee.pincode || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={data.country || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-900">{employee.country || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Emergency Contact Tab
  const renderEmergencyContact = () => {
    const isEditing = editingSection === 'emergency';
    const data = isEditing ? editData : employee;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Emergency Contact</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit('emergency')}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveChanges('emergency')}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name</label>
            {isEditing ? (
              <input
                type="text"
                name="emergencyContactName"
                value={data.emergencyContactName || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.emergencyContactName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="emergencyContactNumber"
                value={data.emergencyContactNumber || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-900">{employee.emergencyContactNumber || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
            {isEditing ? (
              <select
                name="emergencyContactRelation"
                value={data.emergencyContactRelation || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Select Relationship</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-slate-900 capitalize">{employee.emergencyContactRelation || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalDetails();
      case 'professional':
        return renderProfessionalDetails();
      case 'bank':
        return renderBankDetails();
      case 'documents':
        return renderDocuments();
      case 'address':
        return renderAddressDetails();
      case 'emergency':
        return renderEmergencyContact();
      default:
        return renderPersonalDetails();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <div className="ml-4 text-slate-600">Loading employee details...</div>
      </div>
    );
  }

  if (!employee && !loading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Employee not found</p>
        <p className="text-sm text-slate-500 mt-2">ID: {id}</p>
        <NavLink 
          to="/employees" 
          className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto font-sans py-6">
      {/* Header */}
      <div className="mb-6">
        <NavLink 
          to="/employees" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </NavLink>
        
        {employee && (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {employee?.profilePicture ? (
                <img 
                  src={employee.profilePicture} 
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-semibold text-xl">
                  {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {employee?.firstName} {employee?.lastName}
              </h1>
              <p className="text-slate-600">{employee?.designation} • {employee?.department}</p>
              <p className="text-sm text-slate-500">Employee ID: {employee?.employeeId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs - only show if employee exists */}
      {employee && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;