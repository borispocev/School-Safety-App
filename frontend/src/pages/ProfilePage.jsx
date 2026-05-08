import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSchools } from '../api/schools'

export default function ProfilePage() {
  const { user, isAdmin, hasSchool, applyAsStudent } = useAuth()
  const [schools, setSchools] = useState([])
  const [selectedSchool, setSelectedSchool] = useState('')
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    if (!hasSchool()) {
      getSchools().then((r) => {
        setSchools(r.data)
        if (r.data.length > 0) setSelectedSchool(r.data[0].id.toString())
      }).catch(() => {})
    }
  }, [user])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!selectedSchool) return
    setApplying(true)
    setApplyError('')
    try {
      await applyAsStudent(parseInt(selectedSchool))
      setApplySuccess(true)
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Грешка. Обидете се повторно.')
    } finally {
      setApplying(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Мој Профил / My Profile</h1>

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-blue-700 text-3xl font-bold">
            {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-white text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
            isAdmin() ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white'
          }`}>
            {isAdmin() ? '👑 Администратор / Admin' : '👤 Корисник / User'}
          </span>
        </div>

        <div className="p-6 space-y-4">
          <Row icon="📧" label="Е-маил / Email" value={user.email} />
          <Row icon="👤" label="Ime / First Name" value={user.firstName} />
          <Row icon="👤" label="Презиме / Last Name" value={user.lastName} />
          <Row icon="🔑" label="Улога / Role" value={user.role} />
          {user.schoolName && (
            <Row icon="🏫" label="Училиште / School" value={user.schoolName} />
          )}
          <Row icon="🆔" label="ID" value={`#${user.id}`} />
        </div>
      </div>

      {/* Apply as Student card — only shown when user has no school */}
      {!hasSchool() && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-sm p-6">
          {applySuccess ? (
            <div className="text-center">
              <span className="text-4xl">🎓</span>
              <h3 className="text-lg font-bold text-green-700 mt-3">Успешно пријавени!</h3>
              <p className="text-gray-500 text-sm mt-1">
                Вашето училиште е зачувано: <strong>{user.schoolName}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Пријавете се како Ученик</h3>
                  <p className="text-gray-500 text-sm">Apply as a Student</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Изберете го вашето средно училиште за да се пријавите како ученик. Ова ќе ве поврзе со вашата училишна заедница.
              </p>

              {applyError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {applyError}
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Изберете Училиште / Select School *
                  </label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Изберете училиште...</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.city}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={applying || !selectedSchool}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {applying ? 'Пријавување...' : 'Пријави се како Ученик / Apply as Student'}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          to="/reports"
          className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
        >
          Мои Пријави / My Reports
        </Link>
        {isAdmin() && (
          <Link
            to="/admin"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            Администрација / Admin
          </Link>
        )}
      </div>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}
