import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Bookings', value: '1,234', icon: <BarChart3 />, change: '+12.5%' },
    { title: 'Active Users', value: '8,965', icon: <Users />, change: '+8.2%' },
    { title: 'Revenue', value: '₹45,678', icon: <DollarSign />, change: '+15.3%' },
    { title: 'Growth', value: '23.4%', icon: <TrendingUp />, change: '+2.1%' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Via Kashmir Admin Panel</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: #6b7280;
          font-size: 16px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          background: #315149;
          color: white;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-content p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .stat-change {
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
