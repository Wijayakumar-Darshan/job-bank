import { useEffect, useState } from 'react';
import { instituteApi } from '@/api';
import toast from 'react-hot-toast';

export default function ManageInstitutes() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    location: '',
    type: '',
    contact: '',
    website: ''
  });

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const res = await instituteApi.getAll({ page: 0, size: 50 });
      setInstitutes(res.data?.data?.content || []);
    } catch {
      toast.error("Failed to load institutes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        toast.error("Institute name is required");
        return;
      }

      if (editId) {
        await instituteApi.update(editId, form);
        toast.success("Institute updated successfully");
      } else {
        await instituteApi.create(form);
        toast.success("Institute created successfully");
      }

      setShowModal(false);
      setEditId(null);
      fetchInstitutes();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (inst) => {
    setEditId(inst.id);
    setForm({
      name: inst.name || '',
      location: inst.location || '',
      type: inst.type || '',
      contact: inst.contact || '',
      website: inst.website || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this institute?")) return;
    try {
      await instituteApi.delete(id);
      toast.success("Institute deleted successfully");
      fetchInstitutes();
    } catch {
      toast.error("Failed to delete institute");
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      location: '',
      type: '',
      contact: '',
      website: ''
    });
  };

  return (
    <div className="p-8 bg-[#F8F9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-[#0F2C24] tracking-tight">Manage Institutes</h1>
            <p className="text-gray-600 mt-2 text-lg">Universities, colleges &amp; educational institutions for your students</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditId(null);
              setShowModal(true);
            }}
            className="bg-[#1A9A7E] hover:bg-[#17876D] text-white px-6 py-3.5 rounded-2xl font-medium flex items-center gap-3 text-lg shadow-sm transition-all active:scale-95"
          >
            + New Institute
          </button>
        </div>

        {/* Institutes List */}
        {loading ? (
          <div className="text-center py-20 text-xl text-gray-600">Loading institutes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutes.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-6xl mb-4">🏛️</p>
                <p className="text-xl text-gray-500">No institutes found. Add your first one!</p>
              </div>
            ) : (
              institutes.map(inst => (
                <div
                  key={inst.id}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-[#0F2C24] mb-2">{inst.name}</h3>
                    {inst.type && (
                      <span className="inline-block px-4 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-full">
                        {inst.type}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-gray-600 mb-8">
                    {inst.location && (
                      <p className="flex items-center gap-2">
                        📍 <span>{inst.location}</span>
                      </p>
                    )}
                    {inst.contact && (
                      <p className="flex items-center gap-2">
                        📞 <span>{inst.contact}</span>
                      </p>
                    )}
                    {inst.website && (
                      <p className="flex items-center gap-2">
                        🌐 <a href={inst.website} target="_blank" className="hover:underline text-[#1A9A7E]">{inst.website}</a>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleEdit(inst)}
                      className="flex-1 py-3 text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-2xl transition font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id)}
                      className="flex-1 py-3 text-sm border border-gray-300 hover:border-red-500 hover:text-red-600 rounded-2xl transition font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-8 border-b">
                <h2 className="text-3xl font-semibold text-[#0F2C24]">
                  {editId ? "Edit Institute" : "Add New Institute"}
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Institute Name *</label>
                  <input
                    placeholder="e.g. University of Colombo"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl text-lg"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                  <input
                    placeholder="City, Country"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
                  <input
                    placeholder="University, College, Technical Institute..."
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
                  <input
                    placeholder="+94 XX XXX XXXX"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl"
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Website</label>
                  <input
                    placeholder="https://www.example.edu.lk"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl"
                    value={form.website}
                    onChange={e => setForm({ ...form, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-8 border-t bg-gray-50 flex gap-4 justify-end rounded-b-3xl">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3.5 border border-gray-300 hover:bg-gray-100 rounded-2xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#1A9A7E] hover:bg-[#17876D] text-white px-8 py-3.5 rounded-2xl font-medium transition active:scale-95"
                >
                  {editId ? "Update Institute" : "Create Institute"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}