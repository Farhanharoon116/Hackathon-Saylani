import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    openRequests: 0,
    solvedRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get('/admin/stats')
        setStats(data.stats || data || stats)
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
      to: '/admin/users',
    },
    {
      label: 'Total Requests',
      value: stats.totalRequests,
      icon: FileText,
      color: 'text-purple-600 bg-purple-50',
      to: '/admin/requests',
    },
    {
      label: 'Open Requests',
      value: stats.openRequests,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50',
      to: '/admin/requests',
    },
    {
      label: 'Solved Requests',
      value: stats.solvedRequests,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
      to: '/admin/requests',
    },
  ]

  return (
    <div>
      <PageHeader
        label="ADMIN DASHBOARD"
        title="Platform Overview"
        description="Monitor and manage the HelpHub AI community."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="h-16 bg-muted rounded-lg animate-pulse" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/users">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-muted-foreground">View, ban, or unban users</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/requests">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Manage Requests</p>
                  <p className="text-sm text-muted-foreground">Review and moderate requests</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
