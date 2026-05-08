import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReports } from '../../api/reports'
import { getSchools } from '../../api/schools'
import { getUsers } from '../../api/users'

export default function AdminDashboard() {
  const [reports, setReports] = useState([])
  const [schools, setSchools] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getReports(), getSchools(), getUsers()])
      .then(([r, sc, u]) => {
        setReports(r.data)
        setSchools(sc.data)
        setUsers(u.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const countByStatus = (name) =>
    reports.filter((r) => r.reportStatusName?.toUpperCase().includes(name)).length

  const stats = [
    { label: 'Вкупно Пријави / Total Reports', value: reports.length, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: 'Поднесени / Submitted', value: countByStatus('SUBMIT'), icon: '🟡', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Во Преглед / Under Review', value: countByStatus('REVIEW'), icon: '🔵', color: 'bg-blue-50 text-blue-700' },
    { label: 'Решени / Resolved', value: countByStatus('RESOLVE'), icon: '🟢', color: 'bg-green-50 text-green-700' },
    { label: 'Училишта / Schools', value: schools.length, icon: '🏫', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Корисници / Users', value: users.length, icon: '👥', color: 'bg-purple-50 text-purple-700' },
  ]

  const recent = reports.slice(0, 8)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Администрација / Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Преглед на системот и управување со пријави</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{loading ? '—' : s.value}</div>
            <div className="text-xs font-medium mt-1 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/admin/reports', label: 'Управувај Пријави', sub: 'Промени статус, прегледај', icon: '📋', color: 'bg-blue-600 hover:bg-blue-700' },
          { to: '/admin/schools', label: 'Управувај Училишта', sub: 'Додај, уреди, избриши', icon: '🏫', color: 'bg-indigo-600 hover:bg-indigo-700' },
          { to: '/admin/users', label: 'Управувај Корисници', sub: 'Корисници и улоги', icon: '👥', color: 'bg-purple-600 hover:bg-purple-700' },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${link.color} text-white rounded-xl p-5 flex items-center gap-4 transition-colors`}
          >
            <span className="text-3xl">{link.icon}</span>
            <div>
              <p className="font-semibold">{link.label}</p>
              <p className="text-xs opacity-75 mt-0.5">{link.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Последни Пријави / Recent Reports</h2>
          <Link to="/admin/reports" className="text-blue-600 text-sm hover:underline">Прегледај ги сите →</Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Вчитување...</div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Нема пријави.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#', 'Наслов', 'Тип', 'Училиште', 'Статус', 'Датум'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">#{r.id}</td>
                    <td className="px-4 py-3">
                      <Link to={`/reports/${r.id}`} className="font-medium text-gray-800 hover:text-blue-600 truncate max-w-xs block">
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.reportTypeName}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{r.schoolName}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={r.reportStatusName} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleDateString('mk-MK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    'UNDER REVIEW': 'bg-blue-100 text-blue-800',
    'IN PROGRESS': 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status?.toUpperCase()] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
