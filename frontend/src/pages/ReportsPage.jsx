import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReports } from '../api/reports'
import { getReportTypes, getReportStatuses } from '../api/metadata'
import { getSchools } from '../api/schools'
import { exportReportsCsv } from '../api/reports'
import { useAuth } from '../context/AuthContext'

function StatusBadge({ status }) {
  const map = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    'UNDER REVIEW': 'bg-blue-100 text-blue-800',
    'IN PROGRESS': 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
  }
  const key = status?.toUpperCase()
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${map[key] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function ReportsPage() {
  const { isAdmin } = useAuth()
  const [reports, setReports] = useState([])
  const [filtered, setFiltered] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')

  useEffect(() => {
    Promise.all([getReports(), getReportTypes(), getReportStatuses(), getSchools()])
      .then(([r, t, s, sc]) => {
        setReports(r.data)
        setFiltered(r.data)
        setTypes(t.data)
        setStatuses(s.data)
        setSchools(sc.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = reports
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.locationDetails?.toLowerCase().includes(q)
      )
    }
    if (typeFilter) result = result.filter((r) => r.reportTypeId?.toString() === typeFilter)
    if (statusFilter) result = result.filter((r) => r.reportStatusId?.toString() === statusFilter)
    if (schoolFilter) result = result.filter((r) => r.schoolId?.toString() === schoolFilter)
    setFiltered(result)
  }, [search, typeFilter, statusFilter, schoolFilter, reports])

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('')
    setStatusFilter('')
    setSchoolFilter('')
  }
  const handleExportCsv = async () => {
    try {
      await exportReportsCsv()
    } catch (error) {
      console.error(error)
      alert('Грешка при export на пријавите.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Пријави / Reports</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} пронајдени пријави</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin() && (
              <button
                  type="button"
                  onClick={handleExportCsv}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                ⬇ Export CSV
              </button>
          )}

          <Link
              to="/reports/new"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            + Нова Пријава
          </Link>
          {isAdmin() && (
              <Link
                  to="/admin/statistics"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                📊 Statistics
              </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
        <input
          type="text"
          placeholder="Пребарај пријави / Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Сите типови / All Types</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Сите статуси / All Statuses</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Сите училишта / All Schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {(search || typeFilter || statusFilter || schoolFilter) && (
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
            Исчисти филтри / Clear filters
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Вчитување...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Нема пронајдени пријави.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="block bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 text-sm">{report.title}</h3>
                    {report.anonymousReport && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Анонимна</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{report.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                    <span>🏫 {report.schoolName}</span>
                    <span>📋 {report.reportTypeName}</span>
                    {report.locationDetails && <span>📍 {report.locationDetails}</span>}
                    <span>🕐 {new Date(report.submittedAt).toLocaleDateString('mk-MK')}</span>
                  </div>
                </div>
                <StatusBadge status={report.reportStatusName} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
