import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobApi } from '@/api';
import toast from 'react-hot-toast';

/* ─── tiny helpers ─── */
const Tag = ({ children, bg, color }) => (
  <span style={{
    display: 'inline-block', background: bg, color, fontWeight: 800,
    fontSize: 12, letterSpacing: '0.05em', padding: '4px 12px',
    borderRadius: 50, fontFamily: "'Nunito', sans-serif",
  }}>{children}</span>
);

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f9fafb', borderRadius: 14, marginBottom: 8 }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <div>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111' }}>{value}</p>
    </div>
  </div>
);

const Section = ({ title, emoji, children }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <h3 style={{
      fontFamily: "'Fredoka One', cursive", fontWeight: 400, fontSize: '1.3rem',
      color: '#111', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>{emoji}</span> {title}
    </h3>
    {children}
  </div>
);

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.getById(id);
        setJob(res.data.data);
      } catch {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f9fafb', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1.2s linear infinite' }}>⚙️</div>
      <p style={{ fontWeight: 700, color: '#6b7280', fontSize: 16 }}>Loading career details...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#f9fafb', fontFamily: "'Nunito', sans-serif" }}>
      <span style={{ fontSize: '3rem' }}>🔍</span>
      <p style={{ fontWeight: 700, color: '#6b7280', fontSize: 16 }}>Job not found</p>
    </div>
  );

  const skills = job.skills ? job.skills.split(',').map(s => s.trim()) : [];

  const SKILL_COLORS = [
    { bg: '#EEEDFE', color: '#3C3489' },
    { bg: '#E1F5EE', color: '#085041' },
    { bg: '#E6F1FB', color: '#0C447C' },
    { bg: '#EAF3DE', color: '#27500A' },
    { bg: '#FAEEDA', color: '#633806' },
    { bg: '#FBEAF0', color: '#72243E' },
    { bg: '#FAECE7', color: '#712B13' },
    { bg: '#FCEBEB', color: '#791F1F' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        .save-btn:hover { background: #EEEDFE !important; border-color: #AFA9EC !important; }
        .dl-btn:hover   { background: #111 !important; }
        .back-btn:hover { color: #0f6e56 !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", padding: '2rem 1.25rem 4rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Back */}
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 50,
              padding: '8px 18px', fontFamily: "'Nunito', sans-serif",
              fontSize: 14, fontWeight: 700, color: '#1d9e75', cursor: 'pointer',
              marginBottom: '1.5rem', transition: 'color 0.15s',
            }}
          >
            ← Back to Careers
          </button>

          {/* Hero Card */}
          <div style={{
            background: 'white', borderRadius: 24, overflow: 'hidden',
            border: '1.5px solid #e5e7eb',
            animation: 'fadeUp 0.45s cubic-bezier(.34,1.2,.64,1) both',
          }}>
            {/* Header banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 60%, #5DCAA5 100%)',
              padding: '2.5rem 2rem 2rem', position: 'relative', overflow: 'hidden',
            }}>
              {/* decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ position: 'absolute', bottom: -30, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, position: 'relative', zIndex: 1 }}>
                {job.image ? (
                  <img
                    src={job.image}
                    alt={job.title}
                    style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 18, border: '3px solid rgba(255,255,255,0.35)', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 88, height: 88, borderRadius: 18, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
                    💼
                  </div>
                )}
                <div>
                  {job.cluster?.name && (
                    <div style={{
                      display: 'inline-block', background: 'rgba(255,255,255,0.2)',
                      color: 'white', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                      textTransform: 'uppercase', padding: '3px 12px', borderRadius: 50, marginBottom: 8,
                    }}>
                      {job.cluster.name}
                    </div>
                  )}
                  <h1 style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 400, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
                    {job.title}
                  </h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {job.sector && <Tag bg="rgba(255,255,255,0.18)" color="white">{job.sector}</Tag>}
                    {job.remoteAvailable && <Tag bg="rgba(255,255,255,0.18)" color="white">🌐 Remote</Tag>}
                    {job.internshipAvailable && <Tag bg="rgba(255,255,255,0.18)" color="white">🎓 Internships</Tag>}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '2.5rem' }}>

                {/* ── Left column ── */}
                <div>
                  {/* About */}
                  {job.description && (
                    <Section title="About this Career" emoji="🌟">
                      <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 15, fontWeight: 600, margin: 0 }}>
                        {job.description}
                      </p>
                    </Section>
                  )}

                  {/* Responsibilities */}
                  {job.responsibilities && (
                    <Section title="Key Responsibilities" emoji="📋">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {job.responsibilities.split('\n').filter(Boolean).map((line, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ color: '#1D9E75', fontWeight: 800, fontSize: 16, marginTop: 1, flexShrink: 0 }}>✦</span>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#374151', lineHeight: 1.6 }}>{line.replace(/^[-•*]\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Career Pathway */}
                  {job.careerPathway && (
                    <Section title="Career Progression Path" emoji="🚀">
                      <div style={{ background: '#f0fdf8', border: '1.5px solid #9FE1CB', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                          {job.careerPathway}
                        </p>
                      </div>
                    </Section>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <Section title="Required Skills" emoji="🛠️">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {skills.map((skill, i) => {
                          const c = SKILL_COLORS[i % SKILL_COLORS.length];
                          return (
                            <span key={i} style={{
                              background: c.bg, color: c.color,
                              fontWeight: 800, fontSize: 13,
                              padding: '6px 14px', borderRadius: 50,
                              fontFamily: "'Nunito', sans-serif",
                            }}>
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </Section>
                  )}
                </div>

                {/* ── Right sidebar ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Salary */}
                  {(job.salaryMin || job.salaryMax) && (
                    <div style={{ background: '#f0fdf8', border: '1.5px solid #9FE1CB', borderRadius: 18, padding: '1.25rem 1.5rem' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        💰 Salary Range (LKR)
                      </p>
                      <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontWeight: 400, fontSize: '1.6rem', color: '#0F6E56', lineHeight: 1.2 }}>
                        {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#1D9E75', fontWeight: 700 }}>per month</p>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {job.industryDemand && <InfoRow icon="📈" label="Industry Demand" value={job.industryDemand} />}
                    {job.employmentGrowth && <InfoRow icon="🌱" label="Employment Growth" value={job.employmentGrowth} />}
                    {job.sector && <InfoRow icon="🏢" label="Sector" value={job.sector} />}
                  </div>

                  {/* Education */}
                  {(job.alStream || job.alSubjects) && (
                    <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 18, padding: '1.25rem' }}>
                      <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        🎓 Education
                      </p>
                      {job.alStream && (
                        <div style={{ marginBottom: 8 }}>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>A/L Stream</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#111' }}>{job.alStream}</p>
                        </div>
                      )}
                      {job.alSubjects && (
                        <div>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>Recommended Subjects</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1.5 }}>{job.alSubjects}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Availability badges */}
                  {(job.remoteAvailable || job.internshipAvailable) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {job.remoteAvailable && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf8', border: '1.5px solid #9FE1CB', borderRadius: 14, padding: '10px 14px' }}>
                          <span style={{ fontSize: 20 }}>🌐</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F6E56' }}>Remote Work Available</span>
                        </div>
                      )}
                      {job.internshipAvailable && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#E6F1FB', border: '1.5px solid #85B7EB', borderRadius: 14, padding: '10px 14px' }}>
                          <span style={{ fontSize: 20 }}>📚</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#185FA5' }}>Internships Available</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
                    <button
                      className="save-btn"
                      onClick={() => {
                        setSaved(s => !s);
                        toast.success(saved ? 'Removed from saved careers' : 'Added to your saved careers! ❤️');
                      }}
                      style={{
                        width: '100%', padding: '13px 0',
                        border: `2px solid ${saved ? '#AFA9EC' : '#AFA9EC'}`,
                        background: saved ? '#EEEDFE' : 'white',
                        color: '#3C3489', borderRadius: 14,
                        fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                        cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                      }}
                    >
                      {saved ? '💜 Saved!' : '🤍 Save this Career'}
                    </button>

                    <button
                      className="dl-btn"
                      style={{
                        width: '100%', padding: '13px 0',
                        background: '#0A2E1C', color: 'white', border: 'none', borderRadius: 14,
                        fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                    >
                      📄 Download Career Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}