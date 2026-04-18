import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Send, Lightbulb } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleAISuggest = async () => {
    if (!form.title && !form.description) return
    setLoading(true)
    try {
      const { data } = await api.post('/ai/suggest', {
        title: form.title,
        description: form.description,
      })
      setAiSuggestion(data)
      if (data.category) updateForm('category', data.category)
      if (data.urgency) updateForm('urgency', data.urgency)
      if (data.tags) updateForm('tags', data.tags.join(', '))
    } catch {
      setAiSuggestion({
        rewriteSuggestion: 'AI suggestions are currently unavailable. Please fill in the fields manually.',
      })
    } finally {
      setLoading(false)
    }
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
        title="Describe your problem and let AI assist."
        description="Provide details about what you need help with. Our AI will suggest categories, urgency, and tags."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <Input
                    placeholder="e.g., Need help with React state management"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <Textarea
                    placeholder="Describe your problem in detail. Include what you've tried, error messages, and what outcome you're looking for..."
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    required
                    className="min-h-[150px]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category</label>
                    <Select
                      value={form.category}
                      onChange={(e) => updateForm('category', e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Urgency</label>
                    <Select
                      value={form.urgency}
                      onChange={(e) => updateForm('urgency', e.target.value)}
                    >
                      {urgencies.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                  <Input
                    placeholder="react, hooks, state-management"
                    value={form.tags}
                    onChange={(e) => updateForm('tags', e.target.value)}
                  />
                  {form.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAISuggest}
                    disabled={loading || (!form.title && !form.description)}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {loading ? 'Analyzing...' : 'Get AI Suggestions'}
                  </Button>
                  <Button type="submit" disabled={submitting} className="gap-2">
                    <Send className="h-4 w-4" />
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions Panel */}
        <div>
          {aiSuggestion ? (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestion.category && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Category</p>
                    <Badge>{aiSuggestion.category}</Badge>
                  </div>
                )}
                {aiSuggestion.urgency && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Urgency</p>
                    <Badge variant={aiSuggestion.urgency === 'High' ? 'destructive' : aiSuggestion.urgency === 'Medium' ? 'warning' : 'default'}>
                      {aiSuggestion.urgency}
                    </Badge>
                  </div>
                )}
                {aiSuggestion.tags && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSuggestion.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {aiSuggestion.rewriteSuggestion && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Rewrite Suggestion</p>
                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                      {aiSuggestion.rewriteSuggestion}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Fill in the title and description, then click "Get AI Suggestions" for smart recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
