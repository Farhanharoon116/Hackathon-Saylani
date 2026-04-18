import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Auth() {
  const { user, loading, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'both' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={user.onboarded ? '/dashboard' : '/onboarding'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password)
        navigate(data.user?.onboarded ? '/dashboard' : '/onboarding')
      } else {
        const data = await register(form.name, form.email, form.password, form.role)
        navigate(data.user?.onboarded ? '/dashboard' : '/onboarding')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen flex">
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#1E2D2A] rounded-3xl m-4 p-12 flex-col justify-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">COMMUNITY ACCESS</p>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Enter the support network.
        </h1>
        <p className="text-gray-400 mt-4 text-sm max-w-md">
          HelpHub AI connects students, mentors, and builders through AI-powered matching, trust systems, and real-time community intelligence.
        </p>
        <div className="mt-8 space-y-4">
          {[
            'Role-based entry for Need Help, Can Help, or Both',
            'Direct path into dashboard, requests, AI Center, and community feed',
            'Persistent session powered by JWT + MongoDB',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2A7A63] mt-1.5 shrink-0" />
              <p className="text-gray-300 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <p className="text-xs uppercase tracking-widest text-[#2A7A63] font-semibold mb-2">LOGIN / SIGNUP</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Authenticate your community profile
          </h2>

          {/* Toggle tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#1E2D2A] text-white'
                  : 'border border-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#1E2D2A] text-white'
                  : 'border border-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
                <input
                  className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A7A63]/20 focus:border-[#2A7A63]"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
              <input
                type="email"
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A7A63]/20 focus:border-[#2A7A63]"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
              <input
                type="password"
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A7A63]/20 focus:border-[#2A7A63]"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Role</label>
                <select
                  className="flex h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A7A63]/20 focus:border-[#2A7A63]"
                  value={form.role}
                  onChange={(e) => updateForm('role', e.target.value)}
                >
                  <option value="need_help">Need Help</option>
                  <option value="can_help">Can Help</option>
                  <option value="both">Both</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2A7A63] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Please wait...' : 'Continue to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
