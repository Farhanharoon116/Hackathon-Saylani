import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { SkillTag } from '@/components/ui/badge'

const categories = ['Web Development', 'Design', 'Career', 'Data Science', 'Mobile', 'DevOps', 'Other']
const urgencies = ['Low', 'Medium', 'High']

export default function CreateRequest() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    urgency: 'Medium',
    tags: '',
  })
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef(null)

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  // Debounced AI suggest on description change
  useEffect(() => {
    if (!form.title && !form.description) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (form.description.length < 20) return
      setAiLoading(true)
      try {
        const { data } = await api.post('/ai/suggest', {
          title: form.title,
          description: form.description,
        })
        setAiSuggestion(data)
      } catch {
        // silently handle
      } finally {
        setAiLoading(false)
      }
    }, 800)
    return () => clearTimeout(debounceRef.current)
  }, [form.description, form.title])

  const applyAISuggestions = () => {
    if (!aiSuggestion) return
    if (aiSuggestion.category) updateForm('category', aiSuggestion.category)
    if (aiSuggestion.urgency) updateForm('urgency', aiSuggestion.urgency)
    if (aiSuggestion.tags) updateForm('tags', aiSuggestion.tags.join(', '))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/requests', {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
      navigate('/explore')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        label="CREATE REQUEST"
        title="Turn a rough problem into a clear help request."
        description="Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">YOUR REQUEST</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe what you need</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Title</label>
              <Input
                placeholder="Need review on my JavaScript quiz app before submission"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
              <Textarea
                rows={6}
                placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Tags</label>
              <Input
                placeholder="JavaScript, Debugging, Review"
                value={form.tags}
                onChange={(e) => updateForm('tags', e.target.value)}
              />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
                    <SkillTag key={i}>{tag}</SkillTag>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Category</label>
              <Select value={form.category} onChange={(e) => updateForm('category', e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Urgency</label>
              <Select value={form.urgency} onChange={(e) => updateForm('urgency', e.target.value)}>
                {urgencies.map((u) => <option key={u} value={u}>{u}</option>)}
              </Select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={applyAISuggestions}
                disabled={!aiSuggestion}
                className="border border-[#2A7A63] text-[#2A7A63] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#2A7A63]/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Apply AI suggestions
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2A7A63] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Publishing...' : 'Publish request'}
              </button>
            </div>
          </form>
        </div>

        {/* Right — AI assistant */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">AI ASSISTANT</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Smart request guidance</h2>

          <div className="divide-y divide-gray-100">
            <div className="py-4 flex justify-between items-start">
              <span className="text-sm text-gray-500">Suggested category</span>
              {aiLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
              ) : aiSuggestion?.category ? (
                <span className="font-semibold text-gray-900 text-sm">{aiSuggestion.category}</span>
              ) : (
                <span className="text-gray-400 italic text-sm">Add more detail...</span>
              )}
            </div>
            <div className="py-4 flex justify-between items-start">
              <span className="text-sm text-gray-500">Detected urgency</span>
              {aiLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
              ) : aiSuggestion?.urgency ? (
                <span className="font-semibold text-gray-900 text-sm">{aiSuggestion.urgency}</span>
              ) : (
                <span className="text-gray-400 italic text-sm">Add more detail...</span>
              )}
            </div>
            <div className="py-4 flex justify-between items-start">
              <span className="text-sm text-gray-500">Suggested tags</span>
              {aiLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
              ) : aiSuggestion?.tags && aiSuggestion.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {aiSuggestion.tags.map((t, i) => <SkillTag key={i}>{t}</SkillTag>)}
                </div>
              ) : (
                <span className="text-gray-400 italic text-sm">Add more detail...</span>
              )}
            </div>
            <div className="py-4">
              <span className="text-sm text-gray-500">Rewrite suggestion</span>
              {aiLoading ? (
                <div className="mt-2 flex justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
                </div>
              ) : aiSuggestion?.rewriteSuggestion ? (
                <p className="text-sm text-gray-600 mt-2">{aiSuggestion.rewriteSuggestion}</p>
              ) : (
                <p className="text-gray-400 italic text-sm mt-2">Add more detail...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
