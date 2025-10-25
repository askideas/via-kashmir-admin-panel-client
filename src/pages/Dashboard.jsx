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
    <div className="max-w-6xl font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-base m-0 font-normal leading-relaxed">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white border border-slate-200 py-2 px-3 rounded-lg text-sm text-slate-600 cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:border-slate-300">
            <Calendar size={14} />
            This Week
          </button>
          <button className="relative bg-white border border-slate-200 p-2 rounded-lg text-slate-600 cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:border-slate-300">
            <Bell size={14} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1 py-0.5 rounded-lg min-w-4 text-center">3</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 transition-all duration-200 hover:border-slate-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                {React.cloneElement(stat.icon, { size: 18, strokeWidth: 2 })}
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Activity size={12} />
                <span className="text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-xl border border-green-200">{stat.change}</span>
              </div>
            </div>
            <div className="metric-content">
              <h2 className="text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">{stat.value}</h2>
              <p className="text-slate-500 text-sm m-0 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-lg">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800 m-0 tracking-tight">Recent Activity</h3>
            <button className="bg-transparent border-0 text-indigo-500 text-sm font-medium cursor-pointer py-1 px-2 rounded-md transition-all duration-200 hover:bg-indigo-50">View All</button>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-slate-50">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <BarChart3 size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 m-0 mb-0.5 font-normal"><strong>New booking received</strong> from Kashmir Valley Tour</p>
                  <span className="text-xs text-slate-500 font-normal">2 minutes ago</span>
                </div>
                <div className="text-sm font-semibold text-green-600">+₹15,000</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-slate-50">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <DollarSign size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 m-0 mb-0.5 font-normal"><strong>Payment processed</strong> for booking #1234</p>
                  <span className="text-xs text-slate-500 font-normal">15 minutes ago</span>
                </div>
                <div className="text-sm font-semibold text-green-600">₹8,500</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-slate-50">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Users size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 m-0 mb-0.5 font-normal"><strong>New vendor registration</strong> approved</p>
                  <span className="text-xs text-slate-500 font-normal">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-lg">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 m-0 tracking-tight">Quick Actions</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 py-4 px-3 rounded-lg cursor-pointer transition-all duration-200 text-center hover:bg-indigo-500 hover:text-white hover:border-indigo-500 group">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-indigo-500 transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                  <Users size={16} />
                </div>
                <span className="text-xs font-medium">Add Vendor</span>
              </button>
              <button className="flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 py-4 px-3 rounded-lg cursor-pointer transition-all duration-200 text-center hover:bg-indigo-500 hover:text-white hover:border-indigo-500 group">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-indigo-500 transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                  <Bell size={16} />
                </div>
                <span className="text-xs font-medium">Send Alert</span>
              </button>
              <button className="flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 py-4 px-3 rounded-lg cursor-pointer transition-all duration-200 text-center hover:bg-indigo-500 hover:text-white hover:border-indigo-500 group">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-indigo-500 transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                  <BarChart3 size={16} />
                </div>
                <span className="text-xs font-medium">View Reports</span>
              </button>
              <button className="flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 py-4 px-3 rounded-lg cursor-pointer transition-all duration-200 text-center hover:bg-indigo-500 hover:text-white hover:border-indigo-500 group">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-indigo-500 transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                  <Activity size={16} />
                </div>
                <span className="text-xs font-medium">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
