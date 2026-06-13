import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { FiSave, FiRefreshCw, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    paidModeEnabled: false,
    monthlyPrice: 0,
    yearlyPrice: 0,
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      const data = res.data.data;

      setSettings(data);
      setFormData({
        paidModeEnabled: data.paidModeEnabled || false,
        monthlyPrice: data.monthlyPrice || 0,
        yearlyPrice: data.yearlyPrice || 0,
        bankName: data.bankName || '',
        accountNumber: data.accountNumber || '',
        accountHolder: data.accountHolder || ''
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put('/settings', formData);
      setSettings(res.data.data);
      toast.success("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const togglePaidMode = async () => {
    try {
      const res = await api.patch('/settings/toggle-paid-mode');
      setSettings(res.data.data);
      setFormData(prev => ({ ...prev, paidModeEnabled: res.data.data.paidModeEnabled }));
      toast.success(`Paid Mode ${res.data.data.paidModeEnabled ? 'Enabled' : 'Disabled'}`);
    } catch (err) {
      toast.error("Failed to toggle paid mode");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-600 mt-1">Manage platform configuration and pricing</p>
        </div>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Paid Mode Toggle */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Paid Mode</h2>
            <p className="text-gray-600">Enable or disable subscription payments</p>
          </div>
          <button
            onClick={togglePaidMode}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition ${
              formData.paidModeEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {formData.paidModeEnabled ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} />}
            <span className="font-medium">
              {formData.paidModeEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-5">Subscription Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Price (LKR)</label>
            <input
              type="number"
              name="monthlyPrice"
              value={formData.monthlyPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Yearly Price (LKR)</label>
            <input
              type="number"
              name="yearlyPrice"
              value={formData.yearlyPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-5">Bank Account Details</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Holder Name</label>
            <input
              type="text"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 text-lg font-medium transition disabled:opacity-70"
        >
          <FiSave />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;