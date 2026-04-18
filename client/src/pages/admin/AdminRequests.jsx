import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/axios'
import PageHeader from '@/components/layout/PageHeader'
import { CategoryTag, UrgencyTag, StatusTag } from '@/components/ui/badge'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 20

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/admin/requests')
      setRequests(data.requests || data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return
    try {
      await api.delete(`/admin/requests/${id}`)
      setRequests((prev) => prev.filter((r) => r._id !== id))
    } catch {
      // silently handle
    }
  }

  const totalPages = Math.ceil(requests.length / perPage)
  const paginatedRequests = requests.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <PageHeader
        label="ADMIN"
        title="Manage all requests."
      />

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">No requests found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-3 text-xs font-semibold text-gray-400">Title</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400">Category</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400">Urgency</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400">Status</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400">Requester</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400">Date</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((req) => (
                    <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <Link to={`/requests/${req._id}`} className="text-sm font-medium text-gray-900 hover:underline truncate max-w-[200px] block">
                          {req.title}
                        </Link>
                      </td>
                      <td className="py-3"><CategoryTag>{req.category || 'General'}</CategoryTag></td>
                      <td className="py-3"><UrgencyTag level={req.urgency} /></td>
                      <td className="py-3"><StatusTag status={req.status} /></td>
                      <td className="py-3 text-sm text-gray-500">{req.requester?.name || 'Anonymous'}</td>
                      <td className="py-3 text-xs text-gray-400">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="text-red-500 text-sm font-medium hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
