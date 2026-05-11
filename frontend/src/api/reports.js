import api from './axios'

export const getReports = () => api.get('/reports')
export const getReport = (id) => api.get(`/reports/${id}`)
export const createReport = (data) => api.post('/reports', data)
export const updateReport = (id, data) => api.put(`/reports/${id}`, data)
export const deleteReport = (id) => api.delete(`/reports/${id}`)
export const getReportImages = (reportId) => api.get(`/reports/${reportId}/images`)
export const addReportImage = (reportId, data) => api.post(`/reports/${reportId}/images`, data)
export async function exportReportsCsv() {
    const response = await api.get('/reports/export/csv', {
        responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'school_safety_reports.csv')
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
}
export function getReportStatistics() {
    return api.get('/reports/statistics')
}