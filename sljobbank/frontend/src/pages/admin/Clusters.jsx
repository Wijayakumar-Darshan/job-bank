import React, { useEffect, useState } from 'react'
import { clusterApi } from '../../api'
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiX, FiLayers, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Clusters = () => {
  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', description: '', emoji: '' })
  const [editId, setEditId] = useState(null)

  const loadClusters = async () => {
    try {
      setLoading(true)
      const res = await clusterApi.getAll()
      setClusters(res.data.data || [])
    } catch (err) {
      toast.error('Failed to load clusters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClusters() }, [])

  const handleSubmit = async () => {
    if (!form.name) return toast.error('Name is required')
    try {
      editId ? await clusterApi.update(editId, form) : await clusterApi.create(form)
      toast.success(editId ? 'Cluster updated' : 'Cluster created')
      resetForm()
      loadClusters()
    } catch { toast.error('Operation failed') }
  }

  const handleEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', emoji: c.emoji || '' })
    setEditId(c.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cluster?')) return
    try {
      await clusterApi.delete(id)
      toast.success('Deleted successfully')
      loadClusters()
    } catch { toast.error('Delete failed') }
  }

  const resetForm = () => { setForm({ name: '', description: '', emoji: '' }); setEditId(null) }

  const filtered = clusters.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  const colors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-red-600', 'from-cyan-500 to-blue-600']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FiLayers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800">Career Clusters</h1>
            <p className="text-gray-500 text-sm font-medium">{clusters.length} categories available</p>
          </div>
        </div>
        <button onClick={loadClusters} className="px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-sm">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            {editId ? <><FiEdit2 className="text-blue-600" /> Edit Cluster</> : <><FiPlus className="text-blue-600" /> Add New Cluster</>}
          </h2>
          {editId && <button onClick={resetForm} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium"><FiX /> Cancel</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" placeholder="🎨 Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none font-medium text-center" maxLength={2} />
          <input type="text" placeholder="Cluster name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="md:col-span-3 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none font-medium" />
        </div>
        <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border-2 border-gray-200 p-3 rounded-xl mt-3 focus:border-blue-500 outline-none font-medium resize-none" rows={2} />
        <button onClick={handleSubmit} className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
          <FiPlus /> {editId ? 'Update Cluster' : 'Create Cluster'}
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search clusters..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none font-medium bg-white" />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-semibold">Loading clusters...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((c, i) => (
            <div key={c.id} className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${colors[i % colors.length]}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${colors[i % colors.length]} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                    {c.emoji || '📁'}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(c)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <h2 className="font-black text-lg text-gray-800 mb-1 line-clamp-1">{c.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{c.description || 'No description provided'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <FiLayers className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No clusters found</p>
            <p className="text-gray-400 text-sm">Create your first cluster above</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clusters