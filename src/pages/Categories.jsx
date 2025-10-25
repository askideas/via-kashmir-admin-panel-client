import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Plus, Search, Edit, Trash2, Save, X } from 'lucide-react';

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

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
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
        const categoryRef = doc(db, 'categories', editingCategory.id);
        await updateDoc(categoryRef, {
          name: formData.name.trim(),
          updatedAt: serverTimestamp()
        });
        console.log('Category updated successfully');
      } else {
        // Add new category
        const docRef = await addDoc(collection(db, 'categories'), {
          name: formData.name.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('Category added with ID: ', docRef.id);
      }
      
      // Reset form and refresh data
      setFormData({ name: '' });
      setShowAddForm(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
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
        await deleteDoc(doc(db, 'categories', categoryId));
        console.log('Category deleted successfully');
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ name: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="max-w-6xl font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-base m-0 font-normal">Manage your business categories</p>
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-text"
          />
        </div>
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
          <h2 className="text-lg font-semibold text-slate-800">
            All Categories ({filteredCategories.length})
          </h2>
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
            <div className="grid gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-1">{category.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>ID: {category.id}</span>
                      <span>
                        Created: {category.createdAt?.toDate ? category.createdAt?.toDate().toLocaleDateString() : 'Processing...'}
                      </span>
                      {category.updatedAt && category.updatedAt !== category.createdAt && (
                        <span>
                          Updated: {category.updatedAt?.toDate ? category.updatedAt?.toDate().toLocaleDateString() : 'Processing...'}
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
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;