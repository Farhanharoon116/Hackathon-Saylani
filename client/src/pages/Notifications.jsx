import { useEffect, useState } from 'react'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'

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

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data.notifications || data || [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {
      // silently handle
    }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      )
    } catch {
      // silently handle
    }
  }

  return (
    <div>
      <PageHeader
        label="NOTIFICATIONS"
        title="Stay updated on requests, helpers, and trust signals."
      />

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2A7A63] mb-1">LIVE UPDATES</p>
            <h2 className="text-2xl font-bold text-gray-900">Notification feed</h2>
          </div>
          <button
            onClick={markAllRead}
            className="border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Nothing here yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.read && markRead(notif._id)}
                className="py-5 flex items-start justify-between cursor-pointer hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notif.message || notif.content || 'New notification'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notif.type || 'Status'} • {timeAgo(notif.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ml-3 ${
                  notif.read
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {notif.read ? 'Read' : 'Unread'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
