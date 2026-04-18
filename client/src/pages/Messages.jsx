import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Send, MessageSquare as MsgIcon, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selected) fetchMessages(selected._id || selected.recipientId)
  }, [selected])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations')
      const convos = data.conversations || data || []
      setConversations(convos)
      if (convos.length > 0 && !selected) setSelected(convos[0])
    } catch {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (recipientId) => {
    try {
      const { data } = await api.get(`/messages/${recipientId}`)
      setMessages(data.messages || data || [])
    } catch {
      setMessages([])
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selected) return
    setSending(true)
    try {
      const recipientId = selected._id || selected.recipientId
      await api.post('/messages', {
        recipientId,
        content: newMessage.trim(),
      })
      setNewMessage('')
      fetchMessages(recipientId)
    } catch {
      // silently handle
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((c) =>
    (c.name || c.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        label="MESSAGES"
        title="Your conversations"
        description="Chat with helpers and requesters in your community."
      />

      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Left: Conversations list */}
          <div className="w-80 border-r border-border flex flex-col shrink-0">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-2 p-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MsgIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((convo, i) => {
                  const isActive = selected && (selected._id || selected.recipientId) === (convo._id || convo.recipientId)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(convo)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors cursor-pointer',
                        isActive && 'bg-muted'
                      )}
                    >
                      <Avatar name={convo.name || convo.recipientName || 'User'} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {convo.name || convo.recipientName || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {convo.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Right: Message thread */}
          <div className="flex-1 flex flex-col">
            {selected ? (
              <>
                {/* Header */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                  <Avatar name={selected.name || selected.recipientName || 'User'} size="sm" />
                  <p className="font-medium text-sm">
                    {selected.name || selected.recipientName || 'Unknown'}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = (msg.sender?._id || msg.sender || msg.senderId) === user?._id
                      return (
                        <div key={i} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              'max-w-[70%] rounded-2xl px-4 py-2 text-sm',
                              isMine
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted text-foreground rounded-bl-md'
                            )}
                          >
                            <p>{msg.content || msg.text}</p>
                            <p className={cn(
                              'text-[10px] mt-1',
                              isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'
                            )}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MsgIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
