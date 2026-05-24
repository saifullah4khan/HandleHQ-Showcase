import { X, CheckCircle2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

function ChatBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-[10px] font-bold text-indigo-600">
          AI
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

export default function ConversationModal({ messages = [], ticketCreated, turnCount, onClose }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-slate-800">Conversation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {turnCount != null ? `${turnCount} turns` : `${messages.length} messages`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {ticketCreated && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={12} />
                Ticket created
              </span>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-center text-slate-400 py-12">No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
