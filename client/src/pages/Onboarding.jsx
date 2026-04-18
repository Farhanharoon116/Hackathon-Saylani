import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    location: '',
    skills: '',
    interests: '',
  })
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        location: form.location,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        onboarded: true,
      }
      const { data } = await api.put('/users/profile', payload)
      updateUser(data.user || { ...payload })

      // Get AI suggestions
      try {
        setLoading(true)
        const aiRes = await api.post('/ai/onboarding', {
          skills: payload.skills,
          interests: payload.interests,
        })
        setSuggestions(aiRes.data)
      } catch {
        setSuggestions(null)
      } finally {
        setLoading(false)
      }

      navigate('/dashboard')
    } catch {
      updateUser({ onboarded: true })
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        label="ONBOARDING"
        title="Tell us who you are."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — profile form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">YOUR IDENTITY</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Build your profile</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={user?.name || 'Your full name'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Karachi, Pakistan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Skills</label>
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, Python, Figma — comma separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Interests</label>
              <Input
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="Hackathons, UI/UX, Community Building"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#2A7A63] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save and continue →'}
            </button>
          </div>
        </div>

        {/* Right — AI suggestions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">AI SUGGESTION</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What HelpHub thinks about you</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
            </div>
          ) : suggestions ? (
            <div className="space-y-6">
              {suggestions.canHelpWith && suggestions.canHelpWith.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">You can help with:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.canHelpWith.map((item, i) => (
                      <span key={i} className="bg-[#2A7A63]/10 text-[#2A7A63] rounded-full px-3 py-1 text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {suggestions.mayNeedHelpIn && suggestions.mayNeedHelpIn.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">You may need help in:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.mayNeedHelpIn.map((item, i) => (
                      <span key={i} className="bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">
              Fill in your profile to get personalized suggestions.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
