import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'

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
    { label: 'Total Users', value: stats.totalUsers, to: '/admin/users' },
    { label: 'Total Requests', value: stats.totalRequests, to: '/admin/requests' },
    { label: 'Solved Requests', value: stats.solvedRequests, to: '/admin/requests' },
    { label: 'Open Requests', value: stats.openRequests, to: '/admin/requests' },
  ]

  return (
    <div>
      <PageHeader
        label="ADMIN PANEL"
        title="Platform overview."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {loading ? (
                <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
