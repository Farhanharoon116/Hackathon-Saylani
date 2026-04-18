import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Trophy, Medal, Crown, Star, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const rankIcons = {
  1: { icon: Crown, color: 'text-amber-500' },
  2: { icon: Medal, color: 'text-gray-400' },
  3: { icon: Medal, color: 'text-amber-700' },
}

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data } = await api.get('/users/leaderboard')
        setUsers(data.users || data || [])
      } catch {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div>
      <PageHeader
        label="LEADERBOARD"
        title="Top community contributors"
        description="Recognize and celebrate the people who make this community great."
      />

      {/* Top 3 podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((idx) => {
            const u = users[idx]
            if (!u) return null
            const rank = idx + 1
            const isFirst = idx === 0
            return (
              <Card
                key={u._id || idx}
                className={cn(
                  'text-center',
                  isFirst && 'border-amber-300 bg-amber-50/50 lg:-mt-4'
                )}
              >
                <CardContent className="pt-6">
                  <div className="relative inline-block mb-3">
                    <Avatar name={u.name} size={isFirst ? 'xl' : 'lg'} />
                    <div className={cn(
                      'absolute -top-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold',
                      rank === 1 ? 'bg-amber-400 text-white' :
                      rank === 2 ? 'bg-gray-300 text-gray-700' :
                      'bg-amber-700 text-white'
                    )}>
                      {rank}
                    </div>
                  </div>
                  <h3 className="font-semibold">{u.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-lg">{u.trustScore || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {u.contributions || 0} contributions
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No leaderboard data yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-semibold text-muted-foreground w-16">Rank</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground text-center">Trust Score</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground text-center">Contributions</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Badges</th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((u, i) => {
                    const rank = i + 1
                    const RankInfo = rankIcons[rank]
                    return (
                      <tr
                        key={u._id || i}
                        className={cn(
                          'border-b border-border/50 hover:bg-muted/50 transition-colors',
                          rank <= 3 && 'bg-muted/30'
                        )}
                      >
                        <td className="py-3">
                          {RankInfo ? (
                            <RankInfo.icon className={cn('h-5 w-5', RankInfo.color)} />
                          ) : (
                            <span className="text-sm font-medium text-muted-foreground pl-1">
                              #{rank}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <Link
                            to={`/profile/${u._id}`}
                            className="flex items-center gap-2 hover:underline"
                          >
                            <Avatar name={u.name} size="sm" />
                            <span className="font-medium text-sm">{u.name}</span>
                          </Link>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-bold">{u.trustScore || 0}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-sm">{u.contributions || 0}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {(u.badges || []).slice(0, 3).map((badge, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                            {!u.badges?.length && (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1 flex-wrap">
                            {(u.skills || []).slice(0, 3).map((skill, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {!u.skills?.length && (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
