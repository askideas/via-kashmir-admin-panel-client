import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Calendar, Bell } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Bookings', value: '1,234', icon: <BarChart3 />, change: '+12.5%', trend: 'up' },
    { title: 'Active Users', value: '8,965', icon: <Users />, change: '+8.2%', trend: 'up' },
    { title: 'Revenue', value: '₹45,678', icon: <DollarSign />, change: '+15.3%', trend: 'up' },
    { title: 'Growth Rate', value: '23.4%', icon: <TrendingUp />, change: '+2.1%', trend: 'up' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <Calendar size={14} />
            This Week
          </button>
          <button className="notification-btn">
            <Bell size={14} />
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {stats.map((stat, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">
                {React.cloneElement(stat.icon, { size: 18, strokeWidth: 2 })}
              </div>
              <div className="metric-trend">
                <Activity size={12} />
                <span className="metric-change">{stat.change}</span>
              </div>
            </div>
            <div className="metric-content">
              <h2>{stat.value}</h2>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card large-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="card-action">View All</button>
          </div>
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar success">
                  <BarChart3 size={14} />
                </div>
                <div className="activity-content">
                  <p><strong>New booking received</strong> from Kashmir Valley Tour</p>
                  <span>2 minutes ago</span>
                </div>
                <div className="activity-amount">+₹15,000</div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar info">
                  <DollarSign size={14} />
                </div>
                <div className="activity-content">
                  <p><strong>Payment processed</strong> for booking #1234</p>
                  <span>15 minutes ago</span>
                </div>
                <div className="activity-amount">₹8,500</div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar warning">
                  <Users size={14} />
                </div>
                <div className="activity-content">
                  <p><strong>New vendor registration</strong> approved</p>
                  <span>1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="actions-grid">
              <button className="action-card">
                <div className="action-icon">
                  <Users size={16} />
                </div>
                <span>Add Vendor</span>
              </button>
              <button className="action-card">
                <div className="action-icon">
                  <Bell size={16} />
                </div>
                <span>Send Alert</span>
              </button>
              <button className="action-card">
                <div className="action-icon">
                  <BarChart3 size={16} />
                </div>
                <span>View Reports</span>
              </button>
              <button className="action-card">
                <div className="action-icon">
                  <Activity size={16} />
                </div>
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
          letter-spacing: -0.4px;
        }

        .page-header p {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          font-weight: 400;
          line-height: 1.4;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .notification-btn {
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 9px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 8px;
          min-width: 16px;
          text-align: center;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .metric-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-icon {
          width: 40px;
          height: 40px;
          background: #6366f1;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
        }

        .metric-change {
          font-size: 12px;
          font-weight: 600;
          background: #dcfce7;
          padding: 3px 8px;
          border-radius: 12px;
          border: 1px solid #bbf7d0;
        }

        .metric-content h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
          letter-spacing: -0.8px;
        }

        .metric-content p {
          color: #64748b;
          font-size: 13px;
          margin: 0;
          font-weight: 500;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .card-header {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .card-action {
          background: none;
          border: none;
          color: #6366f1;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .card-action:hover {
          background: #eef2ff;
        }

        .card-content {
          padding: 20px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .activity-avatar.success {
          background: #10b981;
        }

        .activity-avatar.info {
          background: #3b82f6;
        }

        .activity-avatar.warning {
          background: #f59e0b;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          font-size: 13px;
          color: #1e293b;
          margin: 0 0 3px 0;
          font-weight: 400;
        }

        .activity-content span {
          font-size: 11px;
          color: #64748b;
          font-weight: 400;
        }

        .activity-amount {
          font-size: 13px;
          font-weight: 600;
          color: #10b981;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .action-card:hover {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }

        .action-icon {
          width: 36px;
          height: 36px;
          background: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          transition: all 0.2s ease;
        }

        .action-card:hover .action-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .action-card span {
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
