import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSchools, createSchool, updateSchool, deleteSchool } from '../../api/schools'

const EMPTY = {
  name: '', addressLine1: '', addressLine2: '', city: '',
  state: '', postalCode: '', country: 'Македонија', phoneNumber: '', email: '',
}

export default function ManageSchools() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () =>
    getSchools().then((r) => setSchools(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true) }
  const openEdit = (s) => { setForm({ ...s }); setEditing(s.id); setError(''); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.city || !form.country || !form.addressLine1) {
      setError('Пополнете ги задолжителните полиња.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await updateSchool(editing, form)
      } else {
        await createSchool(form)
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
    if (!window.confirm('Избриши училиште?')) return
    try {
      await deleteSchool(id)
      setSchools((s) => s.filter((x) => x.id !== id))
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Управувај Училишта / Manage Schools</h1>
          <p className="text-gray-500 text-sm mt-1">{schools.length} училишта</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Назад</Link>
          <button
            onClick={openCreate}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            + Додај Училиште
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Вчитување...</div>
        ) : schools.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Нема пронајдени училишта.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Име', 'Адреса', 'Град', 'Земја', 'Телефон', 'Е-маил', 'Акции'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{s.addressLine1}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.city}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.country}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.phoneNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Уреди</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Избриши</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Уреди Училиште' : 'Додај Ново Училиште'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</div>}
            <Field label="Ime / Name *" value={form.name} onChange={(v) => set('name', v)} />
            <Field label="Адреса 1 / Address Line 1 *" value={form.addressLine1} onChange={(v) => set('addressLine1', v)} />
            <Field label="Адреса 2 / Address Line 2" value={form.addressLine2} onChange={(v) => set('addressLine2', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Град / City *" value={form.city} onChange={(v) => set('city', v)} />
              <Field label="Поштенски Код / Postal Code" value={form.postalCode} onChange={(v) => set('postalCode', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Земја / Country *" value={form.country} onChange={(v) => set('country', v)} />
              <Field label="Регион / State" value={form.state} onChange={(v) => set('state', v)} />
            </div>
            <Field label="Телефон / Phone" value={form.phoneNumber} onChange={(v) => set('phoneNumber', v)} />
            <Field label="Е-маил / Email" value={form.email} onChange={(v) => set('email', v)} type="email" />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Откажи</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Зачувување...' : 'Зачувај'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
