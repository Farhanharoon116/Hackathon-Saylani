import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Search, SlidersHorizontal, MapPin, Users, ChevronRight } from 'lucide-react'

const categories = [
  'All categories',
  'Web Development',
  'Design',
  'Career',
  'Data Science',
  'Mobile',
  'DevOps',
  'Other',
]

const urgencyLevels = ['All urgency levels', 'Low', 'Medium', 'High']

function urgencyVariant(u) {
  if (u === 'High') return 'destructive'
  if (u === 'Medium') return 'warning'
  return 'default'
}

function statusVariant(s) {
  if (s === 'Solved') return 'success'
  return 'secondary'
}

export default function Explore() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: 'All categories',
    urgency: 'All urgency levels',
    skills: '',
    location: '',
  })

  useEffect(() => {
    fetchRequests()
  }, [])

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

  const handleFilter = () => {
    fetchRequests()
  }

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
        {/* Filters Sidebar */}
        <div className="lg:w-72 shrink-0">
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Refine the feed</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                  <Select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Urgency</label>
                  <Select
                    value={filters.urgency}
                    onChange={(e) => updateFilter('urgency', e.target.value)}
                  >
                    {urgencyLevels.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Skills</label>
                  <Input
                    placeholder="React, Figma, Git/GitHub"
                    value={filters.skills}
                    onChange={(e) => updateFilter('skills', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Location</label>
                  <Input
                    placeholder="Karachi, Lahore, Remote"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                  />
                </div>

                <Button onClick={handleFilter} className="w-full gap-2" size="sm">
                  <Search className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Cards */}
        <div className="flex-1 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="h-32 bg-muted rounded-lg animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No requests found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new request.
                </p>
                <Link to="/create-request">
                  <Button>Create a Request</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            requests.map((req) => (
              <Card key={req._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{req.category || 'General'}</Badge>
                        <Badge variant={urgencyVariant(req.urgency)}>
                          {req.urgency || 'Low'}
                        </Badge>
                        <Badge variant={statusVariant(req.status)}>
                          {req.status || 'Open'}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg mb-1">{req.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {req.description}
                      </p>

                      {/* Tags */}
                      {req.tags && req.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {req.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Requester info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar name={req.requester?.name || req.requesterName || 'User'} size="sm" />
                        <span className="font-medium text-foreground">
                          {req.requester?.name || req.requesterName || 'Anonymous'}
                        </span>
                        {(req.requester?.location || req.location) && (
                          <>
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{req.requester?.location || req.location}</span>
                          </>
                        )}
                        <Users className="h-3.5 w-3.5 ml-2" />
                        <span>{req.helpers?.length || 0} helpers</span>
                      </div>
                    </div>

                    <Link to={`/requests/${req._id}`} className="shrink-0">
                      <Button variant="outline" size="sm" className="gap-1">
                        Open details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
