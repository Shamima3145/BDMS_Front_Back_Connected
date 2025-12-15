import { useRoutes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import UserLayout from '@/layouts/UserLayout'
import HospitalLayout from '@/layouts/HospitalLayout'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import HospitalRegister from '@/pages/HospitalRegister'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import BloodInventory from '@/pages/admin/BloodInventory'
import PublicRequests from '@/pages/admin/PublicRequests'
import HospitalRequests from '@/pages/admin/HospitalRequests'
import Donors from '@/pages/admin/Donors'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'
import ManageUsers from '@/pages/admin/ManageUsers'
import Donations from '@/pages/admin/Donations'
import UserDashboard from '@/pages/user/UserDashboard'
import DonorHistory from '@/pages/user/DonationHistory'
import TrackDonation from '@/pages/user/Record'
import HospitalDashboard from '@/pages/hospital/HospitalDashboard'
import HospitalRequestsPage from '@/pages/hospital/HospitalRequests'
import HospitalSettings from '@/pages/hospital/HospitalSettings'

function App() {
  const dispatch = useDispatch()

  // Load token, userType, and user info from localStorage on app mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType') || 'user'
    const user = JSON.parse(localStorage.getItem('user'))

    if (token) {
      dispatch(
        setCredentials({
          token,
          userType,
          user,
        })
      )
    }
  }, [dispatch])

  const token = useSelector((state) => state.auth.token)
  const userType = useSelector((state) => state.auth.userType)

  // ProtectedRoute ensures only logged-in users with proper role can access routes
  const ProtectedRoute = ({ children, role }) => {
    if (!token) return <Navigate to="/login" replace />
    if (role && role !== userType) return <Navigate to="/" replace />
    return children
  }

  const routes = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [{ index: true, element: <LandingPage /> }],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/hospital-register', element: <HospitalRegister /> },
    {
      path: '/admin',
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'inventory', element: <BloodInventory /> },
        { path: 'requests/public', element: <PublicRequests /> },
        { path: 'requests/hospital', element: <HospitalRequests /> },
        { path: 'donors', element: <Donors /> },
        { path: 'donations', element: <Donations /> },
        { path: 'manage-users', element: <ManageUsers /> },
        { path: 'reports', element: <Reports /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
    {
      path: '/user',
      element: (
        <ProtectedRoute role="user">
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/user/dashboard" replace /> },
        { path: 'dashboard', element: <UserDashboard /> },
        { path: 'history', element: <DonorHistory /> },
        { path: 'track', element: <TrackDonation /> },
      ],
    },
    {
      path: '/hospital',
      element: (
        <ProtectedRoute role="hospital">
          <HospitalLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/hospital/dashboard" replace /> },
        { path: 'dashboard', element: <HospitalDashboard /> },
        { path: 'requests', element: <HospitalRequestsPage /> },
        { path: 'settings', element: <HospitalSettings /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ])

  useEffect(() => {
    document.title = 'BloodBridge - Blood Donation Management System'
  }, [])

  return <div className="min-h-screen bg-gray-50">{routes}</div>
}

export default App
