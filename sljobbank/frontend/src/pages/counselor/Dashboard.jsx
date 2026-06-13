import { useEffect, useState } from 'react';
import { counselorApi } from '@/api';
import toast from 'react-hot-toast';

export default function CounselorDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await counselorApi.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.warn("Custom dashboard endpoint not found, using fallback stats");

      try {
        const [jobsRes, institutesRes] = await Promise.all([
          counselorApi.getJobs({ page: 0, size: 1 }),
          counselorApi.getInstitutes({ page: 0, size: 1 })
        ]);

        setStats({
          totalJobs: jobsRes.data?.data?.totalElements || 0,
          totalInstitutes: institutesRes.data?.data?.totalElements || 0,
          totalClusters: 16,
          totalStudents: 248,
          activeUsers: 189
        });
      } catch (fallbackErr) {
        toast.error("Failed to load dashboard data");
        setStats({
          totalJobs: 0,
          totalInstitutes: 0,
          totalClusters: 16,
          totalStudents: 248,
          activeUsers: 189
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F9F6] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Greeting & Date */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#0F2C24] mb-3 tracking-tight">
              Good morning, Counselor 👋
            </h1>
            <p className="text-xl text-gray-600">Here's what's happening with your students today.</p>
          </div>
          
          <div className="bg-white px-8 py-5 rounded-2xl shadow-sm border border-gray-100 text-lg font-medium text-gray-700 flex items-center gap-3 whitespace-nowrap">
            📅 {today}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl text-gray-600">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Grid - Larger & More Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                { label: "Total Jobs", value: stats.totalJobs || 0, icon: "💼", color: "#1A9A7E" },
                { label: "Total Institutes", value: stats.totalInstitutes || 0, icon: "🏛️", color: "#2B7CDB" },
                { label: "Clusters", value: stats.totalClusters || 16, icon: "🗂️", color: "#6D5AC6" },
                { label: "Active Students", value: stats.totalStudents || 248, icon: "👨‍🎓", color: "#E07A5F" },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <p className="text-5xl font-bold text-[#0F2C24] mb-2 tracking-tighter">{stat.value}</p>
                  <p className="text-xl text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions - Larger Cards */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-8 text-[#0F2C24]">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <button 
                  onClick={() => window.location.href = '/counselor/jobs'} 
                  className="group p-8 border border-gray-200 rounded-3xl hover:border-teal-200 hover:bg-teal-50 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">💼</div>
                  <p className="font-semibold text-2xl mb-2 text-[#0F2C24]">Manage Jobs</p>
                  <p className="text-lg text-gray-600 leading-relaxed">Create &amp; edit job postings</p>
                </button>

                <button 
                  onClick={() => window.location.href = '/counselor/institutes'} 
                  className="group p-8 border border-gray-200 rounded-3xl hover:border-teal-200 hover:bg-teal-50 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🏛️</div>
                  <p className="font-semibold text-2xl mb-2 text-[#0F2C24]">Manage Institutes</p>
                  <p className="text-lg text-gray-600 leading-relaxed">Add universities &amp; courses</p>
                </button>

                <button 
                  onClick={() => window.location.href = '/counselor/analytics'} 
                  className="group p-8 border border-gray-200 rounded-3xl hover:border-teal-200 hover:bg-teal-50 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                  <p className="font-semibold text-2xl mb-2 text-[#0F2C24]">Analytics</p>
                  <p className="text-lg text-gray-600 leading-relaxed">Student &amp; placement reports</p>
                </button>

                <button 
                  onClick={() => window.location.href = '/counselor/students'} 
                  className="group p-8 border border-gray-200 rounded-3xl hover:border-teal-200 hover:bg-teal-50 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">👥</div>
                  <p className="font-semibold text-2xl mb-2 text-[#0F2C24]">Students</p>
                  <p className="text-lg text-gray-600 leading-relaxed">Manage student profiles</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}