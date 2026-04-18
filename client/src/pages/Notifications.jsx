import { useEffect, useState } from 'react'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bell,
  CheckCheck,
  HandHelping,
  MessageSquare,
  Star,
  FileText,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const typeIcons = {
  help_offered: HandHelping,
  message: MessageSquare,
  request_solved: Star,
  new_request: FileText,
  system: Info,
}

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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      <PageHeader
        label="NOTIFICATIONS"
        title="Stay updated"
        description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`}
      />

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell
            return (
              <Card
                key={notif._id}
                className={cn(
                  'cursor-pointer hover:shadow-sm transition-all',
                  !notif.read && 'border-primary/30 bg-primary/5'
                )}
                onClick={() => !notif.read && markRead(notif._id)}
              >
                <CardContent className="py-4 flex items-start gap-3">
                  <div className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                    !notif.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm',
                      !notif.read ? 'font-medium' : 'text-muted-foreground'
                    )}>
                      {notif.message || notif.content || 'New notification'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1" />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
