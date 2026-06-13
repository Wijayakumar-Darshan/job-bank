import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { FiSearch, FiRefreshCw, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/payments');
      let data = res.data.data || [];

      // Client-side search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(p => 
          p.user?.fullName?.toLowerCase().includes(q) || 
          p.orderId?.toLowerCase().includes(q)
        );
      }

      if (statusFilter !== 'ALL') {
        data = data.filter(p => p.status === statusFilter);
      }

      setPayments(data);
    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 403) {
        setError("Access Denied! You need Super Admin privileges to view payments.");
      } else if (err.response?.status === 404) {
        setError("Payments endpoint not found. Please add PaymentController in backend.");
      } else {
        setError("Failed to load payments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-600 mt-1">All transactions on SLJobBank</p>
        </div>
        <button onClick={fetchPayments} className="px-5 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700">
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="ALL">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-center">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b text-sm text-gray-600">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="6" className="py-20 text-center">Loading...</td></tr>
            ) : payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono">{p.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{p.user?.fullName}</div>
                    <div className="text-xs text-gray-500">{p.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold">LKR {p.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <FiEye className="inline text-blue-600 cursor-pointer" />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="py-20 text-center text-gray-500">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;