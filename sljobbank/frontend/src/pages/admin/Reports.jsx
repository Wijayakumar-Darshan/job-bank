import React, { useState } from 'react';
import api from '../../api/axiosClient';
import { FiDownload, FiUsers, FiBriefcase, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [downloading, setDownloading] = useState(null);

  const downloadReport = async (reportType, format = 'pdf') => {
    const key = `${reportType}-${format}`;
    setDownloading(key);

    try {
      let url = `/reports/${reportType}`;
      let filename = `${reportType}_report.pdf`;

      if (reportType === 'users' && format === 'excel') {
        url += '?format=excel';
        filename = `${reportType}_report.xlsx`;
      }

      const res = await api.get(url, {
        responseType: 'blob',   // Important for file download
      });

      // Create download link
      const blob = new Blob([res.data], { 
        type: res.headers['content-type'] || 'application/pdf' 
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${reportType.toUpperCase()} report downloaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${reportType} report`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports Center</h1>
          <p className="text-gray-600 mt-1">Generate and download platform reports</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* User Report */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiUsers className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">User Report</h3>
              <p className="text-gray-600 text-sm">All users with roles and subscription status</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadReport('users', 'pdf')}
              disabled={downloading === 'users-pdf'}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <FiDownload />
              Download PDF
            </button>
            <button
              onClick={() => downloadReport('users', 'excel')}
              disabled={downloading === 'users-excel'}
              className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <FiDownload />
              Excel
            </button>
          </div>
        </div>

        {/* Job Report */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FiBriefcase className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Job Report</h3>
              <p className="text-gray-600 text-sm">All jobs with cluster and demand details</p>
            </div>
          </div>

          <button
            onClick={() => downloadReport('jobs')}
            disabled={downloading === 'jobs-pdf'}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FiDownload />
            Download Job Report (PDF)
          </button>
        </div>

        {/* Revenue Report */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Revenue Report</h3>
              <p className="text-gray-600 text-sm">Payment summary and transaction details</p>
            </div>
          </div>

          <button
            onClick={() => downloadReport('revenue')}
            disabled={downloading === 'revenue-pdf'}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FiDownload />
            Download Revenue Report (PDF)
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-700">
        <strong>Note:</strong> Reports are generated on the server and include the latest data. 
        PDF reports are recommended for printing, while Excel is best for further analysis.
      </div>
    </div>
  );
};

export default ReportsPage;