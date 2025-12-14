import { Navigate } from 'react-router-dom'
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
import AdminHospitalRequests from '@/pages/admin/HospitalRequests'
import Donors from '@/pages/admin/Donors'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'
import ManageUsers from '@/pages/admin/ManageUsers'
import Donations from '@/pages/admin/Donations'
import UserDashboard from '@/pages/user/UserDashboard'
import DonorHistory from '@/pages/user/DonorHistory'
import TrackDonation from '@/pages/user/TrackDonation'
import HospitalDashboard from '@/pages/hospital/HospitalDashboard'
import HospitalRequests from '@/pages/hospital/HospitalRequests'
import HospitalSettings from '@/pages/hospital/HospitalSettings'

const AppRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/hospital-register',
    element: <HospitalRegister />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'inventory', element: <BloodInventory /> },
      { path: 'requests/public', element: <PublicRequests /> },
      { path: 'requests/hospital', element: <AdminHospitalRequests /> },
      { path: 'donors', element: <Donors /> },
      { path: 'donations', element: <Donations /> },
      { path: 'manage-users', element: <ManageUsers /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'history', element: <DonorHistory /> },
      { path: 'track', element: <TrackDonation /> },
    ],
  },
  {
    path: '/hospital',
    element: <HospitalLayout />,
    children: [
      { index: true, element: <Navigate to="/hospital/dashboard" replace /> },
      { path: 'dashboard', element: <HospitalDashboard /> },
      { path: 'requests', element: <HospitalRequests /> },
      { path: 'settings', element: <HospitalSettings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

export default AppRoutes
