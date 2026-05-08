import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReports, updateReport, deleteReport } from '../../api/reports'
import { getReportStatuses } from '../../api/metadata'

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

export default function ManageReports() {
  const [reports, setReports] = useState([])
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState({})
  const [localStatuses, setLocalStatuses] = useState({})

  useEffect(() => {
    Promise.all([getReports(), getReportStatuses()])
      .then(([r, s]) => {
        setReports(r.data)
        setStatuses(s.data)
        const init = {}
        r.data.forEach((rep) => { init[rep.id] = rep.reportStatusId?.toString() })
        setLocalStatuses(init)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase()
    return !q || r.title?.toLowerCase().includes(q) || r.schoolName?.toLowerCase().includes(q)
  })

  const handleStatusSave = async (report) => {
    const newStatusId = localStatuses[report.id]
    if (!newStatusId || newStatusId === report.reportStatusId?.toString()) return
    setSaving((s) => ({ ...s, [report.id]: true }))
    try {
      const updated = await updateReport(report.id, {
        schoolId: report.schoolId,
        reporterUserId: report.reporterUserId,
        reportStatusId: parseInt(newStatusId),
        reportTypeId: report.reportTypeId,
        title: report.title,
        description: report.description,
        locationDetails: report.locationDetails,
        anonymousReport: report.anonymousReport,
        incidentAt: report.incidentAt,
        submittedAt: report.submittedAt,
        resolvedAt: report.resolvedAt,
      })
      setReports((prev) => prev.map((r) => r.id === report.id ? updated.data : r))
    } catch {}
    setSaving((s) => ({ ...s, [report.id]: false }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Дали сте сигурни?')) return
    try {
      await deleteReport(id)
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Управувај Пријави / Manage Reports</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} пријави</p>
        </div>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Назад</Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Пребарај / Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Вчитување...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Нема пронајдени пријави.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Наслов', 'Тип', 'Училиште', 'Тековен Статус', 'Промени Статус', 'Датум', 'Акции'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{r.id}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <Link to={`/reports/${r.id}`} className="font-medium text-gray-800 hover:text-blue-600 block truncate">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{r.reportTypeName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate text-xs">{r.schoolName}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.reportStatusName} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={localStatuses[r.id] || ''}
                        onChange={(e) => setLocalStatuses((s) => ({ ...s, [r.id]: e.target.value }))}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleStatusSave(r)}
                        disabled={saving[r.id]}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        {saving[r.id] ? '...' : 'Зачувај'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(r.submittedAt).toLocaleDateString('mk-MK')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Избриши
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
