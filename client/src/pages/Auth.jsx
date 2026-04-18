import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogIn, UserPlus } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function Auth() {
  const { user, loading, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'need_help' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={user.isOnboarded ? '/dashboard' : '/onboarding'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password)
        navigate(data.user?.isOnboarded ? '/dashboard' : '/onboarding')
      } else {
        const data = await register(form.name, form.email, form.password, form.role)
        navigate(data.user?.isOnboarded ? '/dashboard' : '/onboarding')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-3">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Sign in to your HelpHub AI account'
                : 'Join the HelpHub AI community'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                onClick={() => { setMode('login'); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'register' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  required
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">I want to...</label>
                  <Select
                    value={form.role}
                    onChange={(e) => updateForm('role', e.target.value)}
                  >
                    <option value="need_help">Get Help</option>
                    <option value="can_help">Help Others</option>
                    <option value="both">Both</option>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
