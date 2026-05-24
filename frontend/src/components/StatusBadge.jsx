const BADGE_STYLES = {
  new:      'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  reviewed: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  actioned: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  closed:   'bg-green-50 text-green-700 ring-1 ring-green-200',
}

const LABELS = {
  new:      'New',
  reviewed: 'Reviewed',
  actioned: 'Actioned',
  closed:   'Closed',
}

/**
 * StatusBadge — pill showing ticket status with colour coding.
 * Props: status — one of new | reviewed | actioned | closed
 */
export default function StatusBadge({ status }) {
  const style = BADGE_STYLES[status] || 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
  const label = LABELS[status] || status

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  )
}
