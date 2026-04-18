import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

function timeAgo(date) {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function Messages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ recipientId: '', content: '' })

  useEffect(() => {
    fetchMessages()
    fetchUsers()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages')
      setMessages(data.messages || data || [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users/leaderboard')
      setUsers(data.users || data || [])
    } catch {
      setUsers([])
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.recipientId || !form.content.trim()) return
    setSending(true)
    try {
      await api.post('/messages', {
        recipientId: form.recipientId,
        content: form.content.trim(),
      })
      setForm({ recipientId: '', content: '' })
      fetchMessages()
    } catch {
      // silently handle
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader
        label="INTERACTION / MESSAGING"
        title="Keep support moving through direct communication."
        description="Basic messaging gives helpers and requesters a clear follow-up path once a match happens."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — conversation stream */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">CONVERSATION STREAM</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent messages</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Nothing here yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((msg, i) => {
                const senderName = msg.sender?.name || 'Unknown'
                const recipientName = msg.recipient?.name || 'Unknown'
                return (
                  <div key={i} className="py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {senderName} → {recipientName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {msg.content}
                        </p>
                      </div>
                      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full shrink-0 ml-3">
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right — send message */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-2">SEND MESSAGE</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Start a conversation</h2>

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">To</label>
              <Select
                value={form.recipientId}
                onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
              >
                <option value="">Select a user...</option>
                {users.filter(u => u._id !== user?._id).map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Message</label>
              <Textarea
                rows={6}
                placeholder="Share support details, ask for files, or suggest next steps."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={sending || !form.recipientId || !form.content.trim()}
              className="w-full bg-[#2A7A63] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2A7A63]/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
