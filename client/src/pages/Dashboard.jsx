import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { CategoryTag, UrgencyTag, StatusTag } from '@/components/ui/badge'

export default function Dashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [reqRes, aiRes] = await Promise.all([
          api.get('/requests').catch(() => ({ data: { requests: [] } })),
          api.get('/ai/insights').catch(() => ({ data: null })),
        ])
        const allReqs = reqRes.data.requests || reqRes.data || []
        // Show user's own requests
        const myReqs = allReqs.filter(r => (r.requester?._id || r.requester) === user?._id)
        setRequests(myReqs.slice(0, 5))
        setInsights(aiRes.data)
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const myRequestCount = requests.length
  const helpedCount = user?.contributions || 0
  const trustScore = user?.trustScore || 0
  const badgeCount = user?.badges?.length || 0

  return (
    <div>
      <PageHeader
        label="DASHBOARD"
        title={`Welcome back, ${user?.name || 'User'}.`}
        description="Here's what's happening in your network."
      />

      {/* ROW 1 — Four stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{myRequestCount}</p>
          <p className="text-xs text-gray-400 mt-1">requests posted</p>
          <p className="text-sm font-semibold text-gray-700 mt-2">My Requests</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{helpedCount}</p>
          <p className="text-xs text-gray-400 mt-1">people helped</p>
          <p className="text-sm font-semibold text-gray-700 mt-2">Helped Others</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{trustScore}%</p>
          <p className="text-xs text-gray-400 mt-1">community trust</p>
          <p className="text-sm font-semibold text-gray-700 mt-2">Trust Score</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{badgeCount}</p>
          <p className="text-xs text-gray-400 mt-1">achievements</p>
          <p className="text-sm font-semibold text-gray-700 mt-2">Badges</p>
          {user?.badges && user.badges.length > 0 && (
            <div className="flex gap-1 mt-2">
              {user.badges.slice(0, 2).map((b, i) => (
                <span key={i} className="bg-[#2A7A63]/10 text-[#2A7A63] rounded-full px-2 py-0.5 text-xs">{b}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ROW 2 — Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">RECENT ACTIVITY</p>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your latest requests</h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No requests yet</p>
              <Link to="/create-request" className="text-[#2A7A63] text-sm font-medium mt-2 inline-block">
                Create your first request →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => (
                <div key={req._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex gap-1.5 shrink-0">
                      <CategoryTag>{req.category || 'General'}</CategoryTag>
                      <UrgencyTag level={req.urgency} />
                    </div>
                    <span className="font-medium text-sm text-gray-900 truncate">{req.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <StatusTag status={req.status} />
                    <Link to={`/requests/${req._id}`} className="text-[#2A7A63] text-sm font-medium">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-2">
            <Link to="/explore" className="text-[#2A7A63] text-sm font-medium">
              View all requests →
            </Link>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">AI CENTER</p>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Platform intelligence</h3>

          <div className="divide-y divide-gray-100">
            <div className="py-4">
              <p className="text-xs text-gray-400">Trend Pulse</p>
              <p className="font-bold text-gray-900">{insights?.trendPulse?.topics?.[0] || 'Web Development'}</p>
              <p className="text-xs text-gray-400 mt-1">Most common support area</p>
            </div>
            <div className="py-4">
              <p className="text-xs text-gray-400">Urgency Watch</p>
              <p className="font-bold text-gray-900">{insights?.urgencyWatch?.highUrgencyCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">High priority requests</p>
            </div>
            <div className="py-4">
              <p className="text-xs text-gray-400">Mentor Pool</p>
              <p className="font-bold text-gray-900">{insights?.mentorPool?.availableMentors || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Trusted helpers available</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/ai-center" className="text-[#2A7A63] text-sm font-medium">
              Open AI Center →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          to="/create-request"
          className="bg-[#1E2D2A] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-[#1E2D2A]/90 transition-colors"
        >
          Create a Request
        </Link>
        <Link
          to="/explore"
          className="border border-gray-300 text-gray-900 rounded-full px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Explore Feed
        </Link>
      </div>
    </div>
  )
}
