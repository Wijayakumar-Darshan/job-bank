import api from './axiosClient';

// ═══════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════
export const authApi = {
  login:    (data)  => api.post('/auth/login', data),
  register: (data)  => api.post('/auth/register', data),
  refresh:  (token) => api.post('/auth/refresh', { refreshToken: token }),
  logout:   ()      => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
};

// ═══════════════════════════════════════════
//  STUDENT SPECIFIC
// ═══════════════════════════════════════════
export const studentApi = {
  getDashboard: () => api.get('/student/dashboard'),
  getCareerClusters: () => api.get('/student/career-clusters'),
  getAllJobs: () => api.get('/student/jobs'),
  getJobsByCluster: (clusterId) => api.get(`/student/career-clusters/${clusterId}/jobs`),
};

// ═══════════════════════════════════════════
//  CAREER CLUSTERS
// ═══════════════════════════════════════════
export const clusterApi = {
  getAll: () => api.get("/clusters/public"),
  getById: (id) => api.get(`/clusters/${id}`),
  create: (data) => api.post("/clusters", data),
  update: (id, data) => api.put(`/clusters/${id}`, data),
  delete: (id) => api.delete(`/clusters/${id}`),
};

// ═══════════════════════════════════════════
//  JOBS
// ═══════════════════════════════════════════
export const jobApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ═══════════════════════════════════════════
//  QUALIFICATIONS
// ═══════════════════════════════════════════
export const qualificationApi = {
  getAll: () => api.get('/qualifications'),
  getById: (id) => api.get(`/qualifications/${id}`),
  create: (data) => api.post('/qualifications', data),
  update: (id, data) => api.put(`/qualifications/${id}`, data),
  delete: (id) => api.delete(`/qualifications/${id}`),
};

// ═══════════════════════════════════════════
//  FAVORITES
// ═══════════════════════════════════════════
export const favoriteApi = {
  getMyFavorites: () => api.get('/favorites'),
  add: (jobId) => api.post('/favorites', { jobId }),
  remove: (jobId) => api.delete(`/favorites/${jobId}`),
};

// ═══════════════════════════════════════════
//  SUBSCRIPTIONS & PAYMENTS
// ═══════════════════════════════════════════
export const subscriptionApi = {
  getMyStatus:  ()     => api.get('/subscriptions/me'),
  verifyPayment: (data)   => api.post('/subscriptions/verify', data),
  getHistory:   ()     => api.get('/subscriptions/history'),
  // Note: kept only one initiatePayment (removed duplicate)
  initiatePayment: (userId, plan) =>
    api.post('/subscriptions/initiate', null, {
      params: { userId, plan }
    }),
};

// ═══════════════════════════════════════════
//  INSTITUTES & COURSES (for future use)
// ═══════════════════════════════════════════
export const instituteApi = {
  getAll: (params) => api.get('/institutes', { params }),
  getById: (id) => api.get(`/institutes/${id}`),
  create: (data) => api.post('/institutes', data),
  update: (id, data) => api.put(`/institutes/${id}`, data),
  delete: (id) => api.delete(`/institutes/${id}`),
};

export const courseApi = {
  getByJob: (jobId) => api.get(`/courses/job/${jobId}`),
};

// ═══════════════════════════════════════════
//  USERS (Admin Only)
// ═══════════════════════════════════════════
export const userApi = {
  getAll:    (params)   => api.get('/users', { params }),
  getById:   (id)       => api.get(`/users/${id}`),
  create:    (data)     => api.post('/users', data),
  update:    (id, data) => api.put(`/users/${id}`, data),
  delete:    (id)       => api.delete(`/users/${id}`),
  toggleActive: (id)    => api.patch(`/users/${id}/toggle-active`),
};

// ═══════════════════════════════════════════
//  SYSTEM SETTINGS (Admin)
// ═══════════════════════════════════════════
export const settingsApi = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  togglePaidMode: () => api.patch('/settings/toggle-paid-mode'),
  updatePricing:  (data) => api.patch('/settings/pricing', data),
};

// ═══════════════════════════════════════════
//  ANALYTICS & REPORTS (Counselor/Admin)
// ═══════════════════════════════════════════
export const analyticsApi = {
  getDashboard:  ()     => api.get('/analytics/dashboard'),
  getTopJobs:    ()     => api.get('/analytics/jobs/top'),
};

export const reportApi = {
  generate: (type, format = 'pdf', params = {}) =>
    api.get(`/reports/${type}`, {
      params: { format, ...params },
      responseType: format === 'pdf' || format === 'excel' ? 'blob' : 'json',
    }),
};

// ═══════════════════════════════════════════
//  COUNSELOR
// ═══════════════════════════════════════════
export const counselorApi = {
  getDashboard: () => api.get('/counselor/dashboard'),
  getJobs: () => api.get('/counselor/jobs'),
  createJob: (data) => api.post('/counselor/jobs', data),
  updateJob: (id, data) => api.put(`/counselor/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/counselor/jobs/${id}`),
  getAnalytics: () => api.get('/counselor/analytics'),
  generateReport: (type) => api.get(`/counselor/reports/${type}`),
};

export default {
  authApi,
  studentApi,
  clusterApi,
  jobApi,
  qualificationApi,
  favoriteApi,
  subscriptionApi,
  instituteApi,
  courseApi,
  userApi,
  settingsApi,
  analyticsApi,
  reportApi,
  counselorApi,
};