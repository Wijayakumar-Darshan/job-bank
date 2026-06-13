import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { 
  FiSearch, FiEdit2, FiTrash2, FiUserPlus, FiRefreshCw, FiFilter, FiDownload,
  FiMail, FiCalendar, FiX, FiCheck, FiAlertCircle, FiUser, FiShield 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      let filteredUsers = res.data.data || [];

      if (query) {
        const q = query.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.fullName?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q)
        );
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          statusFilter === 'active' ? user.active : !user.active
        );
      }

      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery, roleFilter, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(searchQuery);
    setTimeout(() => setRefreshing(false), 500);
    toast.success('Users refreshed successfully');
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      toast.success(currentStatus ? "User deactivated" : "User activated");
      fetchUsers(searchQuery);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(searchQuery);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: FiShield },
      counselor: { color: 'from-blue-500 to-blue-600', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: FiUser },
      student: { color: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: FiUser },
    };
    return configs[role?.toLowerCase()] || configs.student;
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const getAvatarColor = (index) => {
    const colors = ['from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-purple-400 to-purple-600', 'from-amber-400 to-amber-600', 'from-pink-400 to-pink-600', 'from-indigo-400 to-indigo-600', 'from-rose-400 to-rose-600', 'from-cyan-400 to-cyan-600'];
    return colors[index % colors.length];
  };

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Joined'],
      ...users.map(u => [u.fullName, u.email, u.role, u.active ? 'Active' : 'Inactive', new Date(u.createdAt).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported successfully');
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'from-blue-500 to-blue-600', icon: FiUser },
    { label: 'Active Users', value: users.filter(u => u.active).length, color: 'from-green-500 to-green-600', icon: FiCheck },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'from-purple-500 to-purple-600', icon: FiShield },
    { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'from-amber-500 to-amber-600', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiUser className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-800 tracking-tight">User Management</h1>
              <p className="text-gray-600 font-medium mt-1">Manage all users on your platform ({users.length} total)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={exportUsers} className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow-md">
              <FiDownload className="w-4 h-4" /> Export
            </button>
            <button onClick={handleRefresh} disabled={refreshing} className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow-md disabled:opacity-50">
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => toast.info("Add User feature coming soon...")} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
              <FiUserPlus className="w-5 h-5" /> Add New User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-700 transition-all" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all border-2 ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
              <FiFilter className="w-5 h-5" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-700">
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="counselor">Counselor</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-700">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-600 font-semibold">Loading users...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => {
                    const roleConfig = getRoleConfig(user.role);
                    const RoleIcon = roleConfig.icon;
                    return (
                      <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(index)} rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300`}>
                              {getInitials(user.fullName)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{user.fullName}</div>
                              <div className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                                <FiMail className="w-3.5 h-3.5" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${roleConfig.bg} ${roleConfig.text} rounded-lg font-bold text-sm border-2 ${roleConfig.border}`}>
                            <RoleIcon className="w-4 h-4" /> <span className="capitalize">{user.role?.replace('_', ' ') || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleToggleActive(user.id, user.active)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${user.active ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'}`}>
                            <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`} />
                            {user.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleToggleActive(user.id, user.active)} className="p-2.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all group/btn" title="Toggle Status">
                              <FiEdit2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button onClick={() => handleDeleteClick(user)} className="p-2.5 hover:bg-red-100 rounded-lg text-red-600 transition-all group/btn" title="Delete User">
                              <FiTrash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-modal-in">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                <FiTrash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 text-center mb-3">Delete User?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-800">{selectedUser.fullName}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }} className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes modal-in { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default UsersPage;