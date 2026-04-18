import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/avatar'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data.users || data || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const toggleBan = async (userId, isBanned) => {
    try {
      await api.patch(`/admin/users/${userId}/ban`)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, banned: !isBanned } : u
        )
      )
    } catch {
      // silently handle
    }
  }

  return (
    <div>
      <PageHeader
        label="ADMIN"
        title="Manage all users."
      />

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 text-xs font-semibold text-gray-400">Name</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400">Email</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400">Role</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 text-center">Trust Score</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 text-center">Contributions</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400">Status</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isBanned = u.banned || u.role === 'banned'
                  return (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={u.name} size="sm" />
                          <Link to={`/profile/${u._id}`} className="text-sm font-medium text-gray-900 hover:underline">
                            {u.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{u.email}</td>
                      <td className="py-3 text-sm text-gray-500">{u.isAdmin ? 'Admin' : u.role}</td>
                      <td className="py-3 text-center text-sm font-medium text-gray-900">{u.trustScore || 0}</td>
                      <td className="py-3 text-center text-sm text-gray-500">{u.contributions || 0}</td>
                      <td className="py-3">
                        {isBanned ? (
                          <span className="bg-red-100 text-red-600 rounded-full px-3 py-1 text-xs font-medium">Banned</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">Active</span>
                        )}
                      </td>
                      <td className="py-3">
                        {!u.isAdmin && (
                          <button
                            onClick={() => toggleBan(u._id, isBanned)}
                            className={`text-sm font-medium cursor-pointer ${
                              isBanned
                                ? 'text-green-600 hover:text-green-700'
                                : 'text-red-500 hover:text-red-700'
                            }`}
                          >
                            {isBanned ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
