import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReport } from '../api/reports'
import { getSchools } from '../api/schools'
import { getReportTypes, getReportStatuses } from '../api/metadata'
import { useAuth } from '../context/AuthContext'

const TYPE_ICONS = {
  SPEEDING: '🚗',
  UNSAFE_CROSSWALK: '🚶',
  MISSING_SIGNAGE: '⚠️',
  POOR_LIGHTING: '💡',
  OTHER: '📋',
}

export default function CreateReportPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [schools, setSchools] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    schoolId: '',
    reportTypeId: '',
    title: '',
    description: '',
    locationDetails: '',
    anonymousReport: false,
    incidentAt: '',
  })

  useEffect(() => {
    Promise.all([
      getSchools().catch((e) => ({ data: [], _err: e })),
      getReportTypes().catch((e) => ({ data: [], _err: e })),
      getReportStatuses().catch((e) => ({ data: [], _err: e })),
    ]).then(([sc, ty, st]) => {
      const anyFailed = [sc, ty, st].some((r) => r._err)
      if (anyFailed) {
        const isNetworkError = [sc, ty, st].some((r) => r._err && !r._err.response)
        setError(
          isNetworkError
            ? 'Серверот не е достапен (port 8080). Стартувајте го backend-от со: .\\mvnw spring-boot:run'
            : 'Грешка при вчитување на податоци. Обидете се повторно.'
        )
      }
      setSchools(sc.data)
      setTypes(ty.data)
      setStatuses(st.data)
      if (sc.data.length > 0) setForm((f) => ({ ...f, schoolId: sc.data[0].id.toString() }))
      if (ty.data.length > 0) setForm((f) => ({ ...f, reportTypeId: ty.data[0].id.toString() }))
    }).finally(() => setLoading(false))
  }, [])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.schoolId || !form.reportTypeId || !form.title || !form.description) {
      setError('Пополнете ги сите задолжителни полиња.')
      return
    }
    setError('')
    setSubmitting(true)

    const submittedStatus = statuses.find(
      (s) => s.code === 'SUBMITTED' || s.name?.toLowerCase().includes('submit')
    )

    const payload = {
      schoolId: parseInt(form.schoolId),
      reporterUserId: form.anonymousReport ? null : user?.id,
      reportStatusId: submittedStatus?.id ?? statuses[0]?.id,
      reportTypeId: parseInt(form.reportTypeId),
      title: form.title,
      description: form.description,
      locationDetails: form.locationDetails || null,
      anonymousReport: form.anonymousReport,
      incidentAt: form.incidentAt ? form.incidentAt : null,
      submittedAt: new Date().toISOString().slice(0, 19),
      resolvedAt: null,
    }

    try {
      const res = await createReport(payload)
      navigate(`/reports/${res.data.id}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Грешка при поднесување на пријавата.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Вчитување...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Нова Пријава / New Report</h1>
      <p className="text-gray-500 text-sm mb-6">Пополнете ги деталите за небезбедната ситуација</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">

        {/* Type selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Тип на пријава / Report Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {types.map((type) => {
              const icon = TYPE_ICONS[type.code] || '📋'
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => set('reportTypeId', type.id.toString())}
                  className={`border-2 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all text-sm ${
                    form.reportTypeId === type.id.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-blue-300 text-gray-600'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-center leading-tight text-xs">{type.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* School */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Училиште / School <span className="text-red-500">*</span>
          </label>
          <select
            value={form.schoolId}
            onChange={(e) => set('schoolId', e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Изберете училиште...</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Наслов / Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            maxLength={150}
            placeholder="Краток наслов на проблемот..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Опис / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
            rows={4}
            placeholder="Детален опис на проблемот..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Локација / Location Details
          </label>
          <input
            type="text"
            value={form.locationDetails}
            onChange={(e) => set('locationDetails', e.target.value)}
            maxLength={255}
            placeholder="Опишете ја локацијата поточно..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Incident date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Датум на инцидент / Incident Date (опционално)
          </label>
          <input
            type="datetime-local"
            value={form.incidentAt}
            onChange={(e) => set('incidentAt', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Anonymous */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.anonymousReport}
            onChange={(e) => set('anonymousReport', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">
            Анонимна пријава / Submit anonymously
          </span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {submitting ? 'Поднесување...' : 'Поднеси Пријава / Submit Report'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            Откажи / Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
