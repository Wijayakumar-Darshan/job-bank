import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { studentApi } from '@/api';

const CARD_COLORS = [
  { bubble: '#CECBF6', tag: { bg: '#EEEDFE', color: '#3C3489' }, accent: '#7F77DD', salaryBg: '#EEEDFE', salaryColor: '#3C3489' },
  { bubble: '#9FE1CB', tag: { bg: '#E1F5EE', color: '#085041' }, accent: '#1D9E75', salaryBg: '#E1F5EE', salaryColor: '#085041' },
  { bubble: '#B5D4F4', tag: { bg: '#E6F1FB', color: '#0C447C' }, accent: '#378ADD', salaryBg: '#E6F1FB', salaryColor: '#0C447C' },
  { bubble: '#F5C4B3', tag: { bg: '#FAECE7', color: '#712B13' }, accent: '#D85A30', salaryBg: '#FAECE7', salaryColor: '#712B13' },
  { bubble: '#FAC775', tag: { bg: '#FAEEDA', color: '#633806' }, accent: '#BA7517', salaryBg: '#FAEEDA', salaryColor: '#633806' },
  { bubble: '#F4C0D1', tag: { bg: '#FBEAF0', color: '#72243E' }, accent: '#D4537E', salaryBg: '#FBEAF0', salaryColor: '#72243E' },
  { bubble: '#C0DD97', tag: { bg: '#EAF3DE', color: '#27500A' }, accent: '#639922', salaryBg: '#EAF3DE', salaryColor: '#27500A' },
  { bubble: '#F7C1C1', tag: { bg: '#FCEBEB', color: '#791F1F' }, accent: '#E24B4A', salaryBg: '#FCEBEB', salaryColor: '#791F1F' },
];

const JOB_EMOJIS = ['💼', '🔬', '💻', '🏥', '🎨', '⚖️', '🌱', '✈️', '🎓', '🏗️', '📢', '🍽️'];

function JobCard({ job, colorIdx, animDelay, onClick }) {
  const [hovered, setHovered] = useState(false);
  const c = CARD_COLORS[colorIdx % CARD_COLORS.length];
  const emoji = job.emoji || JOB_EMOJIS[colorIdx % JOB_EMOJIS.length];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${job.title} career details`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: `1.5px solid ${hovered ? c.accent : '#e5e7eb'}`,
        borderRadius: 22,
        padding: '1.4rem 1.25rem 1.25rem',
        cursor: 'pointer',
        transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1), border-color 0.15s, box-shadow 0.15s',
        transform: hovered ? 'translateY(-5px) scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? `0 8px 28px ${c.accent}28` : 'none',
        animation: `popIn 0.4s cubic-bezier(.34,1.56,.64,1) ${animDelay}s both`,
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Top row: emoji bubble + cluster tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: c.bubble,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem',
          transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1)',
          transform: hovered ? 'scale(1.15) rotate(-8deg)' : 'scale(1)',
        }}>
          {emoji}
        </div>
        {job.cluster?.name && (
          <span style={{
            background: c.tag.bg, color: c.tag.color,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '3px 10px', borderRadius: 50,
            fontFamily: "'Nunito', sans-serif",
          }}>
            {job.cluster.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Fredoka One', cursive", fontWeight: 400,
        fontSize: '1.2rem', color: '#111', margin: '0 0 0.4rem', lineHeight: 1.2,
      }}>
        {job.title}
      </h3>

      {/* Description */}
      <p style={{
        margin: '0 0 auto', fontSize: 13, fontWeight: 600, color: '#6b7280',
        lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif", paddingBottom: '1rem',
      }}>
        {job.description}
      </p>

      {/* Footer: salary + arrow */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1.5px solid #f3f4f6', paddingTop: '0.9rem', marginTop: '0.9rem',
      }}>
        <div style={{
          background: c.salaryBg, color: c.salaryColor,
          fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 50,
          fontFamily: "'Nunito', sans-serif",
        }}>
          💰 LKR {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: hovered ? c.bubble : '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, transition: 'background 0.15s, transform 0.15s',
          transform: hovered ? 'translateX(3px)' : 'none',
          color: hovered ? c.accent : '#9ca3af',
        }}>
          →
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const clusterId = searchParams.get('clusterId');

  useEffect(() => {
    setLoading(true);
    const fetch = clusterId
      ? studentApi.getJobsByCluster(clusterId)
      : studentApi.getAllJobs();
    fetch
      .then(res => setJobs(res.data.data))
      .finally(() => setLoading(false));
  }, [clusterId]);

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.cluster?.name?.toLowerCase().includes(search.toLowerCase()) ||
    j.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.75) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .jobs-search:focus { border-color: #1D9E75 !important; }
        .jobs-search { outline: none; }
      `}</style>

      <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 0.3rem', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af' }}>
              {clusterId ? '🗂️ Filtered by cluster' : '🌍 Explore all'}
            </p>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#111', margin: '0 0 0.4rem', lineHeight: 1.1 }}>
              {clusterId ? 'Careers in this Cluster' : 'All Careers'}
            </h1>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
              {loading ? 'Finding careers for you…' : `${filtered.length} career${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 440, marginBottom: '2rem' }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="jobs-search"
              type="text"
              placeholder="Search by title, cluster, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search careers"
              style={{
                width: '100%', padding: '11px 16px 11px 44px', boxSizing: 'border-box',
                border: '1.5px solid #e5e7eb', borderRadius: 50,
                fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600,
                color: '#111', background: 'white', transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2.5rem', animation: 'spin 1.1s linear infinite', display: 'inline-block' }}>⚙️</div>
              <p style={{ fontWeight: 700, color: '#6b7280', fontSize: 15, margin: 0 }}>Loading careers...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '2.5rem', margin: '0 0 12px' }}>🔍</p>
              <p style={{ fontWeight: 700, color: '#6b7280', fontSize: 15, margin: 0 }}>
                No careers found — try a different search!
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 20,
            }}>
              {filtered.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  colorIdx={i}
                  animDelay={i * 0.045}
                  onClick={() => navigate(`/student/jobs/${job.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}