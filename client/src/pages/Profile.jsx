import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'

export default function Profile() {
  const { id } = useParams()
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
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
      const { data } = await api.put('/users/profile', payload)
      const updated = data.user || payload
      updateUser(updated)
      setProfile((prev) => ({ ...prev, ...updated }))
    } catch {
      // silently handle
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">User not found.</p>
        <Link to="/explore" className="text-[#2A7A63] text-sm font-medium mt-2 inline-block">
          Back to Explore
        </Link>
      </div>
    )
  }

  const roleLabel = profile.role === 'need_help' ? 'Need Help' : profile.role === 'can_help' ? 'Can Help' : 'Both'

  return (
    <div>
      <PageHeader
        label="PROFILE"
        title={profile.name || 'User'}
        description={`${roleLabel} • ${profile.location || 'No location'}`}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Public profile */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">PUBLIC PROFILE</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills and reputation</h2>

          <div className="divide-y divide-gray-100">
            <div className="py-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Trust score</span>
              <span className="font-semibold text-gray-900">{profile.trustScore || 0}%</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Contributions</span>
              <span className="font-semibold text-gray-900">{profile.contributions || 0}</span>
            </div>
            <div className="py-4">
              <span className="text-sm text-gray-500 block mb-2">Skills</span>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).length > 0 ? (
                  profile.skills.map((s, i) => (
                    <span key={i} className="border border-[#2A7A63] text-[#2A7A63] rounded-full px-3 py-1 text-sm">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills added</span>
                )}
              </div>
            </div>
            <div className="py-4">
              <span className="text-sm text-gray-500 block mb-2">Badges</span>
              <div className="flex flex-wrap gap-2">
                {(profile.badges || []).length > 0 ? (
                  profile.badges.map((b, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No badges earned</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Edit profile (only for own profile) */}
        {isOwnProfile ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">EDIT PROFILE</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update your identity</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Location</label>
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Skills</label>
                <Input
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="Comma-separated skills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Interests</label>
                <Input
                  value={editForm.interests}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                  placeholder="Comma-separated interests"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#2A7A63] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Avatar name={profile.name} size="xl" className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{profile.location}</p>
            <p className="text-sm text-gray-400">{roleLabel}</p>
          </div>
        )}
      </div>
    </div>
  )
}
