import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import ReportDetailPage from './pages/ReportDetailPage'
import CreateReportPage from './pages/CreateReportPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageReports from './pages/admin/ManageReports'
import ManageSchools from './pages/admin/ManageSchools'
import ManageUsers from './pages/admin/ManageUsers'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout><HomePage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><ReportsPage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports/new" element={
            <ProtectedRoute>
              <Layout><CreateReportPage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports/:id" element={
            <ProtectedRoute>
              <Layout><ReportDetailPage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <Layout><AdminDashboard /></Layout>
            </AdminRoute>
          } />

          <Route path="/admin/reports" element={
            <AdminRoute>
              <Layout><ManageReports /></Layout>
            </AdminRoute>
          } />

          <Route path="/admin/schools" element={
            <AdminRoute>
              <Layout><ManageSchools /></Layout>
            </AdminRoute>
          } />

          <Route path="/admin/users" element={
            <AdminRoute>
              <Layout><ManageUsers /></Layout>
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
