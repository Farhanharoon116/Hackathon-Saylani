import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'

const avatarColors = ['bg-[#2A7A63]', 'bg-amber-500', 'bg-gray-500', 'bg-rose-500', 'bg-indigo-500']

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data } = await api.get('/users/leaderboard')
        setUsers(data.users || data || [])
      } catch {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div>
      <PageHeader
        label="LEADERBOARD"
        title="Recognize the people who keep the community moving."
        description="Trust score, contribution count, and badges create visible momentum for reliable helpers."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Rankings */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">TOP HELPERS</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rankings</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Nothing here yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.slice(0, 10).map((u, i) => (
                <div key={u._id || i} className="py-5 flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-400 w-8">#{i + 1}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColors[i % avatarColors.length]}`}>
                    {(u.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${u._id}`} className="text-sm font-semibold text-gray-900 hover:underline">
                      {u.name}
                    </Link>
                    <p className="text-xs text-gray-400">{(u.skills || []).slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-gray-900">{u.trustScore || 0}%</p>
                    <p className="text-xs text-gray-400">{u.contributions || 0} contributions</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Badge system */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">BADGE SYSTEM</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trust and achievement</h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Nothing here yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {users.slice(0, 10).map((u, i) => {
                const trustPct = Math.min((u.trustScore || 0), 100)
                const contribPct = Math.min(((u.contributions || 0) / 30) * 100, 100)
                return (
                  <div key={u._id || i}>
                    {/* Trust progress bar */}
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#2A7A63]"
                        style={{ width: `${trustPct}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">{u.name}</p>
                    <p className="text-xs text-gray-400">
                      {(u.badges || []).length > 0 ? u.badges.join(' • ') : 'No badges yet'}
                    </p>
                    {/* Contributions progress bar */}
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${contribPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
