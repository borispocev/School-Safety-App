import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSchools } from '../api/schools'
import { getReports } from '../api/reports'

const REPORT_TYPE_ICONS = {
  SPEEDING: '🚗',
  UNSAFE_CROSSWALK: '🚶',
  MISSING_SIGNAGE: '⚠️',
  POOR_LIGHTING: '💡',
  OTHER: '📋',
}

const SAFETY_TIPS = [
  {
    date: 'March 25, 2026',
    title: 'How to Stay Safe on Your Way to School',
    mk: 'Како да останете безбедни на патот до училиштата',
    icon: '🛡️',
  },
  {
    date: 'March 20, 2026',
    title: 'Recognizing and Reporting Bullying',
    mk: 'Препознавање и пријавување на малтретирање',
    icon: '👥',
  },
  {
    date: 'March 15, 2026',
    title: 'Emergency Contact Numbers',
    mk: 'Броеви за итни случаи',
    icon: '📞',
  },
  {
    date: 'March 10, 2026',
    title: 'School Safety Week Activities',
    mk: 'Активности за неделата на безбедност во училиштата',
    icon: '📋',
  },
]

export default function HomePage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [schools, setSchools] = useState([])
  const [reports, setReports] = useState([])
  const [loadingSchools, setLoadingSchools] = useState(true)

  useEffect(() => {
    getSchools()
      .then((res) => setSchools(res.data))
      .catch(() => {})
      .finally(() => setLoadingSchools(false))

    getReports()
      .then((res) => setReports(res.data.slice(0, 5)))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            SchoolSafety App
          </h1>
          <p className="text-blue-200 text-lg">
            Пријавете небезбедни ситуации во близина на вашето училиште
          </p>
          <p className="text-blue-300 text-sm mt-1">
            Report unsafe situations near your school
          </p>
          <Link
            to="/reports/new"
            className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-3 rounded-xl transition-colors text-sm"
          >
            + Пријави Проблем / Report a Problem
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Quick Report */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Quick Report / <span className="text-blue-700">Брза Пријава</span>
          </h2>
          <p className="text-gray-500 text-sm mb-5">Select the type of incident you want to report</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { code: 'SPEEDING', en: 'Speeding', mk: 'Брзо Возење', icon: '🚗' },
              { code: 'UNSAFE_CROSSWALK', en: 'Unsafe Crosswalk', mk: 'Небезбеден Пешачки Премин', icon: '🚶' },
              { code: 'MISSING_SIGNAGE', en: 'Missing Signage', mk: 'Недостаток на Сигнализација', icon: '⚠️' },
              { code: 'POOR_LIGHTING', en: 'Poor Lighting', mk: 'Лошо Осветлување', icon: '💡' },
              { code: 'OTHER', en: 'Other', mk: 'Друго', icon: '📋' },
            ].map((type) => (
              <button
                key={type.code}
                onClick={() => navigate('/reports/new')}
                className="bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-md rounded-xl p-5 flex flex-col items-center gap-2 transition-all"
              >
                <span className="text-3xl">{type.icon}</span>
                <span className="font-semibold text-gray-800 text-sm text-center">{type.en}</span>
                <span className="text-gray-400 text-xs text-center">{type.mk}</span>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/reports/new"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              ⓘ Submit Detailed Report / Поднеси Детална Пријава
            </Link>
          </div>
        </section>

        {/* Schools */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Schools in Skopje / <span className="text-blue-700">Училишта во Скопје</span>
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Click on any school to report an incident or view safety information
          </p>

          {loadingSchools ? (
            <div className="text-gray-400 text-sm">Вчитување на училишта...</div>
          ) : schools.length === 0 ? (
            <div className="text-gray-400 text-sm">Нема пронајдени училишта.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  onClick={() => navigate('/reports/new')}
                  className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl p-4 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-0.5">📍</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{school.name}</p>
                      <p className="text-gray-400 text-xs mt-1">{school.city}</p>
                      {school.addressLine1 && (
                        <p className="text-gray-400 text-xs">{school.addressLine1}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isAdmin() && (
            <div className="mt-4">
              <Link to="/admin/schools" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Управувај со училишта →
              </Link>
            </div>
          )}
        </section>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Reports / <span className="text-blue-700">Последни Пријави</span>
              </h2>
              <Link to="/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Прегледај ги сите →
              </Link>
            </div>
            <div className="space-y-3">
              {reports.map((r) => (
                <Link
                  key={r.id}
                  to={`/reports/${r.id}`}
                  className="block bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">{r.title}</span>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>📍 {r.schoolName}</span>
                        <span>📋 {r.reportTypeName}</span>
                      </div>
                    </div>
                    <StatusBadge status={r.reportStatusName} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Safety Tips */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Safety Tips & News / <span className="text-blue-700">Совети за Безбедност и Новости</span>
          </h2>
          <p className="text-gray-500 text-sm mb-5">Stay informed about school safety and learn how to protect yourself</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAFETY_TIPS.map((tip, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <span className="text-3xl">{tip.icon}</span>
                <p className="text-xs text-gray-400 mt-3">{tip.date}</p>
                <p className="font-semibold text-gray-800 text-sm mt-1">{tip.title}</p>
                <p className="text-gray-500 text-xs mt-1">{tip.mk}</p>
                <button className="text-blue-600 text-xs mt-3 font-medium hover:underline">Read More &rsaquo;</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
  }
  const key = status?.toUpperCase().replace(/\s/g, '_')
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[key] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
