import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import TicketRow from './TicketRow'
import Pagination from './Pagination'

const STATUS_TABS = [
  { label: 'All',        value: '' },
  { label: 'New',        value: 'new' },
  { label: 'Reviewed',   value: 'reviewed' },
  { label: 'Actioned',   value: 'actioned' },
  { label: 'Closed',     value: 'closed' },
]

function SortIcon({ field, sort, order }) {
  if (sort !== field) return <ChevronsUpDown size={13} className="inline ml-1 text-slate-300" />
  return order === 'asc'
    ? <ChevronUp size={13} className="inline ml-1 text-indigo-500" />
    : <ChevronDown size={13} className="inline ml-1 text-indigo-500" />
}

/**
 * TicketTable — full tickets panel: filter tabs, sortable columns, rows, pagination.
 */
export default function TicketTable({
  tickets = [],
  total,
  page,
  totalPages,
  loading,
  activeFilter,
  sort,
  order,
  onPageChange,
  onFilterChange,
  onSortChange,
}) {
  function handleSortClick(field) {
    if (sort === field) {
      onSortChange(field, order === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(field, 'desc')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Status filter tabs */}
      <div className="border-b border-slate-100 px-2 flex gap-0 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeFilter === tab.value
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">ID</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
                onClick={() => handleSortClick('created_at')}
              >
                Created
                <SortIcon field="created_at" sort={sort} order={order} />
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
                onClick={() => handleSortClick('updated_at')}
              >
                Updated
                <SortIcon field="updated_at" sort={sort} order={order} />
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-3.5 bg-slate-100 rounded animate-pulse" style={{ width: j === 1 ? '120px' : '60px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    </div>
  )
}
