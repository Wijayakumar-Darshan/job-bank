import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { 
  FiSearch, FiEdit2, FiTrash2, FiPlus, FiRefreshCw, FiBriefcase, FiTrendingUp, 
  FiDollarSign, FiHome, FiAward, FiFilter, FiGrid, FiList, FiX, FiCheckCircle, 
  FiChevronLeft, FiChevronRight, FiTarget, FiBookOpen, FiActivity, FiImage, FiTrendingDown 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const [refreshing, setRefreshing] = useState(false);
  const [demandFilter, setDemandFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
  title: '',
  description: '',
  responsibilities: '',
  skills: '',
  qualifications: '',
  alStream: '',
  alSubjects: '',
  sector: '',
  industryDemand: '',
  employmentGrowth: '',
  salaryMin: '',
  salaryMax: '',
  careerPathway: '',
  remoteAvailable: false,
  internshipAvailable: false,
  clusterId: '',
  image: ''
});

  const fetchClusters = async () => {
    try {
      const res = await api.get('/clusters');
      setClusters(Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.content || []));
    } catch (err) {
      toast.error('Failed to load career clusters');
    }
  };

  const fetchJobs = async (page = 0, query = '') => {
    try {
      setLoading(true);
      const res = await api.get('/jobs', { params: { q: query || undefined, page, size: 12 } });
      const data = res.data.data;
      let jobsList = data.content || [];
      if (demandFilter !== 'all') {
        jobsList = jobsList.filter(job => job.industryDemand?.toLowerCase() === demandFilter);
      }
      setJobs(jobsList);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClusters(); }, []);
  useEffect(() => { fetchJobs(0, searchQuery); }, [searchQuery, demandFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(currentPage, searchQuery);
    setTimeout(() => setRefreshing(false), 500);
    toast.success('Jobs refreshed');
  };

  const openModal = (job = null) => {
    setActiveTab('basic');
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title || '', description: job.description || '', responsibilities: job.responsibilities || '',
        skills: job.skills || '', alStream: job.alStream || '', alSubjects: job.alSubjects || '',
        sector: job.sector || '', industryDemand: job.industryDemand || '', employmentGrowth: job.employmentGrowth || '',
        salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '', careerPathway: job.careerPathway || '',
        remoteAvailable: job.remoteAvailable || false, internshipAvailable: job.internshipAvailable || false,
        clusterId: job.clusterId || '', image: job.image || ''
      });
    } else {
      setEditingJob(null);
      setFormData({ title: '', description: '', responsibilities: '', skills: '', alStream: '', alSubjects: '',
        sector: '', industryDemand: '', employmentGrowth: '', salaryMin: '', salaryMax: '', careerPathway: '',
        remoteAvailable: false, internshipAvailable: false, clusterId: '', image: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jobPayload = {
        title: formData.title, description: formData.description,
        responsibilities: formData.responsibilities || null, skills: formData.skills || null,
        alStream: formData.alStream || null, alSubjects: formData.alSubjects || null,
        sector: formData.sector, industryDemand: formData.industryDemand,
        employmentGrowth: formData.employmentGrowth || null,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        careerPathway: formData.careerPathway || null,
        remoteAvailable: formData.remoteAvailable, internshipAvailable: formData.internshipAvailable,
        image: formData.image || null,
      };
      const requestPayload = { job: jobPayload, qualificationIds: [], clusterId: formData.clusterId || null };

      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, requestPayload);
        toast.success('Job updated successfully!');
      } else {
        await api.post('/jobs', requestPayload);
        toast.success('Job created successfully!');
      }
      setShowModal(false);
      setEditingJob(null);
      fetchJobs(currentPage, searchQuery);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (job) => { setJobToDelete(job); setShowDeleteModal(true); };
  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await api.delete(`/jobs/${jobToDelete.id}`);
      toast.success('Job deleted successfully');
      setShowDeleteModal(false); setJobToDelete(null);
      fetchJobs(currentPage, searchQuery);
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const getDemandConfig = (demand) => {
    const configs = {
      high: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: FiTrendingUp },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: FiActivity },
      low: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: FiTrendingDown },
    };
    return configs[demand?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: FiActivity };
  };

  const stats = [
    { label: 'Total Jobs', value: totalElements, color: 'from-blue-500 to-blue-600', icon: FiBriefcase },
    { label: 'High Demand', value: jobs.filter(j => j.industryDemand?.toLowerCase() === 'high').length, color: 'from-green-500 to-emerald-600', icon: FiTrendingUp },
    { label: 'Clusters', value: clusters.length, color: 'from-purple-500 to-purple-600', icon: FiTarget },
    { label: 'With Remote', value: jobs.filter(j => j.remoteAvailable).length, color: 'from-amber-500 to-orange-600', icon: FiHome },
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiBriefcase },
    { id: 'education', label: 'Education', icon: FiBookOpen },
    { id: 'market', label: 'Market & Salary', icon: FiDollarSign },
    { id: 'career', label: 'Career Path', icon: FiTrendingUp },
    { id: 'options', label: 'Work Options', icon: FiHome },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiBriefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-800 tracking-tight">Job Management</h1>
              <p className="text-gray-600 font-medium mt-1">Manage all career opportunities ({totalElements} total)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleRefresh} disabled={refreshing}
              className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow-md disabled:opacity-50">
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => openModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
              <FiPlus className="w-5 h-5" /> Add New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by job title..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-700 transition-all" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all border-2 ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
              <FiFilter className="w-5 h-5" /> Filters
            </button>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Table View">
                <FiList className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Grid View">
                <FiGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Industry Demand</label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'high', 'medium', 'low'].map(level => (
                  <button key={level} onClick={() => setDemandFilter(level)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all ${demandFilter === level ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {level === 'all' ? 'All Levels' : level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jobs Display */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-600 font-semibold">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cluster</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sector</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Demand</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Salary Range</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map(job => {
                    const dc = getDemandConfig(job.industryDemand);
                    const DemandIcon = dc.icon;
                    return (
                      <tr key={job.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              {job.image ? <img src={job.image} alt={job.title} className="w-full h-full object-cover rounded-xl" /> : <FiBriefcase className="w-6 h-6 text-blue-600" />}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{job.title}</div>
                              <div className="flex gap-1 mt-1">
                                {job.remoteAvailable && <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-semibold">Remote</span>}
                                {job.internshipAvailable && <span className="text-xs px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded font-semibold">Internship</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <span className="text-lg">{job.clusterEmoji || '📁'}</span> {job.clusterName || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-600 font-medium">{job.sector || 'N/A'}</span></td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${dc.bg} ${dc.text} rounded-lg font-bold text-xs border ${dc.border}`}>
                            <DemandIcon className="w-3.5 h-3.5" /> {job.industryDemand || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                            <FiDollarSign className="w-4 h-4 text-green-600" />
                            {job.salaryMin && job.salaryMax ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` : 'Negotiable'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openModal(job)} className="p-2.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all group/btn" title="Edit Job">
                              <FiEdit2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button onClick={() => handleDeleteClick(job)} className="p-2.5 hover:bg-red-100 rounded-lg text-red-600 transition-all group/btn" title="Delete Job">
                              <FiTrash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map(job => {
                const dc = getDemandConfig(job.industryDemand);
                const DemandIcon = dc.icon;
                return (
                  <div key={job.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                      {job.image ? (
                        <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FiBriefcase className="w-20 h-20 text-blue-300" /></div>
                      )}
                      <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 ${dc.bg} ${dc.text} rounded-lg font-bold text-xs shadow-md`}>
                        <DemandIcon className="w-3.5 h-3.5" /> {job.industryDemand || 'N/A'}
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-black text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mt-1">
                          <span className="text-lg">{job.clusterEmoji || '📁'}</span> {job.clusterName || 'N/A'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description || 'No description available'}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2.5">
                          <p className="text-xs text-gray-500 font-semibold">Sector</p>
                          <p className="text-sm font-bold text-gray-700 truncate">{job.sector || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2.5">
                          <p className="text-xs text-gray-500 font-semibold">Salary</p>
                          <p className="text-sm font-bold text-gray-700 truncate">{job.salaryMin ? `${(job.salaryMin/1000).toFixed(0)}K+` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {job.remoteAvailable && <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">🏠 Remote</span>}
                        {job.internshipAvailable && <span className="text-xs px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded-full font-bold">💼 Internship</span>}
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => openModal(job)} className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all">
                          <FiEdit2 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleDeleteClick(job)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-sm transition-all">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ): (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">Page <span className="font-bold text-gray-800">{currentPage + 1}</span> of <span className="font-bold text-gray-800">{totalPages}</span></p>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchJobs(Math.max(0, currentPage - 1), searchQuery)} disabled={currentPage === 0}
                className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => fetchJobs(i, searchQuery)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${i === currentPage ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => fetchJobs(Math.min(totalPages - 1, currentPage + 1), searchQuery)} disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-modal-in">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiBriefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
                  <p className="text-sm text-gray-600 font-medium">{editingJob ? 'Update job details' : 'Fill in the details below'}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="px-8 pt-4 bg-white border-b border-gray-100">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map(tab => (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-6">
                {activeTab === 'basic' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Software Engineer" className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2"><FiImage className="inline w-4 h-4 mr-1" /> Image URL</label>
                      <input type="url" placeholder="https://example.com/image.jpg" value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                      {formData.image && (
                        <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <img src={formData.image} alt="Preview" onError={e => e.target.style.display = 'none'}
                            className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm" />
                          <span className="text-sm text-gray-600 font-medium">✓ Image preview</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                      <textarea required rows={4} placeholder="Describe the role..." value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities</label>
                      <textarea rows={3} placeholder="List responsibilities..." value={formData.responsibilities}
                        onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills</label>
                      <input type="text" placeholder="e.g. React, Node.js, SQL" value={formData.skills}
                        onChange={e => setFormData({...formData, skills: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                      <p className="text-xs text-gray-500 mt-2 font-medium">💡 Comma-separated list</p>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">A/L Stream</label>
                        <input type="text" placeholder="e.g. Technology" value={formData.alStream}
                          onChange={e => setFormData({...formData, alStream: e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Recommended Subjects</label>
                        <input type="text" placeholder="e.g. ICT, Physics" value={formData.alSubjects}
                          onChange={e => setFormData({...formData, alSubjects: e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'market' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sector</label>
                        <input type="text" placeholder="e.g. Private" value={formData.sector}
                          onChange={e => setFormData({...formData, sector: e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Industry Demand</label>
                        <select value={formData.industryDemand} onChange={e => setFormData({...formData, industryDemand: e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all">
                          <option value="">Select demand level</option>
                          <option value="High">🟢 High</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="Low">🔴 Low</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Employment Growth</label>
                      <select value={formData.employmentGrowth} onChange={e => setFormData({...formData, employmentGrowth: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all">
                        <option value="">Select growth level</option>
                        <option value="High">📈 High</option>
                        <option value="Medium">➡️ Medium</option>
                        <option value="Low">📉 Low</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Salary Min (LKR)</label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input type="number" placeholder="50000" value={formData.salaryMin}
                            onChange={e => setFormData({...formData, salaryMin: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-10 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Salary Max (LKR)</label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input type="number" placeholder="150000" value={formData.salaryMax}
                            onChange={e => setFormData({...formData, salaryMax: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-10 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'career' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Career Progression Path</label>
                      <input type="text" placeholder="e.g. Junior → Senior" value={formData.careerPathway}
                        onChange={e => setFormData({...formData, careerPathway: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Career Cluster</label>
                      <select value={formData.clusterId} onChange={e => setFormData({...formData, clusterId: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-medium transition-all">
                        <option value="">Select Cluster (Optional)</option>
                        {clusters.map(c => (
                          <option key={c.id} value={c.id}>{c.emoji ? `${c.emoji} ` : ''}{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'options' && (
                  <div className="space-y-4 animate-fade-in">
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.remoteAvailable ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input type="checkbox" checked={formData.remoteAvailable} onChange={e => setFormData({...formData, remoteAvailable: e.target.checked})} className="w-5 h-5 rounded accent-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><FiHome className="w-5 h-5 text-blue-600" /><span className="font-bold text-gray-800">Remote Work Available</span></div>
                        <p className="text-sm text-gray-600 mt-1">Employees can work from anywhere</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.internshipAvailable ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input type="checkbox" checked={formData.internshipAvailable} onChange={e => setFormData({...formData, internshipAvailable: e.target.checked})} className="w-5 h-5 rounded accent-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><FiAward className="w-5 h-5 text-blue-600" /><span className="font-bold text-gray-800">Internship Opportunities</span></div>
                        <p className="text-sm text-gray-600 mt-1">Internships are available for students</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <FiCheckCircle className="w-4 h-4 text-green-600" /> All changes are saved automatically
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} disabled={submitting}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-white text-gray-700 font-bold transition-all">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-70 transition-all flex items-center gap-2">
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-modal-in">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                <FiTrash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 text-center mb-3">Delete Job?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{jobToDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteModal(false); setJobToDelete(null); }}
                  className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button onClick={confirmDelete}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes modal-in { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default JobsPage;