import { counselorApi } from '@/api';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const reports = [
    { title: "Monthly User Report", desc: "Active users, new registrations, retention", type: "users" },
    { title: "Job Performance Report", desc: "Most viewed careers and demand trends", type: "jobs" },
    { title: "Revenue Report", desc: "Subscription payments and income summary", type: "revenue" },
    { title: "Student Engagement Report", desc: "Favorites, searches, and activity", type: "engagement" },
  ];

  const generateReport = (type) => {
    toast.success(`Generating ${type} report...`);
    // counselorApi.generateReport(type);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reports & Exports</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-semibold text-xl mb-3">{report.title}</h3>
              <p className="text-gray-600 mb-8">{report.desc}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => generateReport(report.type)}
                  className="flex-1 py-4 bg-[#0A2E1C] text-white rounded-2xl font-medium hover:bg-black"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => generateReport(report.type)}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                >
                  Download Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}