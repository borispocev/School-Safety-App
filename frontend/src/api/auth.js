import axios from 'axios'
import api from './axios'

export const login = (email, password) => {
  const token = btoa(`${email}:${password}`)
  localStorage.setItem('authToken', token)
  return api.get('/auth/me')
}

export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => api.get('/auth/me')

export const register = (data) =>
  axios.post('/api/auth/register', data, { headers: { 'Content-Type': 'application/json' } })

export const applyAsStudent = (schoolId) =>
  api.post('/auth/apply-student', { schoolId })
