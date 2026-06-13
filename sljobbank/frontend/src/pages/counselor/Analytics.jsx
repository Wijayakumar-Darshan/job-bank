import { useEffect, useState } from 'react';
import { counselorApi } from '@/api';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const res = await counselorApi.getDashboard();
      const data = res.data?.data || {};

      setStats({
        totalJobs: data.totalJobs || 0,
        totalClusters: data.totalClusters || 0,
        totalUsers: data.totalUsers || 0,        // from analytics if available
      });

      setRecentJobs(data.recentJobs || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics data");
      setStats({});
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-semibold text-[#0F2C24] tracking-tight">Analytics &amp; Insights</h1>
            <p className="text-gray-600 mt-2 text-lg">Track performance and student career outcomes</p>
          </div>
          <div className="bg-white px-8 py-5 rounded-2xl shadow-sm border border-gray-100 text-lg font-medium text-gray-700 flex items-center gap-3">
            📅 {today}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl text-gray-600">Loading analytics...</div>
        ) : (
          <>
            {/* Key Stats - Only Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4">💼</div>
                <p className="text-5xl font-bold text-[#0F2C24] tracking-tighter">{stats.totalJobs}</p>
                <p className="text-xl text-gray-600 mt-2 font-medium">Total Jobs</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4">🗂️</div>
                <p className="text-5xl font-bold text-[#0F2C24] tracking-tighter">{stats.totalClusters}</p>
                <p className="text-xl text-gray-600 mt-2 font-medium">Career Clusters</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-5xl font-bold text-[#0F2C24] tracking-tighter">{stats.totalUsers || '—'}</p>
                <p className="text-xl text-gray-600 mt-2 font-medium">Active Students</p>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex gap-4 mb-8">
              {['weekly', 'monthly', 'quarterly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-8 py-3.5 rounded-2xl font-medium capitalize text-lg transition-all ${
                    timeframe === tf 
                      ? 'bg-[#1A9A7E] text-white shadow-md' 
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Placement Trends */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-[#0F2C24] mb-6">Placement Trends ({timeframe})</h2>
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-6xl mb-4">📊</p>
                    <p className="text-gray-500 text-lg">Chart will be shown here</p>
                    <p className="text-sm text-gray-400 mt-2">(Recharts / Chart.js)</p>
                  </div>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-[#0F2C24] mb-6">Recent Job Postings</h2>
                
                <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
                  {recentJobs.length > 0 ? (
                    recentJobs.slice(0, 6).map((job) => (
                      <div key={job.id} className="flex justify-between items-center py-3 border-b last:border-none group">
                        <div>
                          <p className="font-medium text-[#0F2C24]">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.clusterName || 'General Sector'}</p>
                        </div>
                        <div className="text-emerald-600 text-sm font-medium opacity-75 group-hover:opacity-100">
                          New
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No recent jobs available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top Institutes Placeholder */}
            <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-[#0F2C24] mb-8">Top Performing Institutes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center text-gray-400 py-12">
                <p>Top institutes data will appear here once integrated</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}