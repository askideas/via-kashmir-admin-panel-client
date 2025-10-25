import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
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
        <div className="sidebar-header">
          <h2>Via Kashmir</h2>
          <button 
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
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
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="header-right">
            <span className="user-email">{currentUser?.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
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
        }

        .sidebar {
          width: 280px;
          background: #315149;
          color: white;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
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
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .close-sidebar {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: block;
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
          padding: 16px 24px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.2s;
          border-left: 4px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: white;
        }

        .nav-icon {
          margin-right: 16px;
          flex-shrink: 0;
        }

        .nav-label {
          font-weight: 500;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        @media (min-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }

        .header {
          background: white;
          padding: 16px 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #315149;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
        }

        @media (min-width: 768px) {
          .menu-toggle {
            display: none;
          }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-email {
          color: #64748b;
          font-size: 14px;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #315149;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .logout-button:hover {
          background: #2a453e;
        }

        .page-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
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
