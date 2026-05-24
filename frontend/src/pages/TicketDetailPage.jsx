import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTicket, patchTicket, getSessionHistory } from '../api'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import ConversationModal from '../components/ConversationModal'
import {
  ArrowLeft, MessageSquare, Save, AlertCircle, CheckCircle2,
  User, Mail, Tag, FileText, DollarSign, Calendar, StickyNote,
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'actioned', label: 'Actioned' },
  { value: 'closed', label: 'Closed' },
]

function formatDateTime(isoStr) {
  if (!isoStr) return '-'
  return new Date(isoStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function DetailField({ icon: Icon, label, value, mono }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-slate-300 flex-shrink-0"><Icon size={15} /></div>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)
  const [showConversation, setShowConversation] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const tk = await getTicket(id)
        if (cancelled) return

        setTicket(tk)
        setStatus(tk.status)
        setNotes(tk.notes || '')

        try {
          const hist = await getSessionHistory(tk.user_id)
          if (!cancelled) setConversation(hist)
        } catch {
          // Session history is optional in the showcase.
        }
      } catch (err) {
        if (!cancelled && err.message === 'UNAUTHORIZED') {
          logout()
          navigate('/login')
          return
        }

        if (!cancelled) {
          setError(err.message === 'NOT_FOUND' ? 'Ticket not found.' : 'Failed to load ticket.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id, logout, navigate])

  async function handleSave() {
    setSaving(true)
    setSaveMsg(null)

    try {
      const updated = await patchTicket(id, { status, notes })
      setTicket(updated)
      setStatus(updated.status)
      setNotes(updated.notes || '')
      setSaveMsg({ type: 'success', text: 'Changes saved.' })
      setTimeout(() => setSaveMsg(null), 4000)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') { logout(); navigate('/login'); return }
      setSaveMsg({ type: 'error', text: 'Save failed. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-400 rounded-full animate-spin" />
          Loading ticket...
        </div>
      </div>
    </div>
  )

  if (error || !ticket) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} />{error || 'Ticket not found.'}
        </div>
      </div>
    </div>
  )

  const hasUnsavedChanges = status !== ticket.status || notes !== (ticket.notes || '')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={15} />Dashboard
          </button>
          <span className="text-slate-200">/</span>
          <span className="text-sm text-slate-600 font-medium">Ticket #{ticket.id}</span>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">Ticket Details</h2>
              <div className="space-y-4">
                <DetailField icon={User} label="Customer Name" value={ticket.name} />
                <DetailField icon={Mail} label="Contact" value={ticket.user_id} mono />
                <DetailField icon={Tag} label="Request Type" value={ticket.request_type} />
                <DetailField icon={FileText} label="Details" value={ticket.details} />
                <DetailField icon={DollarSign} label="Budget" value={ticket.budget} />
                <DetailField icon={Calendar} label="Timeline" value={ticket.timeline} />
                {ticket.notes && <DetailField icon={StickyNote} label="Admin Notes" value={ticket.notes} />}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
                <div><p className="text-xs text-slate-400 mb-0.5">Created</p><p className="text-xs text-slate-600">{formatDateTime(ticket.created_at)}</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">Last Updated</p><p className="text-xs text-slate-600">{formatDateTime(ticket.updated_at)}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">Update Ticket</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Add internal notes about this ticket..." rows={4}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y transition-all" />
                </div>
                {saveMsg && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl ${
                    saveMsg.type === 'success' ? 'text-green-700 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'
                  }`}>
                    {saveMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {saveMsg.text}
                  </div>
                )}
                <button onClick={handleSave} disabled={saving || !hasUnsavedChanges}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save size={14} />
                  {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col" style={{ minHeight: '520px' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversation</h2>
                {conversation && <p className="text-xs text-slate-400 mt-0.5">{conversation.turn_count} turns</p>}
              </div>
              {conversation && (
                <button onClick={() => setShowConversation(true)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-100 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-colors">
                  <MessageSquare size={13} />Expand
                </button>
              )}
            </div>

            {!conversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-2">
                <MessageSquare size={32} />
                <p className="text-sm">No conversation found for this ticket.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1">
                {conversation.ticket_created && (
                  <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-3">
                    <CheckCircle2 size={13} />Ticket was created from this conversation
                  </div>
                )}
                <div>
                  {(conversation.messages || []).map((msg, i) => (
                    <div key={i} className={`flex mb-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-[9px] font-bold text-indigo-500">AI</div>
                      )}
                      <div className={`max-w-[82%] px-3.5 py-2 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showConversation && conversation && (
        <ConversationModal
          messages={conversation.messages || []}
          ticketCreated={conversation.ticket_created}
          turnCount={conversation.turn_count}
          onClose={() => setShowConversation(false)}
        />
      )}
    </div>
  )
}
