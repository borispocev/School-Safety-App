import api from './axios'

export const getReports = () => api.get('/reports')
export const getReport = (id) => api.get(`/reports/${id}`)
export const createReport = (data) => api.post('/reports', data)
export const updateReport = (id, data) => api.put(`/reports/${id}`, data)
export const deleteReport = (id) => api.delete(`/reports/${id}`)
export const getReportImages = (reportId) => api.get(`/reports/${reportId}/images`)
export const addReportImage = (reportId, data) => api.post(`/reports/${reportId}/images`, data)
