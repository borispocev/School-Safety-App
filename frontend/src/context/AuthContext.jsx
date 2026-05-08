import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getCurrentUser, applyAsStudent as apiApplyAsStudent } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      setUser(JSON.parse(stored))
      getCurrentUser()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin(email, password)
    setUser(res.data)
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  const applyAsStudent = async (schoolId) => {
    const res = await apiApplyAsStudent(schoolId)
    setUser(res.data)
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  const isAdmin = () => user?.role?.toUpperCase() === 'ADMIN'
  const hasSchool = () => !!user?.schoolId

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, hasSchool, applyAsStudent }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
