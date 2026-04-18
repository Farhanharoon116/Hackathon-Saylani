import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { ShieldBan, ShieldCheck, ExternalLink } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data.users || data || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const toggleBan = async (userId, isBanned) => {
    try {
      await api.patch(`/admin/users/${userId}/ban`)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: isBanned ? 'both' : 'banned' } : u
        )
      )
    } catch {
      // silently handle
    }
  }

  return (
    <div>
      <PageHeader
        label="ADMIN"
        title="Manage Users"
        description="View and manage community members."
      />

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Email</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground text-center">Trust Score</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground text-center">Contributions</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={u.name} size="sm" />
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="py-3">
                        <Badge
                          variant={u.isAdmin ? 'destructive' : u.role === 'can_help' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {u.isAdmin ? 'admin' : u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-center text-sm font-medium">{u.trustScore || 0}</td>
                      <td className="py-3 text-center text-sm">{u.contributions || 0}</td>
                      <td className="py-3">
                        {u.role === 'banned' ? (
                          <Badge variant="destructive" className="text-xs">Banned</Badge>
                        ) : (
                          <Badge variant="success" className="text-xs">Active</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/profile/${u._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {!u.isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${u.role === 'banned' ? 'text-primary hover:text-primary' : 'text-destructive hover:text-destructive'}`}
                              onClick={() => toggleBan(u._id, u.role === 'banned')}
                            >
                              {u.role === 'banned' ? (
                                <ShieldCheck className="h-3.5 w-3.5" />
                              ) : (
                                <ShieldBan className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          )}
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
