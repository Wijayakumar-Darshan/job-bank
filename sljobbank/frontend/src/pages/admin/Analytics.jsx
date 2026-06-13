import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';   // ← Use your api instance
import { 
  FiBarChart2, 
  FiUsers, 
  FiBriefcase, 
  FiTrendingUp, 
  FiTarget 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [topJobs, setTopJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard');   // ← Correct path
      setDashboard(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    }
  };

  const fetchTopJobs = async () => {
    try {
      const res = await api.get('/analytics/jobs/top');    // ← Correct path
      setTopJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load top jobs");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDashboard(), fetchTopJobs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-lg">Loading Analytics...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8 text-lg">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of SLJobBank Platform Performance</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboard?.totalUsers?.toLocaleString() || 0}
              </p>
            </div>
            <FiUsers className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboard?.totalJobs?.toLocaleString() || 0}
              </p>
            </div>
            <FiBriefcase className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Career Clusters</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboard?.totalClusters?.toLocaleString() || 0}
              </p>
            </div>
            <FiTarget className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                LKR {(dashboard?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <FiTrendingUp className="w-10 h-10 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Top Jobs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiBarChart2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Top 10 Jobs by Demand</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Job Title</th>
                <th className="pb-3 font-medium">Industry Demand</th>
                <th className="pb-3 font-medium text-center">View Count</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topJobs.length > 0 ? (
                topJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-800">{job.title}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {job.demand}
                      </span>
                    </td>
                    <td className="py-4 text-center font-semibold text-gray-700">
                      {job.viewCount?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    No job data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;