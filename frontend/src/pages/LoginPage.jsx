import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_LOGIN_KEY } from '../api'
import { Lock, AlertCircle, ShieldOff } from 'lucide-react'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

export default function LoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const { login, isAuthenticated, authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!lockedUntil) return
    const tick = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockedUntil(null)
        setCountdown(0)
        setError('')
      } else {
        setCountdown(remaining)
      }
    }, 250)
    return () => clearInterval(tick)
  }, [lockedUntil])

  const isLocked = !!(lockedUntil && Date.now() < lockedUntil)

  async function handleSubmit(e) {
    e.preventDefault()
    if (isLocked) return
    const trimmed = key.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')

    try {
      await login(trimmed)
      navigate('/dashboard')
    } catch (err) {
      const newFailCount = failCount + 1
      if (newFailCount >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000
        setLockedUntil(until)
        setCountdown(LOCKOUT_SECONDS)
        setFailCount(0)
        setError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS}s.`)
      } else {
        setFailCount(newFailCount)
        const attemptsLeft = MAX_ATTEMPTS - newFailCount
        if (err.message === 'UNAUTHORIZED') {
          setError(
            `Invalid admin key. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
          )
        } else {
          setError('Could not load the showcase session. Refresh and try again.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-md shadow-indigo-200">
              <Lock size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">HandleHQ</h1>
            <p className="text-sm text-slate-500 mt-1">Showcase Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Demo Access Key
              </label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Enter the demo key"
                autoComplete="current-password"
                autoFocus
                disabled={isLocked}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-slate-400">
                Demo key: <span className="font-mono text-slate-600">{DEMO_LOGIN_KEY}</span>
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                {isLocked ? (
                  <ShieldOff size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
                ) : (
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
                )}
                <span className="text-red-600">
                  {isLocked
                    ? `Too many failed attempts. Try again in ${countdown}s.`
                    : error}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !key.trim() || isLocked}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Verifying...' : isLocked ? `Locked (${countdown}s)` : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          HandleHQ showcase | sample data only
        </p>
      </div>
    </div>
  )
}
