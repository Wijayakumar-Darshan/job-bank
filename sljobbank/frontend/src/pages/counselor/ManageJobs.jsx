import { useEffect, useState } from 'react';
import { jobApi, clusterApi, qualificationApi } from '@/api';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    skills: '',
    alStream: '',
    alSubjects: '',
    salaryMin: '',
    salaryMax: '',
    industryDemand: '',
    employmentGrowth: '',
    careerPathway: '',
    sector: '',
    image: '',
    remoteAvailable: false,
    internshipAvailable: false,
    clusterId: '',
    qualifications: [],
  });

  useEffect(() => {
    fetchJobs();
    fetchClusters();
    fetchQualifications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAll({ page: 0, size: 50 });
      setJobs(res.data?.data?.content || []);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async () => {
    try {
      const res = await clusterApi.getAll();
      setClusters(res.data?.data || []);
    } catch {
      toast.error("Failed to load clusters");
    }
  };

  const fetchQualifications = async () => {
    try {
      const res = await qualificationApi.getAll();
      setQualifications(res.data?.data || []);
    } catch {
      toast.error("Failed to load qualifications");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.title.trim()) return toast.error("Title is required");
      if (!form.description.trim()) return toast.error("Description is required");
      if (!form.clusterId) return toast.error("Please select a cluster");

      const payload = {
        job: {
          title: form.title,
          description: form.description,
          responsibilities: form.responsibilities,
          skills: form.skills,
          alStream: form.alStream,
          alSubjects: form.alSubjects,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
          industryDemand: form.industryDemand,
          employmentGrowth: form.employmentGrowth,
          careerPathway: form.careerPathway,
          sector: form.sector,
          image: form.image,
          remoteAvailable: form.remoteAvailable,
          internshipAvailable: form.internshipAvailable,
        },
        qualificationIds: form.qualifications || [],
        clusterId: String(form.clusterId),
      };

      if (editId) {
        await jobApi.update(editId, payload);
        toast.success("Job updated successfully");
      } else {
        await jobApi.create(payload);
        toast.success("Job created successfully");
      }

      setShowModal(false);
      setEditId(null);
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', responsibilities: '', skills: '',
      alStream: '', alSubjects: '', salaryMin: '', salaryMax: '',
      industryDemand: '', employmentGrowth: '', careerPathway: '',
      sector: '', image: '', remoteAvailable: false,
      internshipAvailable: false, clusterId: '', qualifications: [],
    });
  };

  const handleEdit = (job) => {
    setEditId(job.id);
    setForm({
      title: job.title || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      skills: job.skills || '',
      alStream: job.alStream || '',
      alSubjects: job.alSubjects || '',
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      industryDemand: job.industryDemand || '',
      employmentGrowth: job.employmentGrowth || '',
      careerPathway: job.careerPathway || '',
      sector: job.sector || '',
      image: job.image || '',
      remoteAvailable: job.remoteAvailable || false,
      internshipAvailable: job.internshipAvailable || false,
      clusterId: job.clusterId || '',
      qualifications: job.qualifications?.map(q => q.id) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobApi.delete(id);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  // Toggle a qualification ID in/out of the selected list
  const toggleQualification = (id) => {
    setForm(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(id)
        ? prev.qualifications.filter(q => q !== id)
        : [...prev.qualifications, id],
    }));
  };

  return (
    <div className="p-8 bg-[#F8F9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-[#0F2C24] tracking-tight">Manage Jobs</h1>
            <p className="text-gray-600 mt-2 text-lg">Create and manage career opportunities for your students</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditId(null);
              setShowModal(true);
            }}
            className="bg-[#1A9A7E] hover:bg-[#17876D] text-white px-6 py-3.5 rounded-2xl font-medium flex items-center gap-3 text-lg shadow-sm transition-all active:scale-95"
          >
            + New Job
          </button>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="text-center py-20 text-xl text-gray-600">Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl">
                <p className="text-6xl mb-4">💼</p>
                <p className="text-xl text-gray-500">No jobs found. Create your first job posting!</p>
              </div>
            ) : (
              jobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    {/* Job image thumbnail */}
                    <div className="flex items-start gap-4">
                      {job.image ? (
                        <img
                          src={job.image}
                          alt={job.title}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0"
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#E8F5F1] flex items-center justify-center shrink-0">
                          <span className="text-2xl">💼</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-semibold text-[#0F2C24] mb-1">{job.title}</h3>
                        <p className="text-[#1A9A7E] font-medium">{job.clusterName}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-80 group-hover:opacity-100 shrink-0">
                      <button
                        onClick={() => handleEdit(job)}
                        className="px-5 py-2 text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-5 py-2 text-sm border border-gray-300 hover:border-red-500 hover:text-red-600 rounded-xl transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {job.salaryMin && (
                      <p><span className="text-gray-500">Salary:</span> ₹{job.salaryMin} - {job.salaryMax}</p>
                    )}
                    {job.sector && <p><span className="text-gray-500">Sector:</span> {job.sector}</p>}
                    {job.remoteAvailable && <p className="text-emerald-600">🌐 Remote Available</p>}
                    {job.internshipAvailable && <p className="text-amber-600">🎓 Internship Available</p>}
                  </div>

                  {/* Qualification badges */}
                  {job.qualifications?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.qualifications.map(q => (
                        <span
                          key={q.id}
                          className="px-3 py-1 bg-[#E8F5F1] text-[#1A9A7E] text-xs font-medium rounded-full"
                        >
                          {q.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b">
                <h2 className="text-3xl font-semibold text-[#0F2C24]">
                  {editId ? "Edit Job" : "Create New Job"}
                </h2>
              </div>

              <div className="p-8 overflow-y-auto max-h-[65vh] space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">Basic Information</h3>
                  <input
                    placeholder="Job Title *"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl text-lg outline-none"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description *"
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl mt-4 h-28 outline-none"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">Job Image</h3>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Image URL</label>
                      <input
                        placeholder="https://example.com/image.jpg"
                        className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                        value={form.image}
                        onChange={e => setForm({ ...form, image: e.target.value })}
                      />
                    </div>
                    {/* Live preview */}
                    <div className="shrink-0 mt-7">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                          onError={e => {
                            e.currentTarget.src = '';
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center leading-tight">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">A/L Stream</label>
                    <input
                      placeholder="Physical Science, Commerce, etc."
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                      value={form.alStream}
                      onChange={e => setForm({ ...form, alStream: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">A/L Subjects</label>
                    <input
                      placeholder="Physics, Chemistry (comma separated)"
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                      value={form.alSubjects}
                      onChange={e => setForm({ ...form, alSubjects: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Key Skills</label>
                  <input
                    placeholder="Communication, Problem Solving, Python, etc."
                    className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                    value={form.skills}
                    onChange={e => setForm({ ...form, skills: e.target.value })}
                  />
                </div>

                {/* Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Salary (LKR)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                      value={form.salaryMin}
                      onChange={e => setForm({ ...form, salaryMin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Salary (LKR)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                      value={form.salaryMax}
                      onChange={e => setForm({ ...form, salaryMax: e.target.value })}
                    />
                  </div>
                </div>

                {/* Career Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Sector</label>
                    <input
                      placeholder="IT, Healthcare, Engineering..."
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl outline-none"
                      value={form.sector}
                      onChange={e => setForm({ ...form, sector: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Career Cluster</label>
                    <select
                      className="w-full border border-gray-200 focus:border-[#1A9A7E] p-4 rounded-2xl bg-white outline-none"
                      value={form.clusterId}
                      onChange={e => setForm({ ...form, clusterId: e.target.value })}
                    >
                      <option value="">Select Cluster</option>
                      {clusters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Required Qualifications</h3>
                  <p className="text-sm text-gray-400 mb-4">Select all qualifications that apply to this role</p>

                  {qualifications.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No qualifications available.</p>
                  ) : (
                    <div className="border border-gray-200 rounded-2xl p-4 max-h-52 overflow-y-auto space-y-2">
                      {qualifications.map(q => {
                        const selected = form.qualifications.includes(q.id);
                        return (
                          <label
                            key={q.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                              selected
                                ? 'bg-[#E8F5F1] border border-[#1A9A7E]/30'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleQualification(q.id)}
                              className="w-4 h-4 accent-[#1A9A7E] shrink-0"
                            />
                            <span className={`text-sm font-medium ${selected ? 'text-[#0F2C24]' : 'text-gray-700'}`}>
                              {q.name}
                            </span>
                            {q.level && (
                              <span className="ml-auto text-xs text-gray-400">{q.level}</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected count badge */}
                  {form.qualifications.length > 0 && (
                    <p className="text-sm text-[#1A9A7E] mt-2 font-medium">
                      {form.qualifications.length} qualification{form.qualifications.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* Additional Options */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.remoteAvailable}
                      onChange={e => setForm({ ...form, remoteAvailable: e.target.checked })}
                      className="w-5 h-5 accent-[#1A9A7E]"
                    />
                    <span>Remote Work Available</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.internshipAvailable}
                      onChange={e => setForm({ ...form, internshipAvailable: e.target.checked })}
                      className="w-5 h-5 accent-[#1A9A7E]"
                    />
                    <span>Internship Available</span>
                  </label>
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
                  {editId ? "Update Job" : "Create Job"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}