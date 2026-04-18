import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '@/api/axios'
import Navbar from '@/components/layout/Navbar'
import { CategoryTag, UrgencyTag, StatusTag, SkillTag } from '@/components/ui/badge'

export default function Landing() {
  const { user, loading } = useAuth()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await api.get('/requests')
        setRequests((data.requests || data || []).slice(0, 3))
      } catch {
        setRequests([])
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-[#2A7A63] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-emerald-200/35 via-orange-100/35 to-transparent blur-3xl" />
      </div>
      <Navbar />

      {/* Hero — two columns */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left 60% */}
          <div className="lg:w-[60%]">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-4">
              SMIT GRAND CODING NIGHT 2026
            </p>
            <h1 className="text-5xl font-black leading-tight text-gray-900">
              Find help faster. Become help that matters.
            </h1>
            <p className="mt-4 text-gray-500 text-base max-w-xl">
              HelpHub AI is a community-powered support network for students, mentors, creators, and builders.
              Powered by artificial intelligence for skill matching, request guidance, and community insights.
            </p>
            <div className="flex gap-3 mt-8">
              <Link
                to="/auth"
                className="bg-[#1E2D2A] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#1E2D2A]/90 transition-colors"
              >
                Open product demo
              </Link>
              <Link
                to="/auth"
                className="border border-gray-300 text-gray-900 rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Post a request
              </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { label: 'MEMBERS', value: '384+', desc: 'Active community members' },
                { label: 'SOLVED', value: '1.2k+', desc: 'Requests resolved' },
                { label: 'ACCURACY', value: '95%', desc: 'AI match accuracy' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 40% — dark card */}
          <div className="lg:w-[40%]">
            <div className="bg-[#1E2D2A] rounded-3xl p-8 relative">
              <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-orange-400" />
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">LIVE PRODUCT FEEL</p>
              <h2 className="text-3xl font-bold text-white leading-tight mb-6">
                More than a form. More like an ecosystem.
              </h2>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="font-bold text-white text-sm">AI request intelligence</p>
                  <p className="text-gray-400 text-sm mt-1">Automatically detects category, urgency, and suggests stronger descriptions.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="font-bold text-white text-sm">Community trust graph</p>
                  <p className="text-gray-400 text-sm mt-1">Every contribution builds visible trust and recognition.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="font-bold text-white text-4xl">100%</p>
                  <p className="text-gray-400 text-sm mt-1">Top trust score currently active across the sample mentor network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Flow */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">CORE FLOW</p>
            <h2 className="text-3xl font-bold text-gray-900">From struggling alone to solving together</h2>
          </div>
          <Link
            to="/auth"
            className="bg-[#1E2D2A] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#1E2D2A]/90 transition-colors"
          >
            Try onboarding AI
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Ask for help clearly', desc: 'Describe your challenge and let AI refine it into a structured, actionable request.' },
            { title: 'Discover the right people', desc: 'AI matches your needs to the best-fit helpers based on skills, history, and trust.' },
            { title: 'Track real contribution', desc: 'Every solved request builds your trust score, earns badges, and unlocks leaderboard rank.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Requests */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">FEATURED REQUESTS</p>
            <h2 className="text-3xl font-bold text-gray-900">Community problems currently in motion</h2>
          </div>
          <Link
            to="/auth"
            className="bg-[#1E2D2A] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#1E2D2A]/90 transition-colors"
          >
            View full feed
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {requests.length > 0 ? requests.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CategoryTag>{req.category || 'General'}</CategoryTag>
                <UrgencyTag level={req.urgency} />
                <StatusTag status={req.status} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mt-2">{req.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
              {req.tags && req.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {req.tags.map((t, i) => <SkillTag key={i}>{t}</SkillTag>)}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{req.requester?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-400">{req.requester?.location || ''} • {req.helpers?.length || 0} helpers</p>
                </div>
                <Link to="/auth" className="text-[#2A7A63] text-sm font-medium hover:underline">
                  Open details →
                </Link>
              </div>
            </div>
          )) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-2 mb-3">
                  <CategoryTag>Web Development</CategoryTag>
                  <UrgencyTag level={i === 1 ? 'High' : i === 2 ? 'Medium' : 'Low'} />
                  <StatusTag status="Open" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base">Sample help request #{i}</h3>
                <p className="text-sm text-gray-500 mt-1">Join the platform to see real community requests and start helping.</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Community</p>
                  <Link to="/auth" className="text-[#2A7A63] text-sm font-medium hover:underline">
                    Open details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-8 text-center">
        <p className="text-xs text-gray-400">
          HelpHub AI is built as a premium-feel, multi-page community support product using React, Node.js, and MongoDB.
        </p>
      </footer>
    </div>
  )
}
