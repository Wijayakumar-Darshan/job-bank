import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
  });

  const handleSave = async () => {
    try {
      // You can call API here if needed
      updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A2E1C] mb-8">My Profile</h1>

        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-28 h-28 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-6xl font-bold">
              {user?.fullName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex gap-3 mt-3">
                <span className="px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
                <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {user?.subscriptionType} Plan
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl bg-gray-50"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#0A2E1C] text-white rounded-2xl font-semibold hover:bg-black transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}