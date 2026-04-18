import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  MapPin,
  Star,
  Award,
  Edit3,
  Save,
  MessageSquare,
  Mail,
  Shield,
} from 'lucide-react'

export default function Profile() {
  const { id } = useParams()
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    skills: '',
    interests: '',
  })

  const isOwnProfile = !id || id === user?._id

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (isOwnProfile) {
          setProfile(user)
          setEditForm({
            name: user?.name || '',
            location: user?.location || '',
            skills: (user?.skills || []).join(', '),
            interests: (user?.interests || []).join(', '),
          })
        } else {
          const { data } = await api.get(`/users/${id}`)
          setProfile(data.user || data)
        }
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id, user, isOwnProfile])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        name: editForm.name,
        location: editForm.location,
        skills: editForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: editForm.interests.split(',').map((s) => s.trim()).filter(Boolean),
      }
      const { data } = await api.put('/auth/profile', payload)
      const updated = data.user || payload
      updateUser(updated)
      setProfile((prev) => ({ ...prev, ...updated }))
      setEditing(false)
    } catch {
      // silently handle
    } finally {
      setSaving(false)
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

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">User not found</h2>
        <Link to="/explore">
          <Button variant="outline">Back to Explore</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        label="PROFILE"
        title={isOwnProfile ? 'Your Profile' : profile.name}
        description={isOwnProfile ? 'Manage your account and preferences.' : `View ${profile.name}'s profile`}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <Avatar name={profile.name} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
              <Mail className="h-3.5 w-3.5" />
              {profile.email}
            </div>
            {profile.location && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center justify-center gap-1 mt-2">
              <Badge variant={
                profile.role === 'admin' ? 'destructive' :
                profile.role === 'can_help' ? 'default' :
                profile.role === 'both' ? 'success' : 'secondary'
              }>
                {profile.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                {profile.role === 'need_help' ? 'Needs Help' :
                 profile.role === 'can_help' ? 'Helper' :
                 profile.role === 'both' ? 'Helper & Seeker' :
                 profile.role === 'admin' ? 'Admin' : profile.role}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-lg font-bold">{profile.trustScore || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Trust Score</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold">{profile.contributions || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Contributions</p>
              </div>
            </div>

            {/* Actions */}
            {!isOwnProfile && (
              <div className="mt-4 space-y-2">
                <Link to="/messages" className="block">
                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills & Interests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills & Interests</CardTitle>
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="gap-1"
                >
                  <Edit3 className="h-4 w-4" />
                  {editing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Location</label>
                    <Input
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Skills (comma-separated)</label>
                    <Input
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Interests (comma-separated)</label>
                    <Input
                      value={editForm.interests}
                      onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.skills || []).length > 0 ? (
                        profile.skills.map((skill, i) => (
                          <Badge key={i} variant="default">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills added yet</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.interests || []).length > 0 ? (
                        profile.interests.map((interest, i) => (
                          <Badge key={i} variant="outline">{interest}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No interests added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              {(profile.badges || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2"
                    >
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No badges earned yet. Start helping others to earn badges!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
