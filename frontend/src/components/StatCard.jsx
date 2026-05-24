const ACCENT_CLASSES = {
  indigo: 'border-t-indigo-500 text-indigo-600',
  blue: 'border-t-blue-500 text-blue-600',
  green: 'border-t-green-500 text-green-600',
  amber: 'border-t-amber-500 text-amber-600',
  red: 'border-t-red-500 text-red-600',
}

export default function StatCard({ title, value, accent = 'indigo', subtitle, icon: Icon }) {
  const classes = ACCENT_CLASSES[accent] || ACCENT_CLASSES.indigo

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-t-4 ${classes.split(' ')[0]} p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800 leading-none">
            {value ?? <span className="text-slate-300">-</span>}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`${classes.split(' ')[1]} opacity-30`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </div>
  )
}
