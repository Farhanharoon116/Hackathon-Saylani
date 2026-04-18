import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { CategoryTag, UrgencyTag, StatusTag, SkillTag } from '@/components/ui/badge'

const categories = ['All categories', 'Web Development', 'Design', 'Career', 'Data Science', 'Mobile', 'DevOps', 'Other']
const urgencyLevels = ['All urgency levels', 'Low', 'Medium', 'High']

export default function Explore() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: 'All categories',
    urgency: 'All urgency levels',
    skills: '',
    location: '',
  })

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.category !== 'All categories') params.category = filters.category
      if (filters.urgency !== 'All urgency levels') params.urgency = filters.urgency
      if (filters.skills) params.skills = filters.skills
      if (filters.location) params.location = filters.location
      const { data } = await api.get('/requests', { params })
      setRequests(data.requests || data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [filters.category, filters.urgency])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <PageHeader
        label="EXPLORE / FEED"
        title="Browse help requests with filterable community context."
        description="Filter by category, urgency, skills, and location to surface the best matches."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">FILTERS</p>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Refine the feed</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Category</label>
                <Select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Urgency</label>
                <Select
                  value={filters.urgency}
                  onChange={(e) => updateFilter('urgency', e.target.value)}
                >
                  {urgencyLevels.map((u) => <option key={u} value={u}>{u}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Skills</label>
                <Input
                  placeholder="React, Figma, Git/GitHub"
                  value={filters.skills}
                  onChange={(e) => updateFilter('skills', e.target.value)}
                  onBlur={fetchRequests}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Location</label>
                <Input
                  placeholder="Karachi, Lahore, Remote"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  onBlur={fetchRequests}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right feed */}
        <div className="flex-1 flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <p className="text-gray-400 text-sm">Nothing here yet.</p>
              <Link to="/create-request" className="text-[#2A7A63] text-sm font-medium mt-2 inline-block">
                Create a Request
              </Link>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryTag>{req.category || 'General'}</CategoryTag>
                  <UrgencyTag level={req.urgency} />
                  <StatusTag status={req.status} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{req.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                {req.tags && req.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {req.tags.map((t, i) => <SkillTag key={i}>{t}</SkillTag>)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar name={req.requester?.name || 'User'} size="xs" />
                    <span className="text-sm font-medium text-gray-900">{req.requester?.name || 'Anonymous'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{req.requester?.location || ''}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{req.helpers?.length || 0} helpers</span>
                    <Link to={`/requests/${req._id}`} className="text-[#2A7A63] text-sm font-medium">
                      Open details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
