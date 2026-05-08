import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🛡️</span>
            <span className="text-white font-bold">School Safety App</span>
          </div>
          <p className="text-sm text-gray-400">
            Making schools safer, one report at a time.
            <br />
            Да ги направиме училиштата побезбедни, со една пријава во исто време.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links / Брзи Линкови</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home / Дома</Link></li>
            <li><Link to="/reports" className="hover:text-white transition-colors">Reports / Пријави</Link></li>
            <li><Link to="/reports/new" className="hover:text-white transition-colors">Report Problem / Пријави Проблем</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us / Контакт</h3>
          <ul className="space-y-2 text-sm">
            <li>🚨 Итна помош / Emergency: <strong className="text-white">112</strong></li>
            <li>📧 info@schoolsafety.mk</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © 2026 SchoolSafety App — Тим 25, ФИНКИ, УКИМ
      </div>
    </footer>
  )
}
