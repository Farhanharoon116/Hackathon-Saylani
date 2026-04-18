import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, ExternalLink } from 'lucide-react'

function urgencyVariant(u) {
  if (u === 'High') return 'destructive'
  if (u === 'Medium') return 'warning'
  return 'default'
}

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/admin/requests')
      setRequests(data.requests || data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return
    try {
      await api.delete(`/admin/requests/${id}`)
      setRequests((prev) => prev.filter((r) => r._id !== id))
    } catch {
      // silently handle
    }
  }

  return (
    <div>
      <PageHeader
        label="ADMIN"
        title="Manage Requests"
        description="View, moderate, and delete community requests."
      />

      <Card>
        <CardHeader>
          <CardTitle>All Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Title</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Urgency</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Requester</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3">
                        <p className="text-sm font-medium truncate max-w-[200px]">{req.title}</p>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs">{req.category || 'General'}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={urgencyVariant(req.urgency)} className="text-xs">
                          {req.urgency || 'Low'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={req.status === 'Solved' ? 'success' : 'secondary'}
                          className="text-xs"
                        >
                          {req.status || 'Open'}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {req.requester?.name || 'Anonymous'}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/requests/${req._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(req._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
