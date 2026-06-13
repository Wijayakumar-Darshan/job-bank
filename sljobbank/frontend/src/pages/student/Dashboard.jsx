import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '@/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    studentApi.getDashboard()
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'));
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const h = time.getHours();
    if (h < 12) return { text: 'Good morning', emoji: '🌅', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' };
    if (h < 17) return { text: 'Good afternoon', emoji: '☀️', gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' };
    return { text: 'Good evening', emoji: '🌙', gradient: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)' };
  };

  const greeting = getGreeting();

  if (!data) return (
    <div style={styles.loadWrap}>
      <div style={styles.loadCard}>
        <div style={styles.spinner} />
        <p style={styles.loadTxt}>Preparing your personalized dashboard...</p>
      </div>
    </div>
  );

  const stats = [
    { 
      label: 'Total Careers', 
      value: data.totalJobs, 
      icon: '💼', 
      bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
      iconBg: '#10B981',
      progress: 85
    },
    { 
      label: 'Clusters', 
      value: data.totalClusters, 
      icon: '🎯', 
      bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      iconBg: '#3B82F6',
      progress: 70
    },
    { 
      label: 'Your Plan', 
      value: data.subscriptionType, 
      icon: '⭐', 
      bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      iconBg: '#F59E0B',
      progress: 100
    },
    { 
      label: 'Learning Streak', 
      value: `${data.streak ?? 7} days`, 
      icon: '🔥', 
      bg: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      iconBg: '#EA580C',
      progress: 60
    },
  ];

  return (
    <div style={styles.page}>
      {/* Animated Background */}
      <div style={styles.bgPattern} />
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.container}>

        {/* Hero Header Section */}
        <div style={{ ...styles.heroCard, background: greeting.gradient }}>
          <div style={styles.heroContent}>
            <div style={styles.heroLeft}>
              <div style={styles.greetingBadge}>
                <span style={styles.greetingEmoji}>{greeting.emoji}</span>
                <span style={styles.greetingText}>{greeting.text}</span>
              </div>
              <h1 style={styles.heroTitle}>
                Welcome back, <br/>
                <span style={styles.heroName}>{data.studentName?.split(' ')[0] || 'Student'}! 👋</span>
              </h1>
              <p style={styles.heroSubtitle}>
                Ready to discover amazing career opportunities today?
              </p>
              <button 
                style={styles.heroCTA}
                onClick={() => navigate('/student/jobs')}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
              >
                <span>Explore Careers</span>
                <span style={styles.ctaArrow}>→</span>
              </button>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.dateCard}>
                <div style={styles.dateDay}>{time.getDate()}</div>
                <div style={styles.dateMonth}>
                  {time.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div style={styles.dateWeekday}>
                  {time.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Enhanced */}
        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div 
              key={i} 
              style={{ 
                ...styles.statCard,
                background: stat.bg,
                animationDelay: `${i * 0.1}s`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.statHeader}>
                <div style={{ ...styles.statIconBox, background: stat.iconBg }}>
                  {stat.icon}
                </div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${stat.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>

          {/* Featured Careers - Left Column */}
          <div style={styles.leftColumn}>
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>✨</span>
                    Recommended For You
                  </h2>
                  <p style={styles.sectionSubtitle}>Based on your interests and profile</p>
                </div>
                <button 
                  style={styles.viewAllBtn}
                  onClick={() => navigate('/student/jobs')}
                >
                  View All
                  <span style={styles.viewAllArrow}>→</span>
                </button>
              </div>

              <div style={styles.jobsContainer}>
                {data.recommendedJobs?.slice(0, 5).map((job, i) => (
                  <div
                    key={job.id}
                    style={{ 
                      ...styles.jobCard,
                      animationDelay: `${i * 0.08}s`
                    }}
                    onClick={() => navigate(`/student/jobs/${job.id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.borderColor = '#10B981';
                      e.currentTarget.style.background = '#F0FDF4';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <div style={styles.jobIconWrapper}>
                      <div style={styles.jobIcon}>💼</div>
                    </div>
                    <div style={styles.jobContent}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <div style={styles.jobMeta}>
                        <span style={styles.jobCluster}>
                          🎯 {job.cluster?.name || 'General'}
                        </span>
                        {job.trending && (
                          <span style={styles.trendingBadge}>🔥 Trending</span>
                        )}
                      </div>
                    </div>
                    <div style={styles.jobArrow}>›</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Clusters Section */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>🗂️</span>
                    Explore Career Paths
                  </h2>
                  <p style={styles.sectionSubtitle}>Discover diverse career opportunities</p>
                </div>
                <button 
                  style={styles.viewAllBtn}
                  onClick={() => navigate('/student/clusters')}
                >
                  See More
                  <span style={styles.viewAllArrow}>→</span>
                </button>
              </div>

              <div style={styles.clustersGrid}>
                {data.careerClusters?.slice(0, 6).map((cluster, i) => (
                  <div
                    key={cluster.id}
                    style={{
                      ...styles.clusterCard,
                      animationDelay: `${i * 0.05}s`
                    }}
                    onClick={() => navigate(`/student/jobs?clusterId=${cluster.id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-8px) rotate(2deg)';
                      e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div style={styles.clusterEmoji}>{cluster.emoji || '📁'}</div>
                    <p style={styles.clusterName}>{cluster.name}</p>
                    <div style={styles.clusterCount}>{cluster.jobCount || 0} careers</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={styles.rightColumn}>

            {/* Quick Actions */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                <span style={styles.sectionIcon}>⚡</span>
                Quick Actions
              </h3>
              <div style={styles.actionsList}>
                {[
                  { label: 'Browse All Careers', icon: '🔍', path: '/student/jobs', color: '#10B981' },
                  { label: 'Saved Favorites', icon: '❤️', path: '/student/saved', color: '#EF4444' },
                  { label: 'My Profile', icon: '👤', path: '/student/profile', color: '#8B5CF6' },
                  { label: 'Career Assessment', icon: '📊', path: '/student/assessment', color: '#F59E0B' },
                ].map((action, i) => (
                  <button
                    key={i}
                    style={{
                      ...styles.actionButton,
                      animationDelay: `${i * 0.07}s`
                    }}
                    onClick={() => navigate(action.path)}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = action.color + '15';
                      e.currentTarget.style.borderColor = action.color;
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={styles.actionIcon}>{action.icon}</span>
                    <span style={styles.actionLabel}>{action.label}</span>
                    <span style={{ ...styles.actionArrow, color: action.color }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                <span style={styles.sectionIcon}>📈</span>
                Your Progress
              </h3>
              <div style={styles.progressContent}>
                <div style={styles.progressItem}>
                  <div style={styles.progressInfo}>
                    <span style={styles.progressLabel}>Profile Completion</span>
                    <span style={styles.progressPercent}>75%</span>
                  </div>
                  <div style={styles.progressBarLarge}>
                    <div style={{ ...styles.progressFillLarge, width: '75%', background: '#10B981' }} />
                  </div>
                </div>
                <div style={styles.progressItem}>
                  <div style={styles.progressInfo}>
                    <span style={styles.progressLabel}>Careers Explored</span>
                    <span style={styles.progressPercent}>12/{data.totalJobs}</span>
                  </div>
                  <div style={styles.progressBarLarge}>
                    <div style={{ ...styles.progressFillLarge, width: `${(12/data.totalJobs)*100}%`, background: '#3B82F6' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div style={styles.quoteCard}>
              <div style={styles.quoteIcon}>💭</div>
              <p style={styles.quoteText}>
                "The future belongs to those who believe in the beauty of their dreams."
              </p>
              <p style={styles.quoteAuthor}>— Eleanor Roosevelt</p>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  // Page Layout
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: '#F9FAFB',
    minHeight: '100vh',
    padding: '2rem 1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },

  // Background Elements
  bgPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20px 20px, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 60px 60px, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob1: {
    position: 'fixed',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 20s ease-in-out infinite',
    zIndex: 0,
  },
  blob2: {
    position: 'fixed',
    bottom: '-10%',
    left: '-5%',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 25s ease-in-out infinite reverse',
    zIndex: 0,
  },
  blob3: {
    position: 'fixed',
    top: '40%',
    right: '30%',
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(253, 224, 71, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(70px)',
    animation: 'float 30s ease-in-out infinite',
    zIndex: 0,
  },

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },

  // Loading State
  loadWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
  },
  loadCard: {
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '3rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.1)',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadTxt: {
    color: '#6B7280',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    letterSpacing: '-0.3px',
  },

  // Hero Section
  heroCard: {
    borderRadius: '32px',
    padding: '3rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
    animation: 'slideUp 0.6s ease both',
    backgroundSize: '200% 200%',
  },
  heroContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  heroLeft: {
    flex: 1,
    minWidth: '300px',
  },
  greetingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.95)',
    padding: '8px 16px',
    borderRadius: '12px',
    marginBottom: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  greetingEmoji: {
    fontSize: '20px',
  },
  greetingText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '38px',
    fontWeight: '800',
    color: '#111827',
    lineHeight: 1.2,
    marginBottom: '0.75rem',
    letterSpacing: '-1px',
  },
  heroName: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  heroCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#111827',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
  },
  ctaArrow: {
    fontSize: '18px',
    transition: 'transform 0.3s',
  },
  heroRight: {
    display: 'flex',
    alignItems: 'center',
  },
  dateCard: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
    minWidth: '140px',
  },
  dateDay: {
    fontSize: '48px',
    fontWeight: '900',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#111827',
    lineHeight: 1,
  },
  dateMonth: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#6B7280',
    marginTop: '4px',
    letterSpacing: '0.5px',
  },
  dateWeekday: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#10B981',
    marginTop: '8px',
    padding: '4px 8px',
    background: '#D1FAE5',
    borderRadius: '6px',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    borderRadius: '24px',
    padding: '1.75rem',
    border: '2px solid rgba(255,255,255,0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    animation: 'slideUp 0.6s ease both',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  statIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    boxShadow: '0 8px 20px -5px rgba(0,0,0,0.2)',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '900',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#111827',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: '0.3px',
    marginBottom: '0.75rem',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.6)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'rgba(17, 24, 39, 0.8)',
    borderRadius: '999px',
    transition: 'width 1s ease',
  },

  // Main Grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '2rem',
    alignItems: 'start',
  },

  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  // Section Cards
  sectionCard: {
    background: '#FFFFFF',
    borderRadius: '28px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6',
    animation: 'slideUp 0.6s ease both',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.75rem',
  },
  sectionTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '20px',
    fontWeight: '800',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '0.25rem',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  sectionSubtitle: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: '4px',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#F3F4F6',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  viewAllArrow: {
    fontSize: '16px',
    transition: 'transform 0.2s',
  },

  // Jobs
  jobsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  jobCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideUp 0.5s ease both',
  },
  jobIconWrapper: {
    flexShrink: 0,
  },
  jobIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
  },
  jobContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '6px',
    lineHeight: 1.4,
  },
  jobMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  jobCluster: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#10B981',
    background: '#D1FAE5',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  trendingBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#EA580C',
    background: '#FED7AA',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  jobArrow: {
    fontSize: '28px',
    color: '#D1D5DB',
    fontWeight: '700',
    transition: 'color 0.2s',
  },

  // Clusters
  clustersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
  },
  clusterCard: {
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    border: '2px solid #E5E7EB',
    borderRadius: '18px',
    padding: '1.25rem 0.75rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideUp 0.5s ease both',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  clusterEmoji: {
    fontSize: '36px',
    marginBottom: '0.5rem',
  },
  clusterName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#374151',
    lineHeight: 1.3,
    marginBottom: '4px',
  },
  clusterCount: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9CA3AF',
  },

  // Side Cards
  sideCard: {
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6',
    animation: 'slideUp 0.6s ease both',
  },
  sideTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '16px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Quick Actions
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: '#F9FAFB',
    border: '2px solid #E5E7EB',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', sans-serif",
    width: '100%',
    textAlign: 'left',
    animation: 'slideUp 0.5s ease both',
  },
  actionIcon: {
    fontSize: '22px',
  },
  actionLabel: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  actionArrow: {
    fontSize: '18px',
    fontWeight: '700',
    transition: 'transform 0.2s',
  },

  // Progress
  progressContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#111827',
  },
  progressBarLarge: {
    height: '8px',
    background: '#F3F4F6',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 1s ease',
  },

  // Quote Card
  quoteCard: {
    background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    borderRadius: '20px',
    padding: '1.75rem',
    textAlign: 'center',
    border: '2px solid #BAE6FD',
    animation: 'slideUp 0.7s ease both',
  },
  quoteIcon: {
    fontSize: '32px',
    marginBottom: '0.75rem',
  },
  quoteText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0C4A6E',
    lineHeight: 1.6,
    fontStyle: 'italic',
    marginBottom: '0.75rem',
  },
  quoteAuthor: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0369A1',
  },
};