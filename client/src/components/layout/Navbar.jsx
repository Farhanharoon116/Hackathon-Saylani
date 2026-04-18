import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { LogOut, Shield, Menu, X, Sparkles, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/explore', label: 'Explore' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/ai-center', label: 'AI Center' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/messages', label: 'Messages' },
]

const publicNavItems = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Explore' },
  { to: '/auth', label: 'Leaderboard' },
  { to: '/auth', label: 'AI Center' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const isPublic = !user

  const items = isPublic ? publicNavItems : navItems

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2A7A63] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-gray-900 text-base">HelpHub AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                    isActive
                      ? 'bg-[#2A7A63] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2A7A63] flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#2A7A63] hover:bg-gray-50 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">Live community signals</span>
                <Link
                  to="/auth"
                  className="bg-[#1E2D2A] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#1E2D2A]/90 transition-colors"
                >
                  Join the platform
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                className="md:hidden p-2 cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-4 py-2 text-sm font-medium rounded-full transition-colors',
                    isActive
                      ? 'bg-[#2A7A63] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
