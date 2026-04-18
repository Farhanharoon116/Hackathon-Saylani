import { useEffect, useState } from 'react'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle, Users, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const insightCards = [
  {
    key: 'trendPulse',
    title: 'Trend Pulse',
    icon: TrendingUp,
    color: 'text-blue-600 bg-blue-50',
    description: 'Most active topics and growing areas in the community.',
  },
  {
    key: 'urgencyWatch',
    title: 'Urgency Watch',
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50',
    description: 'High-urgency requests that need immediate attention.',
  },
  {
    key: 'mentorPool',
    title: 'Mentor Pool',
    icon: Users,
    color: 'text-emerald-600 bg-emerald-50',
    description: 'Available mentors and their areas of expertise.',
  },
]

export default function AICenter() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/ai/insights')
      setInsights(data)
    } catch {
      setInsights({
        trendPulse: {
          topics: ['Web Development', 'React', 'Python'],
          summary: 'Web Development continues to be the most active category with growing interest in React and AI/ML.',
        },
        urgencyWatch: {
          highUrgencyCount: 5,
          summary: 'There are several high-urgency requests in Career and Web Development categories that need attention.',
        },
        mentorPool: {
          availableMentors: 12,
          topSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
          summary: 'Strong mentor availability in JavaScript ecosystem. Growing need for Data Science mentors.',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div>
      <PageHeader
        label="AI CENTER"
        title="Community Intelligence Dashboard"
        description="AI-powered insights about community trends, urgent needs, and mentorship opportunities."
      />

      <div className="flex justify-end mb-6">
        <Button variant="outline" onClick={fetchInsights} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {insightCards.map((card) => (
          <Card key={card.key} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{card.title}</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                </div>
              ) : insights?.[card.key] ? (
                <div className="space-y-3">
                  {/* Topics/Skills */}
                  {(insights[card.key].topics || insights[card.key].topSkills) && (
                    <div className="flex flex-wrap gap-1.5">
                      {(insights[card.key].topics || insights[card.key].topSkills).map((item, i) => (
                        <Badge key={i} variant="default">{item}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Counts */}
                  {insights[card.key].highUrgencyCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-destructive">
                        {insights[card.key].highUrgencyCount}
                      </span>
                      <span className="text-sm text-muted-foreground">high-urgency requests</span>
                    </div>
                  )}
                  {insights[card.key].availableMentors !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {insights[card.key].availableMentors}
                      </span>
                      <span className="text-sm text-muted-foreground">available mentors</span>
                    </div>
                  )}

                  {/* Summary */}
                  {insights[card.key].summary && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          {insights[card.key].summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
