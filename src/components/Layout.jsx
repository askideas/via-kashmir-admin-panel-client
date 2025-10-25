import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Sparkles, Shield } from 'lucide-react';
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
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-gradient"></div>
        <div className="sidebar-header">
          <div className="brand-logo">
            <Shield size={18} strokeWidth={2} />
          </div>
          <div className="brand-text">
            <h2>Via Kashmir</h2>
            <span>Admin Panel</span>
          </div>
          <button 
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`nav-item ${location.pathname === item.link ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{React.cloneElement(item.icon, { size: 20, strokeWidth: 1.5 })}</span>
              <span className="nav-label">{item.label}</span>
              <div className="nav-indicator"></div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <div className="breadcrumb">
              <span className="breadcrumb-current">
                {menuData.find(item => item.link === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">Admin</span>
                <span className="user-email">{currentUser?.email}</span>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <style jsx>{`
        .layout {
          display: flex;
          height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        }

        .sidebar {
          width: 260px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
          position: relative;
        }

        .sidebar-gradient {
          display: none;
        }

        .sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .sidebar {
            position: relative;
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          background: #6366f1;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .brand-text span {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .close-sidebar {
          position: absolute;
          right: 20px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-sidebar:hover {
          background: #f1f5f9;
          color: #6366f1;
        }

        @media (min-width: 768px) {
          .close-sidebar {
            display: none;
          }
        }

        .sidebar-nav {
          padding: 16px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          position: relative;
          margin: 0 8px 2px 8px;
          border-radius: 8px;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #6366f1;
        }

        .nav-item.active {
          background: #eef2ff;
          color: #6366f1;
          font-weight: 600;
        }

        .nav-item.active .nav-indicator {
          opacity: 1;
        }

        .nav-icon {
          margin-right: 12px;
          flex-shrink: 0;
        }

        .nav-label {
          font-size: 14px;
        }

        .nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          background: #6366f1;
          border-radius: 0 2px 2px 0;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .header {
          background: #ffffff;
          padding: 0 24px;
          height: 64px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
          color: #6366f1;
        }

        @media (min-width: 768px) {
          .menu-toggle {
            display: none;
          }
        }

        .breadcrumb-current {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #6366f1;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-email {
          font-size: 11px;
          color: #64748b;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background: #fecaca;
        }

        .page-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 999;
        }

        @media (min-width: 768px) {
          .overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
