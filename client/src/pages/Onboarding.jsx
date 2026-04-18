import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, CheckCircle2, MapPin } from 'lucide-react'

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    skills: '',
    interests: '',
    location: '',
  })
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleAISuggestions = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/ai/onboarding', {
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
      })
      setSuggestions(data)
    } catch {
      setSuggestions({
        canHelpWith: ['Based on your skills, try mentoring beginners'],
        mayNeedHelpIn: ['Explore new areas to grow your expertise'],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      const payload = {
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        location: form.location,
        isOnboarded: true,
      }
      const { data } = await api.put('/auth/profile', payload)
      updateUser(data.user || { ...payload })
      navigate('/dashboard')
    } catch {
      updateUser({ isOnboarded: true })
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        label="ONBOARDING"
        title={`Welcome, ${user?.name || 'there'}! Let's set up your profile.`}
        description="Tell us about your skills and interests so we can match you with the right people."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Skills (comma-separated)
              </label>
              <Input
                placeholder="React, Python, UI Design, Data Analysis"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Interests (comma-separated)
              </label>
              <Input
                placeholder="Machine Learning, Web Development, Open Source"
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Karachi, Pakistan"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleAISuggestions}
                disabled={loading || (!form.skills && !form.interests)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Analyzing...' : 'Get AI Suggestions'}
              </Button>
              <Button onClick={handleComplete} disabled={saving} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {saving ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {suggestions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-primary">
                  You can help with:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(suggestions.canHelpWith || []).map((item, i) => (
                    <Badge key={i} variant="default">{item}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-warning">
                  You may need help in:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(suggestions.mayNeedHelpIn || []).map((item, i) => (
                    <Badge key={i} variant="warning">{item}</Badge>
                  ))}
                </div>
              </div>
              {suggestions.summary && (
                <p className="text-sm text-muted-foreground italic">
                  {suggestions.summary}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
