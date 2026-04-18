import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { CategoryTag, UrgencyTag } from '@/components/ui/badge'

export default function AICenter() {
  const [insights, setInsights] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [aiRes, reqRes] = await Promise.all([
          api.get('/ai/insights').catch(() => ({ data: null })),
          api.get('/requests').catch(() => ({ data: { requests: [] } })),
        ])
        setInsights(aiRes.data)
        const allReqs = reqRes.data.requests || reqRes.data || []
        setRequests(allReqs.filter(r => r.status === 'Open').slice(0, 10))
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <PageHeader
        label="AI CENTER"
        title="See what the platform intelligence is noticing."
        description="AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations."
      />

      {/* ROW 1 — Three stat cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">TREND PULSE</p>
          <p className="text-2xl font-bold text-gray-900">
            {insights?.trendPulse?.topics?.[0] || 'Web Development'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Most common support area based on active community requests.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">URGENCY WATCH</p>
          <p className="text-4xl font-black text-gray-900">
            {insights?.urgencyWatch?.highUrgencyCount || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Requests currently flagged high priority by the urgency detector.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">MENTOR POOL</p>
          <p className="text-4xl font-black text-gray-900">
            {insights?.mentorPool?.availableMentors || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Trusted helpers with strong response history and contribution signals.
          </p>
        </div>
      </div>

      {/* ROW 2 — Recommendations */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">AI RECOMMENDATIONS</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Requests needing attention</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Nothing here yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map((req) => (
              <div key={req._id} className="py-5">
                <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                {req.aiSummary && (
                  <p className="text-sm text-gray-500 mt-1">{req.aiSummary}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <CategoryTag>{req.category || 'General'}</CategoryTag>
                  <UrgencyTag level={req.urgency} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
