import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  Calendar, 
  MapPin, 
  Heart, 
  FileText, 
  Briefcase, 
  CreditCard, 
  Save, 
  X,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import { menuData } from '../MenuData';
import { generateAPIToken } from '../utils/apitoken';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    // Profile Picture
    profilePicture: null,
    profilePicturePreview: null,

    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    accessRights: [],
    
    // Government Proof
    governmentProof: null,
    governmentProofType: '',
    governmentProofNumber: '',

    // Professional Details
    yearsOfExperience: '',
    lastCompanyName: '',
    lastJobTitle: '',
    lastSalary: '',
    reasonForLeaving: '',

    // Bank Details
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',

    // Additional Details
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    
    // Address
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',

    // Employment Details
    joiningDate: '',
    department: '',
    designation: '',
    employmentType: '',
    reportingManager: '',
    probationPeriod: '',
    salary: '', // New salary field
    
    // Additional
    bloodGroup: '',
    medicalConditions: '',
    hobbies: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload for profile picture
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB', {
          autoClose: 1500,
          hideProgressBar: true
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle government proof upload
  const handleGovernmentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        governmentProof: file
      }));
    }
  };

  // Handle removing profile picture
  const handleRemoveProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null,
      profilePicturePreview: null
    }));
  };

  // Handle removing government proof
  const handleRemoveGovernmentProof = () => {
    setFormData(prev => ({
      ...prev,
      governmentProof: null
    }));
  };

  // Handle access rights selection
  const handleAccessRightChange = (menuId) => {
    setFormData(prev => ({
      ...prev,
      accessRights: prev.accessRights.includes(menuId)
        ? prev.accessRights.filter(id => id !== menuId)
        : [...prev.accessRights, menuId]
    }));
  };

  // Handle same address checkbox
  const handleSameAddressChange = (e) => {
    setSameAsCurrentAddress(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: prev.currentAddress
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permanentAddress: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Valid email address is required', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      toast.error('Valid mobile number is required', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toast.error('Password should be at least 6 characters', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (formData.accessRights.length === 0) {
      toast.error('Please select at least one access right', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    if (!formData.accountNumber.trim() || formData.accountNumber !== formData.confirmAccountNumber) {
      toast.error('Bank account numbers do not match', {
        autoClose: 1500,
        hideProgressBar: true
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Get authentication token
      const tokenData = await generateAPIToken();
      
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'accessRights') {
          // Convert access rights array to JSON string
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePicturePreview') {
          // Skip preview data, only send actual file
          return;
        } else if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Make API call to store employee data
      const API_BASE_URL = import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app';
      
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.data.access_token}`
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the correct boundary
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success('Employee added successfully!', {
        autoClose: 1500,
        hideProgressBar: true
      });
      
      // Reset form after successful submission
      setFormData({
        profilePicture: null,
        profilePicturePreview: null,
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        accessRights: [],
        governmentProof: null,
        governmentProofType: '',
        governmentProofNumber: '',
        yearsOfExperience: '',
        lastCompanyName: '',
        lastJobTitle: '',
        lastSalary: '',
        reasonForLeaving: '',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        fatherName: '',
        motherName: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        emergencyContactRelation: '',
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        joiningDate: '',
        department: '',
        designation: '',
        employmentType: '',
        reportingManager: '',
        probationPeriod: '',
        salary: '', // Reset salary field
        bloodGroup: '',
        medicalConditions: '',
        hobbies: ''
      });
      setSameAsCurrentAddress(false);
      
      // Navigate back to employees list after a delay
      setTimeout(() => {
        window.location.href = '/manageemployees';
      }, 2000);

    } catch (error) {
      let errorMessage = 'Error adding employee. Please try again.';
      
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Authentication failed')) {
        errorMessage = 'Authentication failed. Please refresh the page and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans py-6">
      {/* Header */}
      <div className="mb-6">
        <NavLink 
          to="/manageemployees" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </NavLink>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Add New Employee</h1>
          <p className="text-slate-600">Fill in the employee details to create a new account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Upload */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Camera size={20} className="text-slate-600" />
            Profile Picture
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                {formData.profilePicturePreview ? (
                  <img 
                    src={formData.profilePicturePreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}
              </div>
              
              {/* Upload/Cancel buttons */}
              {!formData.profilePicturePreview ? (
                <label className="absolute bottom-0 right-0 p-2 bg-indigo-500 text-white rounded-full cursor-pointer hover:bg-indigo-600 transition-colors">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveProfilePicture}
                  className="absolute bottom-0 right-0 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                  title="Remove picture"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-sm text-slate-500">Upload a profile picture (Max 5MB)</p>
              {formData.profilePicturePreview && (
                <p className="text-xs text-green-600 mt-1">✓ Picture uploaded successfully</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User size={20} className="text-slate-600" />
            Personal Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Access Rights */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">Access Rights *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {menuData.map((menu) => (
                <label key={menu.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accessRights.includes(menu.id)}
                    onChange={() => handleAccessRightChange(menu.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">{menu.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Government Proof */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-slate-600" />
            Government Proof Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
              <select
                name="governmentProofType"
                value={formData.governmentProofType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 cursor-pointer"
              >
                <option value="">Select Document Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="drivingLicense">Driving License</option>
                <option value="voterID">Voter ID</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Number</label>
              <input
                type="text"
                name="governmentProofNumber"
                value={formData.governmentProofNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Document</label>
              
              {!formData.governmentProof ? (
                <div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleGovernmentProofUpload}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  />
                  <p className="text-xs text-slate-500 mt-1">Upload image or PDF file</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                  <FileText size={20} className="text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">{formData.governmentProof.name}</p>
                    <p className="text-xs text-green-600">Document uploaded successfully</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveGovernmentProof}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove document"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase size={20} className="text-slate-600" />
            Professional Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Company Name</label>
              <input
                type="text"
                name="lastCompanyName"
                value={formData.lastCompanyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Job Title</label>
              <input
                type="text"
                name="lastJobTitle"
                value={formData.lastJobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Salary (₹)</label>
              <input
                type="number"
                name="lastSalary"
                value={formData.lastSalary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Leaving</label>
              <textarea
                name="reasonForLeaving"
                value={formData.reasonForLeaving}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-slate-600" />
            Bank Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Holder Name *</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Account Number *</label>
              <input
                type="text"
                name="confirmAccountNumber"
                value={formData.confirmAccountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">IFSC Code *</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-slate-600" />
            Additional Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
              <div className="relative">
                <Heart size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
              />
            </div>
            
            {/* Emergency Contact */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
                  >
                    <option value="">Select Relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="spouse">Spouse</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Address Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Address *</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-3 text-slate-400" />
                    <textarea
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={sameAsCurrentAddress}
                    onChange={handleSameAddressChange}
                    className="form-checkbox h-4 w-4 text-slate-600 rounded focus:ring-slate-500 cursor-pointer"
                  />
                  <label htmlFor="sameAddress" className="ml-2 text-sm text-slate-700 cursor-pointer">
                    Permanent address is same as current address
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Permanent Address *</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-3 text-slate-400" />
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      disabled={sameAsCurrentAddress}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 resize-none disabled:bg-gray-100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Joining Date *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
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
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 cursor-pointer"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Salary (₹) *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                    placeholder="Enter current salary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reporting Manager</label>
                  <input
                    type="text"
                    name="reportingManager"
                    value={formData.reportingManager}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Probation Period (Months)</label>
                  <input
                    type="number"
                    name="probationPeriod"
                    value={formData.probationPeriod}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="md:col-span-2 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Medical Conditions (if any)</label>
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 resize-none"
                    placeholder="Please mention any medical conditions or allergies"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hobbies & Interests</label>
                  <textarea
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-400 resize-none"
                    placeholder="List your hobbies and interests"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Save size={20} />
            {submitting ? 'Adding Employee...' : 'Add Employee'}
          </button>
          
          <NavLink
            to="/manageemployees"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <X size={20} />
            Cancel
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;