import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '@/api';

const COLOR_MAP = ['teal', 'purple', 'coral', 'amber', 'blue', 'green', 'pink', 'red'];

const COLOR_STYLES = {
  purple: { bubble: '#E0D9FF', hoverBg: '#F0EBFF', hoverBorder: '#9B7EFF', accent: '#6B4EFF' },
  teal:   { bubble: '#A5F2E0', hoverBg: '#E0FAF4', hoverBorder: '#4EC9B5', accent: '#0F9B85' },
  coral:  { bubble: '#FFCCB7', hoverBg: '#FFEAE0', hoverBorder: '#FF8F6B', accent: '#E65C2B' },
  amber:  { bubble: '#FFE68C', hoverBg: '#FFF4D1', hoverBorder: '#FFBB33', accent: '#E69500' },
  blue:   { bubble: '#B8E1FF', hoverBg: '#E6F4FF', hoverBorder: '#5EB0FF', accent: '#1E88E5' },
  green:  { bubble: '#C8E6A8', hoverBg: '#EDF7E0', hoverBorder: '#7ED14D', accent: '#4A9B1F' },
  pink:   { bubble: '#FFC6E0', hoverBg: '#FFEDF5', hoverBorder: '#FF7EBE', accent: '#E03A8F' },
  red:    { bubble: '#FFBCBC', hoverBg: '#FFEBEB', hoverBorder: '#FF6B6B', accent: '#E02B2B' },
};

const DEFAULT_EMOJIS = {
  'healthcare': '⚕️', 'technology': '💻', 'education': '📚', 'business': '💼',
  'engineering': '⚙️', 'arts': '🎨', 'science': '🔬', 'law': '⚖️',
};

function ClusterCard({ cluster, colorKey, onClick, animationDelay }) {
  const [hovered, setHovered] = useState(false);
  const c = COLOR_STYLES[colorKey] || COLOR_STYLES.blue;

  const getEmoji = () => {
    if (cluster.emoji) return cluster.emoji;
    const lowerName = cluster.name?.toLowerCase() || '';
    for (const [key, emoji] of Object.entries(DEFAULT_EMOJIS)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '💼';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Explore ${cluster.name}`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.hoverBg : 'white',
        border: `3px solid ${hovered ? c.hoverBorder : '#f1f5f9'}`,
        borderRadius: '28px',
        padding: '2rem 1.5rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-16px) scale(1.04)' : 'translateY(0)',
        boxShadow: hovered 
          ? '0 25px 50px -12px rgb(0 0 0 / 0.15)' 
          : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        animation: `popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}s both`,
      }}
    >
      {/* Emoji Bubble */}
      <div style={{
        width: 92,
        height: 92,
        borderRadius: '50%',
        background: c.bubble,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.2rem',
        margin: '0 auto 1.5rem',
        boxShadow: '0 10px 20px -5px rgba(0,0,0,0.12)',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'scale(1.2) rotate(12deg)' : 'scale(1)',
      }}>
        {getEmoji()}
      </div>

      {cluster.tag && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          fontSize: '11px',
          fontWeight: 800,
          padding: '5px 12px',
          borderRadius: '9999px',
          background: c.accent + '15',
          color: c.accent,
          letterSpacing: '0.6px',
        }}>
          {cluster.tag}
        </div>
      )}

      <p style={{
        fontSize: '1.35rem',
        fontWeight: 800,
        color: '#1e2937',
        margin: '0 0 0.75rem',
        lineHeight: 1.25,
        textAlign: 'center',
        fontFamily: "'Fredoka One', cursive",
      }}>
        {cluster.name}
      </p>

      <p style={{
        fontSize: '0.95rem',
        color: '#64748b',
        lineHeight: 1.6,
        textAlign: 'center',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {cluster.description || 'Explore exciting opportunities in this field!'}
      </p>
    </div>
  );
}

export default function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    studentApi.getCareerClusters()
      .then(res => setClusters(res.data.data || []))
      .catch(err => {
        console.error(err);
        setError('Failed to load career clusters. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = clusters.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8) translateY(40px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        fontFamily: "'Nunito', sans-serif",
        padding: '2.5rem 1rem 5rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#fff',
              padding: '10px 24px',
              borderRadius: '9999px',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.07)'
            }}>
              <span style={{ fontSize: '1.75rem' }}>🚀</span>
              <p style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#6366f1' }}>
                CAREER EXPLORER
              </p>
            </div>

            <h1 style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: '3.2rem',
              fontWeight: 400,
              color: '#1e2937',
              margin: '0 0 1rem',
              lineHeight: 1.1,
            }}>
              What do you want to be?
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: 560,
              margin: '0 auto',
              fontWeight: 600,
            }}>
              Discover exciting career clusters that match your personality and dreams!
            </p>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto 4rem', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search careers or interests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 20px 18px 62px',
                border: '2px solid #e2e8f0',
                borderRadius: '9999px',
                fontSize: '1.05rem',
                fontWeight: 600,
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#7c6bff'; e.target.style.boxShadow = '0 0 0 5px rgba(124,107,255,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
            />
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '6rem 1rem', fontSize: '1.25rem', color: '#64748b', fontWeight: 600 }}>⏳ Loading amazing careers for you...</div>}
          {error && <div style={{ textAlign: 'center', padding: '6rem 1rem', fontSize: '1.25rem', color: '#ef4444', fontWeight: 600 }}>⚠️ {error}</div>}

          {!loading && !error && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              justifyContent: 'center',        // ← This centers the cards
              justifyItems: 'center',          // Ensures individual cards are centered
            }}>
              {filtered.length > 0 ? (
                filtered.map((cluster, i) => (
                  <ClusterCard
                    key={cluster.id}
                    cluster={cluster}
                    colorKey={COLOR_MAP[i % COLOR_MAP.length]}
                    animationDelay={Math.min(i * 0.035, 0.8)}
                    onClick={() => navigate(`/student/jobs?clusterId=${cluster.id}`)}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 1rem', color: '#64748b', fontSize: '1.25rem', fontWeight: 600 }}>
                  No matching careers found 😔<br />Try different keywords!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}