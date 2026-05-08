import api from './axios'

export const getReportStatuses = () => api.get('/report-metadata/statuses')
export const getReportTypes = () => api.get('/report-metadata/types')
export const getRoles = () => api.get('/roles')
