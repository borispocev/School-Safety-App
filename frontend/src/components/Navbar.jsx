import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path
      ? 'text-white font-semibold border-b-2 border-white pb-0.5'
      : 'text-blue-100 hover:text-white'

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-white font-bold text-lg">SchoolSafety</span>
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-6 text-sm">
                <Link to="/" className={isActive('/')}>Дома / Home</Link>
                <Link to="/reports" className={isActive('/reports')}>Пријави / Reports</Link>
                {isAdmin() && (
                  <Link to="/admin" className={isActive('/admin')}>Администрација</Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/reports/new"
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  + Пријави Проблем
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 text-blue-100 hover:text-white text-sm focus:outline-none"
                  >
                    <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-white">
                      {user.firstName?.[0]?.toUpperCase()}
                    </span>
                    <span className="hidden md:inline">{user.firstName} {user.lastName}</span>
                    <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isAdmin() ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </div>

                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        👤 Мој Профил / Profile
                      </Link>

                      {isAdmin() && (
                        <>
                          <Link to="/admin/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            📋 Управувај Пријави
                          </Link>
                          <Link to="/admin/schools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            🏫 Управувај Училишта
                          </Link>
                          <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            👥 Управувај Корисници
                          </Link>
                        </>
                      )}

                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        🚪 Одјава / Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signup"
                  className="text-blue-100 hover:text-white text-sm font-medium px-3 py-2"
                >
                  Регистрација
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Најава / Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
