import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import {
  Sparkles,
  Users,
  BarChart3,
  Trophy,
  ArrowRight,
  Heart,
  Zap,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description: 'Our AI analyzes your skills and needs to connect you with the perfect helpers and opportunities.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a vibrant community of learners and experts who believe in the power of helping each other.',
  },
  {
    icon: BarChart3,
    title: 'Smart Insights',
    description: 'Get AI-generated insights about community trends, urgent needs, and mentorship opportunities.',
  },
  {
    icon: Trophy,
    title: 'Gamification & Trust',
    description: 'Build your reputation through trust scores, badges, and climb the leaderboard as you contribute.',
  },
]

export default function Landing() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm text-accent-foreground/80">AI-Powered Community Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-accent-foreground leading-tight">
                Get help. Give help.{' '}
                <span className="text-primary">Grow together.</span>
              </h1>
              <p className="mt-6 text-lg text-accent-foreground/70 max-w-2xl">
                HelpHub AI connects people who need help with those who can provide it.
                Powered by artificial intelligence to match skills, suggest solutions,
                and build a stronger community.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-accent-foreground/30 text-accent-foreground hover:bg-white/10">
                    Explore Requests
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-10 right-10 opacity-20">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-primary" />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1,000+', label: 'Community Members' },
              { value: '5,000+', label: 'Requests Solved' },
              { value: '95%', label: 'Match Accuracy' },
              { value: '4.9/5', label: 'User Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Why Choose HelpHub AI?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Built with cutting-edge AI to create meaningful connections and empower communities.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <Card className="bg-accent border-0">
          <CardContent className="py-12 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-accent-foreground mb-3">
              Ready to make a difference?
            </h2>
            <p className="text-accent-foreground/70 mb-6 max-w-md mx-auto">
              Join thousands of community members who are helping each other grow every day.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Join Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HelpHub AI. Built with ❤️ for the community.</p>
        </div>
      </footer>
    </div>
  )
}
