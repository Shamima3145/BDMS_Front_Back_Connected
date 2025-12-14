import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, Droplet, Settings, LogOut } from 'lucide-react'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/Button'
// import Footer from './Footer'
import { toast } from 'react-toastify'

const HospitalLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const menuItems = [
    { path: '/hospital/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/hospital/requests', icon: Droplet, label: 'Blood Requests' },
    { path: '/hospital/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  const getHospitalName = () => {
    if (!user) return 'Hospital'
    if (user.hospitalname) return user.hospitalname
    if (user.hospital_name) return user.hospital_name
    if (user.name) return user.name
    return 'Hospital'
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-bl from-[#E0F2FF] to-[#FFF8E7] overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-l from-[#E0F2FF] to-white flex justify-between items-center px-8 py-3 text-blue-900 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-10 h-10" />
          <span className="font-bold text-blue-800 text-xl tracking-wide">
            BLOODBRIDGE
          </span>
        </div>
        <div className="flex items-center gap-4 bg-white shadow px-5 py-2 rounded-xl">
          <span className="font-semibold text-blue-900">{user?.name || 'User'}</span>
          <Button
          size="sm"
          className="bg-[#0EA5E9] hover:bg-[#0284C7] flex items-center gap-2 shadow-md"
          onClick={handleLogout}
        >
          Logout <LogOut className="w-4 h-4" />
        </Button>
        </div>
        
      </header>

      <div className="flex flex-1 mx-auto w-full bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 flex flex-col py-8 bg-[#E0F2FF] border border-[#BAE6FD] shadow-lg rounded-tr-3xl rounded-br-3xl overflow-y-auto">
          <div className="mb-8 flex flex-col items-center text-center">
            <p className="font-bold mt-4 text-blue-800">{getHospitalName()}</p>
            <p className="text-sm text-gray-500">{user?.email || 'hospital@example.com'}</p>
          </div>
          <nav className="flex flex-col gap-2 text-blue-900 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl transition ${
                  isActive(item.path)
                    ? 'bg-white shadow font-bold text-[#0EA5E9]'
                    : 'hover:bg-white/70'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 py-10 px-10 overflow-y-auto">
          <Outlet />
        </section>
      </div>

    </div>
  )
}

export default HospitalLayout
