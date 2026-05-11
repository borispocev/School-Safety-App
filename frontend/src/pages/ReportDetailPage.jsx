import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getReport, updateReport, deleteReport } from '../api/reports'
import { getReportStatuses } from '../api/metadata'
import { useAuth } from '../context/AuthContext'

function StatusBadge({ status }) {
  const map = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    'UNDER REVIEW': 'bg-blue-100 text-blue-800',
    'IN PROGRESS': 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
  }

  return (
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${map[status?.toUpperCase()] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function formatConfidence(score) {
  if (score === null || score === undefined) {
    return '—'
  }

  return `${(score * 100).toFixed(1)}%`
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [report, setReport] = useState(null)
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getReport(id), getReportStatuses()])
        .then(([r, s]) => {
          setReport(r.data)
          setStatuses(s.data)
          setSelectedStatus(r.data.reportStatusId?.toString())
        })
        .catch(() => setError('Пријавата не е пронајдена.'))
        .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === report.reportStatusId?.toString()) return

    setSaving(true)

    try {
      const updated = await updateReport(id, {
        schoolId: report.schoolId,
        reporterUserId: report.reporterUserId,
        reportStatusId: parseInt(selectedStatus),
        reportTypeId: report.reportTypeId,
        title: report.title,
        description: report.description,
        locationDetails: report.locationDetails,
        anonymousReport: report.anonymousReport,
        incidentAt: report.incidentAt,
        submittedAt: report.submittedAt,
        resolvedAt: report.resolvedAt,
      })

      setReport(updated.data)
      setSelectedStatus(updated.data.reportStatusId?.toString())
    } catch {
      setError('Грешка при ажурирање на статусот.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Дали сте сигурни дека сакате да ја избришете оваа пријава?')) return

    try {
      await deleteReport(id)
      navigate('/reports')
    } catch {
      setError('Грешка при бришење.')
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Вчитување...</div>
  }

  if (error && !report) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-red-500">{error}</p>
          <Link to="/reports" className="text-blue-600 hover:underline text-sm mt-4 inline-block">
            ← Назад кон пријави
          </Link>
        </div>
    )
  }

  const aiTypeIsDifferent =
      report.aiSuggestedTypeName &&
      report.reportTypeName &&
      report.aiSuggestedTypeName.toLowerCase() !== report.reportTypeName.toLowerCase()

  return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/reports" className="hover:text-blue-600">Пријави</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{report.title}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold">{report.title}</h1>
                <p className="text-blue-200 text-sm mt-1">📋 {report.reportTypeName}</p>
              </div>
              <StatusBadge status={report.reportStatusName} />
            </div>
          </div>

          <div className="p-6 space-y-5">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Опис / Description
              </h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail label="Училиште / School" value={report.schoolName} icon="🏫" />
              <Detail label="Локација / Location" value={report.locationDetails || '—'} icon="📍" />
              <Detail
                  label="Поднесена / Submitted"
                  value={report.submittedAt ? new Date(report.submittedAt).toLocaleString('mk-MK') : '—'}
                  icon="🕐"
              />
              {report.incidentAt && (
                  <Detail
                      label="Инцидент / Incident At"
                      value={new Date(report.incidentAt).toLocaleString('mk-MK')}
                      icon="⚠️"
                  />
              )}
              {report.resolvedAt && (
                  <Detail
                      label="Решена / Resolved At"
                      value={new Date(report.resolvedAt).toLocaleString('mk-MK')}
                      icon="✅"
                  />
              )}
              <Detail
                  label="Пријавувач / Reporter"
                  value={report.anonymousReport ? 'Анонимно / Anonymous' : (report.reporterName || '—')}
                  icon="👤"
              />
            </div>

            <div className="border-t pt-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                AI Анализа / AI Analysis
              </h3>

              {report.aiSuggestedTypeName ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Detail
                          label="AI предложен тип / AI Suggested Type"
                          value={report.aiSuggestedTypeName}
                          icon="🤖"
                      />
                      <Detail
                          label="Сигурност / Confidence"
                          value={formatConfidence(report.aiConfidenceScore)}
                          icon="📊"
                      />
                      <Detail
                          label="AI приоритет / AI Priority"
                          value={report.aiSuggestedPriority || '—'}
                          icon="🚦"
                      />
                      <Detail
                          label="Ризични зборови / Risk Keywords"
                          value={report.aiRiskKeywords || '—'}
                          icon="🔎"
                      />
                    </div>

                    {aiTypeIsDifferent && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-4 py-3">
                          ⚠️ AI предложи различна категорија од онаа што ја избрал корисникот.
                          <br />
                          User selected: <strong>{report.reportTypeName}</strong> · AI suggested: <strong>{report.aiSuggestedTypeName}</strong>
                        </div>
                    )}
                  </>
              ) : (
                  <div className="bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg px-4 py-3">
                    AI анализа не е достапна за оваа пријава.
                  </div>
              )}
            </div>

            {report.images?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Слики / Images
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {report.images.map((img) => (
                        <a
                            key={img.id}
                            href={img.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow"
                        >
                          <img src={img.imageUrl} alt={img.fileName} className="w-full h-40 object-cover" />
                          <p className="text-xs text-gray-400 px-2 py-1 truncate">{img.fileName}</p>
                        </a>
                    ))}
                  </div>
                </div>
            )}

            {isAdmin() && (
                <div className="border-t pt-5 space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Промени Статус / Change Status
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    >
                      {statuses.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button
                        onClick={handleStatusChange}
                        disabled={saving}
                        className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {saving ? 'Зачувување...' : 'Зачувај'}
                    </button>
                  </div>

                  <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    🗑 Избриши пријава / Delete report
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

function Detail({ label, value, icon }) {
  return (
      <div className="bg-gray-50 rounded-lg px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">{icon} {label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
  )
}