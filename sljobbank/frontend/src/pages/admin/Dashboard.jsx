import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { 
  FiUsers, FiBriefcase, FiTarget, FiTrendingUp, FiUserPlus, FiRefreshCw,
  FiArrowUp, FiArrowDown, FiActivity, FiClock, FiDollarSign, FiEye, 
  FiMoreVertical, FiCalendar 
} from 'react-icons/fi';

const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setDashboardStats(res.data.data);
    } catch (err) {
      setError("Failed to load dashboard statistics");
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const res = await api.get('/users');
      const sorted = res.data.data
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8);
      setRecentUsers(sorted);
    } catch (err) {
      setError("Failed to load recent users");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDashboardStats(), fetchRecentUsers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchRecentUsers()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h3>
          <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiActivity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: dashboardStats?.totalUsers || 0, change: '+12.5%', trend: 'up', icon: FiUsers, gradient: 'from-blue-500 to-blue-600', bgGradient: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Total Jobs', value: dashboardStats?.totalJobs || 0, change: '+8.2%', trend: 'up', icon: FiBriefcase, gradient: 'from-emerald-500 to-emerald-600', bgGradient: 'from-emerald-50 to-emerald-100', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { title: 'Career Clusters', value: dashboardStats?.totalClusters || 0, change: '+5.1%', trend: 'up', icon: FiTarget, gradient: 'from-purple-500 to-purple-600', bgGradient: 'from-purple-50 to-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { title: 'Total Revenue', value: `LKR ${(dashboardStats?.totalRevenue || 0).toLocaleString()}`, change: '+23.7%', trend: 'up', icon: FiDollarSign, gradient: 'from-amber-500 to-amber-600', bgGradient: 'from-amber-50 to-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  ];

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      counselor: 'bg-blue-100 text-blue-700 border-blue-200',
      student: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const getAvatarColor = (index) => {
    const colors = ['from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-purple-400 to-purple-600', 'from-amber-400 to-amber-600', 'from-pink-400 to-pink-600', 'from-indigo-400 to-indigo-600'];
    return `bg-gradient-to-br ${colors[index % colors.length]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-800 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-600 font-medium mt-1">Welcome back! Here's your overview for today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50">
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.trend === 'up' ? <FiArrowUp className="w-3.5 h-3.5" /> : <FiArrowDown className="w-3.5 h-3.5" />}
                    <span className="text-xs font-bold">{stat.change}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700">{stat.title}</p>
                  <p className="text-3xl font-black text-gray-800 tracking-tight">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`} style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini Stats + Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mini Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Active Today</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-600 font-medium">Students Online</span><span className="text-xl font-bold text-gray-800">247</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-600 font-medium">Active Sessions</span><span className="text-xl font-bold text-gray-800">89</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-600 font-medium">New Signups</span><span className="text-xl font-bold text-green-600">+12</span></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiActivity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Add New Job', icon: FiBriefcase, link: '/admin/jobs/new' },
                { label: 'Manage Users', icon: FiUsers, link: '/admin/users' },
                { label: 'View Reports', icon: FiEye, link: '/admin/reports' },
              ].map((action, i) => (
                <button key={i} onClick={() => window.location.href = action.link}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all border border-transparent hover:border-blue-200 group">
                  <action.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{action.label}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100">→</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {[
                { action: 'New user registered', time: '2 min ago', type: 'user' },
                { action: 'Job posted', time: '15 min ago', type: 'job' },
                { action: 'Payment received', time: '1 hour ago', type: 'payment' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${act.type === 'user' ? 'bg-blue-500' : act.type === 'job' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 truncate">{act.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiUserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
                <p className="text-sm text-gray-500">Latest registered members</p>
              </div>
            </div>
            <button onClick={() => window.location.href = '/admin/users'}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
              View All Users →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.length > 0 ? recentUsers.map((user, i) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${getAvatarColor(i)} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm group-hover:text-blue-700">{user.fullName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${getRoleColor(user.role)}`}>
                        {user.role?.replace('_', ' ').toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-sm font-semibold ${user.active ? 'text-green-700' : 'text-red-700'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiMoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FiUsers className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-semibold">No users found</p>
                        <p className="text-gray-500 text-sm">Users will appear here once registered</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  );
};

export default DashboardPage;