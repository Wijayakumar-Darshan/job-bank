import { useNavigate } from 'react-router-dom'

const C = { primary: '#0A2E1C', accent: '#E8A200' }

const NAV = {
  STUDENT: [
    { section: 'Main' },
    { path: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/student/clusters', icon: '🗂️', label: 'Career Clusters' },
    { path: '/student/jobs', icon: '💼', label: 'Browse Jobs' },
    { path: '/student/favorites', icon: '❤️', label: 'Saved Jobs' },
    { section: 'Account' },
    { path: '/student/subscription', icon: '💳', label: 'Subscription' },
    { path: '/student/profile', icon: '👤', label: 'My Profile' },
  ],

  COUNSELOR: [
    { section: 'Management' },
    { path: '/counselor/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/counselor/jobs', icon: '💼', label: 'Manage Jobs' },
    { path: '/counselor/institutes', icon: '🏫', label: 'Institutes & Courses' },
    { section: 'Insights' },
    { path: '/counselor/analytics', icon: '📊', label: 'Analytics' },
    { path: '/counselor/reports', icon: '📋', label: 'Reports' },
  ],

  SUPER_ADMIN: [
    { section: 'Management' },

    { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },

    // 👇 CORE CRUD MODULES
    { path: '/admin/users', icon: '👥', label: 'User Management' },
    { path: '/admin/jobs', icon: '💼', label: 'Job Management' },
    { path: '/admin/clusters', icon: '🗂️', label: 'Career Clusters' },

    { section: 'System Control' },
    { path: '/admin/subscription', icon: '💳', label: 'Subscription Control' },
    { path: '/admin/payments', icon: '💰', label: 'Payment History' },
    { path: '/admin/settings', icon: '⚙️', label: 'System Settings' },

    { section: 'Reports & Analytics' },
    { path: '/admin/analytics', icon: '📊', label: 'Analytics' },
    { path: '/admin/reports', icon: '📋', label: 'Reports' },
  ],
}

const ROLE_LABELS = {
  STUDENT: 'Student',
  COUNSELOR: 'Counselor',
  SUPER_ADMIN: 'Super Admin'
}

export default function Sidebar({ user, currentPath, onLogout }) {
  const navigate = useNavigate()
  const items = NAV[user?.role] || []

  return (
    <div
      style={{
        width: 232,
        background: C.primary,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      {/* LOGO */}
      <div style={{
        padding: '22px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,.1)'
      }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: C.accent }}>
          🇱🇰 SL Job Bank
        </div>

        <div style={{
          fontSize: 10,
          opacity: 0.4,
          textTransform: 'uppercase',
          marginTop: 2
        }}>
          Career Guidance System
        </div>

        <div style={{
          marginTop: 10,
          fontSize: 10,
          padding: '3px 9px',
          borderRadius: 10,
          background: 'rgba(232,162,0,.2)',
          color: C.accent,
          fontWeight: 700,
          display: 'inline-block'
        }}>
          {ROLE_LABELS[user?.role]}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={{ flex: 1, paddingBottom: 8 }}>
        {items.map((item, i) => {
          if (item.section) {
            return (
              <div
                key={i}
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  opacity: 0.35,
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                  padding: '14px 18px 4px'
                }}
              >
                {item.section}
              </div>
            )
          }

          const active = currentPath.startsWith(item.path)

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 18px',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: 600,
                color: active ? C.accent : 'rgba(255,255,255,.72)',
                background: active ? 'rgba(232,162,0,.12)' : 'transparent',
                borderLeft: `3px solid ${active ? C.accent : 'transparent'}`,
                userSelect: 'none'
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid rgba(255,255,255,.1)'
      }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {user?.fullName}
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 10 }}>
          {user?.email}
        </div>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,.08)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            color: 'rgba(255,255,255,.7)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  )
}