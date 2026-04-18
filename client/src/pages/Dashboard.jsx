import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  HandHelping,
  Star,
  Award,
  Plus,
  Compass,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState({ myRequests: 0, helping: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [reqRes] = await Promise.all([
          api.get('/requests/my').catch(() => ({ data: { requests: [] } })),
        ])
        const myReqs = reqRes.data.requests || reqRes.data || []
        setRequests(myReqs.slice(0, 5))
        setStats({
          myRequests: myReqs.length,
          helping: user?.contributions || 0,
        })
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const statCards = [
    { label: 'My Requests', value: stats.myRequests, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Helping Others', value: stats.helping, icon: HandHelping, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Trust Score', value: user?.trustScore || 0, icon: Star, color: 'text-amber-600 bg-amber-50' },
    { label: 'Contributions', value: user?.contributions || 0, icon: Award, color: 'text-purple-600 bg-purple-50' },
  ]

  const quickActions = [
    { to: '/create-request', label: 'Create New Request', icon: Plus, variant: 'default' },
    { to: '/explore', label: 'Explore Requests', icon: Compass, variant: 'outline' },
    { to: '/messages', label: 'View Messages', icon: MessageSquare, variant: 'outline' },
  ]

  return (
    <div>
      <PageHeader
        label="DASHBOARD"
        title={`Welcome back, ${user?.name || 'User'}`}
        description="Here's an overview of your activity and quick actions to get started."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Requests</CardTitle>
              <Link to="/explore">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No requests yet</p>
                  <Link to="/create-request">
                    <Button size="sm" className="mt-3">Create your first request</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <Link
                      key={req._id}
                      to={`/requests/${req._id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={req.urgency === 'High' ? 'destructive' : req.urgency === 'Medium' ? 'warning' : 'default'}>
                            {req.urgency || 'Low'}
                          </Badge>
                          <Badge variant="secondary">{req.category || 'General'}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to} className="block">
                <Button variant={action.variant} className="w-full justify-start gap-2">
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
