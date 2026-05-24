import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvents, getSummary, getTickets, resetDemoState } from '../api'
import Navbar from '../components/Navbar'
import EventFeed from '../components/EventFeed'
import StatCard from '../components/StatCard'
import TicketTable from '../components/TicketTable'
import { Inbox, Clock, CheckCircle, CalendarDays, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'

const PER_PAGE = 15
const EVENT_LIMIT = 12

export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [ticketsData, setTicketsData] = useState({
    tickets: [], total: 0, page: 1, per_page: PER_PAGE, total_pages: 1,
  })
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [ticketsError, setTicketsError] = useState(null)
  const [eventsData, setEventsData] = useState({
    events: [], total: 0, limit: EVENT_LIMIT, offset: 0,
  })
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState(null)
  const [resetting, setResetting] = useState(false)

  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('created_at')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true)
    try {
      const data = await getSummary()
      setSummary(data)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') { logout(); navigate('/login') }
    } finally {
      setSummaryLoading(false)
    }
  }, [logout, navigate])

  const loadTickets = useCallback(async () => {
    setTicketsLoading(true)
    setTicketsError(null)
    try {
      const data = await getTickets({
        status: filter || undefined, sort, order, page, per_page: PER_PAGE,
      })
      setTicketsData(data)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') { logout(); navigate('/login'); return }
      setTicketsError('Failed to load showcase tickets.')
    } finally {
      setTicketsLoading(false)
    }
  }, [logout, navigate, filter, sort, order, page])

  const loadEvents = useCallback(async () => {
    setEventsLoading(true)
    setEventsError(null)
    try {
      const data = await getEvents({ limit: EVENT_LIMIT })
      setEventsData(data)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') { logout(); navigate('/login'); return }
      setEventsError('Failed to load showcase activity.')
    } finally {
      setEventsLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => { loadSummary() }, [loadSummary])
  useEffect(() => { loadTickets() }, [loadTickets])
  useEffect(() => { loadEvents() }, [loadEvents])

  function handleFilterChange(value) { setFilter(value); setPage(1) }
  function handleSortChange(field, dir) { setSort(field); setOrder(dir); setPage(1) }
  function handleRefresh() { loadSummary(); loadTickets(); loadEvents() }

  async function handleResetDemo() {
    setResetting(true)
    setFilter('')
    setSort('created_at')
    setOrder('desc')
    setPage(1)

    try {
      await resetDemoState()
      await Promise.all([loadSummary(), loadTickets(), loadEvents()])
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Sample customer requests and activity for the public showcase</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
              Reset Demo
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              <RefreshCw size={14} className={ticketsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Open" value={summaryLoading ? null : summary?.open_tickets} accent="blue" icon={Inbox} subtitle="Awaiting review" />
          <StatCard title="In Progress" value={summaryLoading ? null : summary?.in_progress} accent="amber" icon={Clock} subtitle="Being handled" />
          <StatCard title="Closed" value={summaryLoading ? null : summary?.closed} accent="green" icon={CheckCircle} subtitle="Resolved" />
          <StatCard title="This Week" value={summaryLoading ? null : summary?.tickets_this_week} accent="indigo" icon={CalendarDays} subtitle={summary ? `${summary.total_tickets} total` : undefined} />
        </div>

        {ticketsError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="flex-shrink-0" />
            {ticketsError}
          </div>
        )}

        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          This dashboard is intentionally powered by local mock data so the public repo stays interactive without exposing production code, credentials, or integrations.
        </div>

        <TicketTable
          tickets={ticketsData.tickets}
          total={ticketsData.total}
          page={ticketsData.page || page}
          totalPages={ticketsData.total_pages}
          loading={ticketsLoading}
          activeFilter={filter}
          sort={sort}
          order={order}
          onPageChange={setPage}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        <div className="mt-8">
          <EventFeed
            events={eventsData.events}
            total={eventsData.total}
            loading={eventsLoading}
            error={eventsError}
          />
        </div>
      </main>
    </div>
  )
}
