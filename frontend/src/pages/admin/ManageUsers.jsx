import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users'
import { getSchools } from '../../api/schools'
import { getRoles } from '../../api/metadata'

const EMPTY = { firstName: '', lastName: '', email: '', password: '', schoolId: '', roleId: '', active: true }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [schools, setSchools] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () =>
    Promise.all([getUsers(), getSchools(), getRoles()])
      .then(([u, sc, r]) => { setUsers(u.data); setSchools(sc.data); setRoles(r.data) })
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ ...EMPTY, schoolId: schools[0]?.id?.toString() || '', roleId: roles[0]?.id?.toString() || '' })
    setEditing(null); setError(''); setShowModal(true)
  }

  const openEdit = (u) => {
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '',
      schoolId: u.schoolId?.toString(), roleId: u.roleId?.toString(), active: u.active })
    setEditing(u.id); setError(''); setShowModal(true)
  }

  const closeModal = () => setShowModal(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.schoolId || !form.roleId) {
      setError('Пополнете ги задолжителните полиња.')
      return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName, email: form.email,
        schoolId: parseInt(form.schoolId), roleId: parseInt(form.roleId),
        active: form.active,
        ...(form.password ? { password: form.password } : {}),
      }
      if (editing) {
        await updateUser(editing, payload)
      } else {
        if (!form.password) { setError('Лозинката е задолжителна.'); setSaving(false); return }
        await createUser({ ...payload, password: form.password })
      }
      await load()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Грешка при зачувување.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Избриши корисник?')) return
    try {
      await deleteUser(id)
      setUsers((u) => u.filter((x) => x.id !== id))
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Управувај Корисници / Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} корисници</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Назад</Link>
          <button
            onClick={openCreate}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            + Додај Корисник
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Вчитување...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Нема корисници.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Ime', 'Презиме', 'Е-маил', 'Улога', 'Училиште', 'Активен', 'Акции'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{u.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{u.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.roleName?.toUpperCase() === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>{u.roleName}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{u.schoolName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.active ? 'Да' : 'Не'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Уреди</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Избриши</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Уреди Корисник' : 'Додај Корисник'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={handleSave} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <F label="Ime *" value={form.firstName} onChange={(v) => set('firstName', v)} />
                  <F label="Презиме *" value={form.lastName} onChange={(v) => set('lastName', v)} />
                </div>
                <F label="Е-маил *" value={form.email} onChange={(v) => set('email', v)} type="email" />
                <F
                  label={editing ? 'Нова лозинка (остави празно за непроменета)' : 'Лозинка *'}
                  value={form.password} onChange={(v) => set('password', v)} type="password"
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Улога / Role *</label>
                  <select value={form.roleId} onChange={(e) => set('roleId', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Изберете улога...</option>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Училиште / School *</label>
                  <select value={form.schoolId} onChange={(e) => set('schoolId', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Изберете училиште...</option>
                    {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Активен корисник / Active user</span>
                </label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Откажи</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                    {saving ? 'Зачувување...' : 'Зачувај'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}
