import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import AdminRoute from '@/routes/AdminRoute'
import Layout from '@/components/layout/Layout'

import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Explore from '@/pages/Explore'
import CreateRequest from '@/pages/CreateRequest'
import RequestDetail from '@/pages/RequestDetail'
import Messages from '@/pages/Messages'
import Leaderboard from '@/pages/Leaderboard'
import AICenter from '@/pages/AICenter'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminRequests from '@/pages/admin/AdminRequests'
import AdminUsers from '@/pages/admin/AdminUsers'

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function AdminLayout({ children }) {
  return (
    <AdminRoute>
      <Layout>{children}</Layout>
    </AdminRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<ProtectedLayout><Onboarding /></ProtectedLayout>} />
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/explore" element={<ProtectedLayout><Explore /></ProtectedLayout>} />
          <Route path="/create-request" element={<ProtectedLayout><CreateRequest /></ProtectedLayout>} />
          <Route path="/requests/:id" element={<ProtectedLayout><RequestDetail /></ProtectedLayout>} />
          <Route path="/messages" element={<ProtectedLayout><Messages /></ProtectedLayout>} />
          <Route path="/leaderboard" element={<ProtectedLayout><Leaderboard /></ProtectedLayout>} />
          <Route path="/ai-center" element={<ProtectedLayout><AICenter /></ProtectedLayout>} />
          <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/profile/:id" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/requests" element={<AdminLayout><AdminRequests /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
