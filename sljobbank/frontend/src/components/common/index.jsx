// ─────────────────────────────────────────────
//  Shared reusable UI primitives
// ─────────────────────────────────────────────

export function Badge({ type = 'gray', children, sm = false }) {
  const map = {
    success: 'bg-emerald-100 text-emerald-800',
    danger:  'bg-red-100 text-red-800',
    warn:    'bg-amber-100 text-amber-800',
    info:    'bg-blue-100 text-blue-800',
    gray:    'bg-gray-100 text-gray-700',
    purple:  'bg-purple-100 text-purple-800',
    teal:    'bg-teal-100 text-teal-800',
    paid:    'bg-emerald-100 text-emerald-800',
    free:    'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`badge ${map[type] || map.gray} ${sm ? 'text-[10px] px-1.5' : ''}`}>
      {children}
    </span>
  )
}

export function Avatar({ name, size = 34 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#0A2E1C', color:'#E8A200', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  )
}

export function StatCard({ label, value, icon, color, trend, onClick }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="flex justify-between items-start">
        <div>
          <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1.1 }}>{value}</div>
          <div className="text-[12px] text-gray-500 mt-1 font-semibold">{label}</div>
          {trend && <div className="text-[11px] text-emerald-600 mt-1 font-bold">{trend}</div>}
        </div>
        <div className="text-[28px] opacity-80">{icon}</div>
      </div>
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <span className="section-title mb-0">{children}</span>
      {action}
    </div>
  )
}

export function Divider() {
  return <div className="h-px bg-[#E2E8E4] my-3.5" />
}

export function Tag({ children }) {
  return <span className="tag">{children}</span>
}

export function ProgressBar({ pct, color = '#1A6B50' }) {
  return (
    <div className="bg-gray-200 rounded h-1.5 overflow-hidden">
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4, transition:'width .3s' }} />
    </div>
  )
}

export function Alert({ type = 'info', children }) {
  const map = {
    info:    'bg-blue-50 text-blue-800 border-blue-200',
    warn:    'bg-amber-50 text-amber-800 border-amber-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    danger:  'bg-red-50 text-red-800 border-red-200',
  }
  return (
    <div className={`rounded-[10px] p-3 px-4 text-[13px] mb-3.5 border ${map[type]}`}>
      {children}
    </div>
  )
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-[42px] mb-3">{icon}</div>
      <div className="text-[15px] font-bold text-gray-700 mb-1.5">{title}</div>
      <div className="text-[13px] text-gray-400 mb-4">{sub}</div>
      {action}
    </div>
  )
}

export function Modal({ title, children, onClose, width = 560 }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.25)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-extrabold text-gray-900">{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none text-[22px] cursor-pointer text-gray-400 leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#0A2E1C] rounded-full animate-spin" />
    </div>
  )
}

export function TableHeader({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col} className="table-header">{col}</th>
        ))}
      </tr>
    </thead>
  )
}
