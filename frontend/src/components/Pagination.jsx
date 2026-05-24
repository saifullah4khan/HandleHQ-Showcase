import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination — prev/next controls + page counter.
 * Renders nothing if totalPages ≤ 1.
 */
export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Page{' '}
        <span className="font-medium text-slate-700">{page}</span>
        {' '}of{' '}
        <span className="font-medium text-slate-700">{totalPages}</span>
        {total != null && (
          <span className="text-slate-400 ml-1">({total} total)</span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <ChevronLeft size={15} />
          Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
