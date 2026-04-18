import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  CheckCircle2,
  HandHelping,
  MapPin,
  Calendar,
  Tag,
  Sparkles,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react'

function urgencyVariant(u) {
  if (u === 'High') return 'destructive'
  if (u === 'Medium') return 'warning'
  return 'default'
}

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
      <div>
        <div className="h-32 bg-muted rounded-2xl animate-pulse mb-8" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Request not found</h2>
        <p className="text-muted-foreground mb-4">This request may have been deleted.</p>
        <Link to="/explore">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Button>
        </Link>
      </div>
    )
  }

  const isRequester = user?._id === (request.requester?._id || request.requester)
  const isHelper = request.helpers?.some(
    (h) => (h._id || h) === user?._id
  )

  return (
    <div>
      <PageHeader
        label={`${request.category || 'REQUEST'} / ${request.status || 'Open'}`}
        title={request.title}
        description={`Posted by ${request.requester?.name || 'Anonymous'}`}
      />

      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{request.category || 'General'}</Badge>
                <Badge variant={urgencyVariant(request.urgency)}>
                  {request.urgency || 'Low'} Urgency
                </Badge>
                <Badge variant={request.status === 'Solved' ? 'success' : 'secondary'}>
                  {request.status || 'Open'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {request.tags && request.tags.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-1">
                    <Tag className="h-4 w-4" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {request.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {request.aiSummary && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" /> AI Summary
                  </h3>
                  <p className="text-sm text-muted-foreground">{request.aiSummary}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {!isRequester && !isHelper && request.status !== 'Solved' && (
                  <Button onClick={handleOfferHelp} disabled={helping} className="gap-2">
                    <HandHelping className="h-4 w-4" />
                    {helping ? 'Offering...' : 'Offer to Help'}
                  </Button>
                )}
                {isHelper && (
                  <Badge variant="success" className="py-2 px-4">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> You're helping
                  </Badge>
                )}
                {isRequester && request.status !== 'Solved' && (
                  <Button onClick={handleMarkSolved} disabled={solving} variant="outline" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {solving ? 'Marking...' : 'Mark as Solved'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requester */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={request.requester?.name || 'User'} />
                <div>
                  <p className="font-medium">{request.requester?.name || 'Anonymous'}</p>
                  {request.requester?.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {request.requester.location}
                    </p>
                  )}
                </div>
              </div>
              {request.requester?._id && !isRequester && (
                <div className="flex gap-2">
                  <Link to={`/profile/${request.requester._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                  </Link>
                  <Link to="/messages" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Helpers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Helpers ({request.helpers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.helpers && request.helpers.length > 0 ? (
                <div className="space-y-3">
                  {request.helpers.map((helper, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Avatar name={helper.name || 'Helper'} size="sm" />
                      <span className="text-sm font-medium">
                        {helper.name || 'Anonymous Helper'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No helpers yet. Be the first!</p>
              )}
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'recently'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
