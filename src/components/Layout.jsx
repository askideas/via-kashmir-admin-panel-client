import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { menuData } from '../MenuData';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`w-65 bg-white border-r border-slate-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 fixed top-0 left-0 h-screen z-50 overflow-y-auto md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 relative">
          <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
            <Shield size={18} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 m-0 tracking-tight">Via Kashmir</h2>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Admin Panel</span>
          </div>
          <button 
            className="absolute right-5 bg-transparent border-0 text-slate-500 cursor-pointer p-1.5 rounded-md transition-all duration-200 hover:bg-slate-50 hover:text-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        
        <nav className="py-4">
          {menuData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`flex items-center py-3 px-5 text-slate-500 no-underline transition-all duration-200 text-sm font-medium relative mx-2 mb-0.5 rounded-lg hover:bg-slate-50 hover:text-indigo-500 ${
                location.pathname === item.link 
                  ? 'bg-indigo-50 text-indigo-500 font-semibold' 
                  : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 flex-shrink-0">
                {React.cloneElement(item.icon, { size: 20, strokeWidth: 1.5 })}
              </span>
              <span className="text-sm">{item.label}</span>
              {location.pathname === item.link && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-r-sm"></div>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white px-6 h-16 border-b border-slate-200 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button 
              className="bg-transparent border-0 text-slate-500 cursor-pointer p-2 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-50 hover:text-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <div className="breadcrumb">
              <span className="text-base font-semibold text-slate-800">
                {menuData.find(item => item.link === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">Admin</span>
                <span className="text-xs text-slate-500">{currentUser?.email}</span>
              </div>
            </div>
            <button 
              className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 py-2 px-3 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut size={16} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;
