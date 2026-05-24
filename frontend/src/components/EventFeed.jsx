import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Info,
  Mail,
  MessageSquareText,
  ShieldAlert,
  Ticket,
} from 'lucide-react'

const STATUS_STYLES = {
  success: {
    item: 'border-l-green-400',
    badge: 'bg-green-50 text-green-700 border-green-100',
    icon: CheckCircle2,
  },
  warning: {
    item: 'border-l-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: AlertTriangle,
  },
  error: {
    item: 'border-l-red-400',
    badge: 'bg-red-50 text-red-700 border-red-100',
    icon: ShieldAlert,
  },
  info: {
    item: 'border-l-sky-400',
    badge: 'bg-sky-50 text-sky-700 border-sky-100',
    icon: Info,
  },
}

const SOURCE_STYLES = {
  email: { badge: 'bg-violet-50 text-violet-700 border-violet-100', icon: Mail },
  whatsapp: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: MessageSquareText },
  admin: { badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: Ticket },
  system: { badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock3 },
}

function formatDateTime(isoStr) {
  if (!isoStr) return 'Unknown time'
  return new Date(isoStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function payloadHint(event) {
  if (event.payload?.subject) return `Subject: ${event.payload.subject}`
  if (Array.isArray(event.payload?.missing_fields) && event.payload.missing_fields.length > 0) {
    return `Missing: ${event.payload.missing_fields.join(', ')}`
  }
  if (event.payload?.recipient) return `Recipient: ${event.payload.recipient}`
  return null
}

export default function EventFeed({ events = [], total = 0, loading = false, error = null }) {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sample inbox and operator events from the showcase dataset
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800 leading-none">{total}</p>
          <p className="text-xs text-slate-400 mt-1">tracked events</p>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-6 py-12 text-sm text-slate-400 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-400 rounded-full animate-spin" />
            Loading recent activity...
          </div>
        ) : events.length === 0 ? (
          <div className="px-6 py-12 text-sm text-slate-400 text-center">
            No events recorded yet.
          </div>
        ) : (
          events.map(event => {
            const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.info
            const sourceStyle = SOURCE_STYLES[event.source] || SOURCE_STYLES.system
            const StatusIcon = statusStyle.icon
            const SourceIcon = sourceStyle.icon
            const hint = payloadHint(event)

            return (
              <div
                key={event.id}
                className={`px-6 py-4 border-l-4 ${statusStyle.item}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-slate-300">
                    <StatusIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2 py-1 ${sourceStyle.badge}`}>
                        <SourceIcon size={11} />
                        {event.source}
                      </span>
                      <span className={`inline-flex items-center text-[11px] font-semibold border rounded-full px-2 py-1 ${statusStyle.badge}`}>
                        {event.status}
                      </span>
                      <span className="text-xs text-slate-400">{formatDateTime(event.created_at)}</span>
                    </div>

                    <p className="text-sm font-medium text-slate-800 break-words">
                      {event.summary}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {event.user_id && <span className="font-mono">{event.user_id}</span>}
                      {event.request_id && <span className="font-mono">req {event.request_id}</span>}
                      {event.ticket_id && (
                        <button
                          onClick={() => navigate(`/tickets/${event.ticket_id}`)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Ticket #{event.ticket_id}
                        </button>
                      )}
                    </div>

                    {hint && (
                      <p className="mt-2 text-xs text-slate-400 break-words">{hint}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
