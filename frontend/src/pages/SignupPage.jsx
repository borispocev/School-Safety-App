import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Лозинките не се совпаѓаат. / Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Лозинката мора да има најмалку 8 знаци. / Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      setSuccess(true)
    } catch (err) {
      const data = err.response?.data
      if (data?.validationErrors) {
        setError(Object.values(data.validationErrors).join(', '))
      } else {
        setError(data?.message || 'Грешка при регистрација. / Registration failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <span className="text-5xl">✅</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Успешна Регистрација!</h2>
          <p className="text-gray-600 text-sm mt-2">
            Вашиот акаунт е создаден. Можете да се најавите и потоа да се пријавите како ученик од вашиот профил.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Your account is ready. Log in and apply as a student from your profile.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Оди на Најава / Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-5xl">🛡️</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Создај Акаунт</h1>
          <p className="text-gray-500 text-sm mt-1">Create Account / SchoolSafety App</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 mb-5">
          Новите корисници добиваат улога <strong>USER</strong>. По регистрацијата можете да се пријавите како ученик од вашиот профил.
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ime / First Name *</label>
              <input
                type="text" required value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)} maxLength={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Марко"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Презиме / Last Name *</label>
              <input
                type="text" required value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)} maxLength={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Марковски"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Е-маил / Email *</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => set('email', e.target.value)} maxLength={150}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@primer.mk"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Лозинка / Password *</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => set('password', e.target.value)} minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Мин. 8 знаци"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Потврди Лозинка / Confirm Password *</label>
            <input
              type="password" required value={form.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="Повтори ја лозинката"
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Лозинките не се совпаѓаат.</p>
            )}
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
          >
            {submitting ? 'Регистрирање...' : 'Создај Акаунт / Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Веќе имате акаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Најавете се / Sign in</Link>
        </p>
      </div>
    </div>
  )
}
