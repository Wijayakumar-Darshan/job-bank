import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'

// Layouts
import AppLayout from '@/components/layout/AppLayout'

// Auth Pages
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Student Pages
import StudentDashboard  from '@/pages/student/Dashboard'
import ClustersPage      from '@/pages/student/Clusters'
import JobsPage          from '@/pages/student/Jobs'
import JobDetailPage     from '@/pages/student/JobDetail'
import FavoritesPage     from '@/pages/student/Favorites'
import SubscriptionPage  from '@/pages/student/Subscription'
import ProfilePage       from '@/pages/student/Profile'

// Counselor Pages
import CounselorDashboard  from '@/pages/counselor/Dashboard'
import CounselorJobs       from '@/pages/counselor/ManageJobs'
import CounselorInstitutes from '@/pages/counselor/ManageInstitutes'
import CounselorAnalytics  from '@/pages/counselor/Analytics'
import CounselorReports    from '@/pages/counselor/Reports'

// Admin Pages
import AdminDashboard    from '@/pages/admin/Dashboard'
import AdminUsers        from '@/pages/admin/Users'
import AdminJobs         from '@/pages/admin/Jobs'
import AdminClusters from '@/pages/admin/Clusters'
import AdminSubscription from '@/pages/admin/Subscription'
import AdminPayments     from '@/pages/admin/Payments'
import AdminSettings     from '@/pages/admin/Settings'
import AdminAnalytics    from '@/pages/admin/Analytics'
import AdminReports      from '@/pages/admin/Reports'

// ── Guards ──────────────────────────────────────────────────
function RequireAuth({ children, roles }) {
  const { user, isAuthenticated } = useAuthStore()
  const { paidModeEnabled } = useSettingsStore()
  const location = useLocation()

  if (!isAuthenticated()) return <Navigate to="/login" state={{ from: location }} replace />

  if (roles && !roles.includes(user?.role))
    return <Navigate to="/unauthorized" replace />

  // Paid mode guard: redirect free students to subscription
  if (
    paidModeEnabled &&
    user?.role === 'STUDENT' &&
    user?.subscriptionType !== 'PAID' &&
    location.pathname !== '/student/subscription'
  ) {
    return <Navigate to="/student/subscription" replace />
  }

  return children
}

function RequireGuest({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated()) return children
  const defaultRoute = {
    STUDENT:     '/student/dashboard',
    COUNSELOR:   '/counselor/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
  }
  return <Navigate to={defaultRoute[user?.role] || '/student/dashboard'} replace />
}

// ── Router ───────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<RequireGuest><LoginPage /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student */}
      <Route path="/student" element={<RequireAuth roles={['STUDENT']}><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<StudentDashboard />} />
        <Route path="clusters"     element={<ClustersPage />} />
        <Route path="jobs"         element={<JobsPage />} />
        <Route path="jobs/:id"     element={<JobDetailPage />} />
        <Route path="favorites"    element={<FavoritesPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="profile"      element={<ProfilePage />} />
      </Route>

      {/* Counselor */}
      <Route path="/counselor" element={<RequireAuth roles={['COUNSELOR']}><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<CounselorDashboard />} />
        <Route path="jobs"        element={<CounselorJobs />} />
        <Route path="institutes"  element={<CounselorInstitutes />} />
        <Route path="analytics"   element={<CounselorAnalytics />} />
        <Route path="reports"     element={<CounselorReports />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<RequireAuth roles={['SUPER_ADMIN']}><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<AdminDashboard />} />
        <Route path="users"        element={<AdminUsers />} />
        <Route path="jobs"         element={<AdminJobs />} />
        <Route path="clusters" element={<AdminClusters />} />
        <Route path="subscription" element={<AdminSubscription />} />
        <Route path="payments"     element={<AdminPayments />} />
        <Route path="settings"     element={<AdminSettings />} />
        <Route path="analytics"    element={<AdminAnalytics />} />
        <Route path="reports"      element={<AdminReports />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
