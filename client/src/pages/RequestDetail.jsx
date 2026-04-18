import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/avatar'
import { CategoryTag, UrgencyTag, StatusTag, SkillTag } from '@/components/ui/badge'

export default function RequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [helping, setHelping] = useState(false)
  const [solving, setSolving] = useState(false)

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await api.get(`/requests/${id}`)
        setRequest(data.request || data)
      } catch {
        setRequest(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleOfferHelp = async () => {
    setHelping(true)
    try {
      const { data } = await api.post(`/requests/${id}/help`)
      setRequest(data.request || data)
    } catch {
      // silently handle
    } finally {
      setHelping(false)
    }
  }

  const handleMarkSolved = async () => {
    setSolving(true)
    try {
      const { data } = await api.patch(`/requests/${id}/solve`)
      setRequest(data.request || data)
    } catch {
      // silently handle
    } finally {
      setSolving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">Request not found.</p>
        <Link to="/explore" className="text-[#2A7A63] text-sm font-medium mt-2 inline-block">
          ← Back to Explore
        </Link>
      </div>
    )
  }

  const isRequester = user?._id === (request.requester?._id || request.requester)
  const isHelper = request.helpers?.some((h) => (h._id || h) === user?._id)

  const helperColors = ['bg-[#2A7A63]', 'bg-amber-500', 'bg-gray-500', 'bg-rose-500', 'bg-indigo-500']

  return (
    <div>
      {/* Enhanced PageHeader with tags */}
      <PageHeader label={`${request.category || 'REQUEST'}`} title={request.title}>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <CategoryTag>{request.category || 'General'}</CategoryTag>
          <UrgencyTag level={request.urgency} />
          <StatusTag status={request.status} />
        </div>
        <p className="text-gray-400 text-sm mt-2 line-clamp-1">{request.description}</p>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2A7A63] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">HelpHub AI</span>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">AI SUMMARY</p>
            <p className="text-sm text-gray-600 mt-2">
              {request.aiSummary || 'No AI summary available for this request.'}
            </p>
            {request.tags && request.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {request.tags.map((t, i) => <SkillTag key={i}>{t}</SkillTag>)}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-4">ACTIONS</p>
            <div className="flex gap-3">
              {!isRequester && !isHelper && request.status !== 'Solved' && (
                <button
                  onClick={handleOfferHelp}
                  disabled={helping}
                  className="bg-[#2A7A63] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {helping ? 'Offering...' : 'I can help'}
                </button>
              )}
              {isHelper && (
                <span className="bg-green-100 text-green-700 rounded-full px-5 py-2.5 text-sm font-medium">
                  ✓ You're helping
                </span>
              )}
              {isRequester && request.status !== 'Solved' && (
                <button
                  onClick={handleMarkSolved}
                  disabled={solving}
                  className="text-gray-700 font-medium text-sm cursor-pointer hover:text-gray-900 transition-colors"
                >
                  {solving ? 'Marking...' : 'Mark as solved'}
                </button>
              )}
              {request.status === 'Solved' && (
                <span className="bg-green-100 text-green-700 rounded-full px-5 py-2.5 text-sm font-medium">
                  ✓ Solved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Requester */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-4">REQUESTER</p>
            <div className="flex items-center gap-3">
              <Avatar name={request.requester?.name || 'User'} size="lg" />
              <div>
                <p className="text-lg font-semibold text-gray-900">{request.requester?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-400">{request.requester?.location || ''}</p>
              </div>
            </div>
          </div>

          {/* Helpers */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">HELPERS</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">People ready to support</h3>
            {request.helpers && request.helpers.length > 0 ? (
              <div className="space-y-4">
                {request.helpers.map((helper, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${helperColors[i % helperColors.length]}`}>
                      {(helper.name || 'H').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{helper.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400">{(helper.skills || []).slice(0, 3).join(', ')}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium shrink-0">
                      Trust {helper.trustScore || 0}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No helpers yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
