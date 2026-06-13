import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { FiRefreshCw, FiUserCheck, FiUserX, FiToggleLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/users');
      let data = res.data.data || [];

      data = data.filter(user => 
        user.role?.toUpperCase() === 'STUDENT' || user.role?.toLowerCase() === 'student'
      );

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(user =>
          user.fullName?.toLowerCase().includes(q) || 
          user.email?.toLowerCase().includes(q)
        );
      }

      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 403 
        ? "Access Denied. Super Admin privileges required." 
        : "Failed to load students");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [searchQuery]);

  // Improved Toggle Function
  const toggleSubscription = async (userId, currentType) => {
    const newStatus = currentType === 'PAID' ? 'FREE' : 'PAID';
    if (!window.confirm(`Change subscription to ${newStatus} for this user?`)) return;

    setActionLoading(userId);
    try {
      await api.patch(`/subscriptions/${userId}/toggle`);
      
      toast.success(`Subscription successfully changed to ${newStatus}!`);
      await fetchSubscriptions(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subscription");
    } finally {
      setActionLoading(null);
    }
  };

  // Manual Activate (only for FREE users)
  const activateSubscription = async (userId) => {
    if (!window.confirm("Activate Paid Plan for this student?")) return;

    setActionLoading(userId);
    try {
      await api.patch(`/subscriptions/${userId}/activate?paymentId=manual-admin-activation`);
      toast.success("Paid Subscription Activated Successfully!");
      await fetchSubscriptions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to activate subscription");
    } finally {
      setActionLoading(null);
    }
  };

  const getSubscriptionBadge = (type) => {
    return type === 'PAID' 
      ? "bg-green-100 text-green-700 font-semibold border border-green-200" 
      : "bg-gray-100 text-gray-600 font-medium";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage student subscription plans</p>
        </div>
        <button onClick={fetchSubscriptions} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-all">
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Paid Subscribers</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {users.filter(u => u.subscriptionType === 'PAID').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Free Users</p>
          <p className="text-4xl font-bold text-gray-600 mt-2">
            {users.filter(u => !u.subscriptionType || u.subscriptionType === 'FREE').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b text-left text-sm text-gray-600">
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr><td colSpan="5" className="py-12 text-center">Loading...</td></tr>
            ) : users.length > 0 ? (
              users.map((user) => {
                const isPaid = user.subscriptionType === 'PAID';
                const isProcessing = actionLoading === user.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${getSubscriptionBadge(user.subscriptionType)}`}>
                        {isPaid ? 'PAID' : 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => toggleSubscription(user.id, user.subscriptionType)}
                          disabled={isProcessing}
                          className="px-5 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-60"
                        >
                          {isProcessing ? (
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                          ) : isPaid ? (
                            <><FiUserX className="w-4 h-4" /> Deactivate Paid</>
                          ) : (
                            <><FiUserCheck className="w-4 h-4" /> Activate Paid</>
                          )}
                        </button>

                        {!isPaid && (
                          <button
                            onClick={() => activateSubscription(user.id)}
                            disabled={isProcessing}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition disabled:opacity-60"
                          >
                            Force Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-500">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionPage;