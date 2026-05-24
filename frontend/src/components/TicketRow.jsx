import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { ExternalLink } from 'lucide-react'

function shortDate(isoStr) {
  if (!isoStr) return '-'
  return new Date(isoStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TicketRow({ ticket }) {
  const navigate = useNavigate()

  return (
    <tr
      className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
        #{ticket.id}
      </td>

      <td className="px-4 py-3">
        <div className="text-sm font-medium text-slate-800">
          {ticket.name || <span className="text-slate-400 font-normal italic">No name</span>}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">
          {ticket.user_id}
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
        {ticket.request_type || <span className="text-slate-300">-</span>}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={ticket.status} />
      </td>

      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
        {shortDate(ticket.created_at)}
      </td>

      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
        {shortDate(ticket.updated_at)}
      </td>

      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-xs text-indigo-500 font-medium hover:text-indigo-700 whitespace-nowrap">
          <ExternalLink size={13} />
          View
        </span>
      </td>
    </tr>
  )
}
