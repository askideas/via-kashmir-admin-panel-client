import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import {generateAPIToken} from '../utils/apitoken'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const API_BASE_URL = import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app';

  // Fetch categories from API
  const fetchCategories = async () => {
    const tokenData = await generateAPIToken();

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`, {
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
      const categoriesArray = Array.isArray(data) ? data : (data.categories || data.data || []);
      
      // Sort by latest (createdAt or updatedAt) - newest first
      const sortedCategories = categoriesArray.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA; // Descending order (latest first)
      });
      
      setCategories(sortedCategories);
      setFilteredCategories(sortedCategories);
    } catch (error) {
      const errorMessage = error.message.includes('HTTP error') 
        ? 'Error communicating with server. Please check your connection and try again.'
        : error.message || 'Error fetching categories. Please try again.';
      toast.error(errorMessage, { 
        autoClose: 1500,
        hideProgressBar: true 
      });
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category && category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, categories]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      
      if (editingCategory) {
        // Update existing category
        const categoryId = editingCategory.id || editingCategory._id;
        const tokenData = await generateAPIToken();
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.data.access_token}`
          },
          body: JSON.stringify({
            name: formData.name.trim(),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const updatedCategory = await response.json();
        toast.success('Category updated successfully!', { 
          autoClose: 1500,
          hideProgressBar: true 
        });
      } else {
        // Add new category
        const tokenData = await generateAPIToken();
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.data.access_token}`
          },
          body: JSON.stringify({
            name: formData.name.trim(),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const newCategory = await response.json();
        toast.success('Category added successfully!', { 
          autoClose: 1500,
          hideProgressBar: true 
        });
      }
      
      // Reset form and refresh data
      setFormData({ name: '' });
      setShowAddForm(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      const errorMessage = error.message.includes('HTTP error') 
        ? 'Error communicating with server. Please check your connection and try again.'
        : error.message || 'Error saving category. Please try again.';
      toast.error(errorMessage, { 
        autoClose: 1500,
        hideProgressBar: true 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const tokenData = await generateAPIToken();
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
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
        
        toast.success('Category deleted successfully!', { 
          autoClose: 1500,
          hideProgressBar: true 
        });
        await fetchCategories();
      } catch (error) {
        const errorMessage = error.message.includes('HTTP error') 
          ? 'Error communicating with server. Please check your connection and try again.'
          : error.message || 'Error deleting category. Please try again.';
        toast.error(errorMessage, { 
          autoClose: 1500,
          hideProgressBar: true 
        });
      }
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ name: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="max-w-6xl font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-base m-0 font-normal">
            Manage your business categories ({filteredCategories.length} total)
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 cursor-pointer"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-text"
          />
        </div>
        {searchTerm && (
          <div className="mt-3 text-sm text-slate-600">
            Showing {filteredCategories.length} result{filteredCategories.length !== 1 ? 's' : ''} for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-text"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save size={16} />
                {submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Save')}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">
              All Categories
            </h2>
            {totalPages > 1 && (
              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages} • Showing {currentCategories.length} of {filteredCategories.length}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">
                {searchTerm ? 'No categories found matching your search' : 'No categories available'}
              </div>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer"
                >
                  Add your first category
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {currentCategories.map((category) => (
                  <div
                    key={category.id || category._id || Math.random()}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 mb-1">{category.name || 'Unnamed Category'}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>ID: {category.id || category._id || 'N/A'}</span>
                        <span>
                          Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                        {category.updatedAt && category.updatedAt !== category.createdAt && (
                          <span>
                            Updated: {new Date(category.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(category.id || category._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-indigo-500 text-white'
                              : 'border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;