import { useState } from 'react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  Database, 
  Droplet, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'

const AdminLayout = () => {
  const [isRequestsOpen, setIsRequestsOpen] = useState(false)
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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/inventory', icon: Database, label: 'Inventory' },
    { path: '/admin/donors', icon: Users, label: 'Donors' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFFAEF] to-primary flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-10 h-10" />
          <span className="font-bold text-primary text-xl tracking-wide">
            BLOODBRIDGE  
          </span>
        </div>

        <div className="flex items-center gap-4 bg-white shadow px-5 py-2 rounded-xl">
          <span className="font-semibold text-primary">{user?.name || 'Admin'}</span>
          <Button
            size="sm"
            className="bg-[#942222] hover:bg-[#ed0000] flex items-center gap-2"
            onClick={handleLogout}
          >
            Logout <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 mx-auto w-full bg-white shadow-xl rounded-xl">
        {/* Sidebar */}
        <aside className="bg-primary text-white w-52 flex flex-col py-8 shadow-lg rounded-tr-3xl rounded-br-3xl">
          <nav className="flex flex-col gap-2 text-white px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl transition ${
                  isActive(item.path)
                    ? 'bg-white/20 font-bold shadow text-[#ffefef]'
                    : 'hover:bg-white/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            {/* Requests Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                className="flex items-center justify-between w-full gap-3 py-2 px-4 rounded-xl hover:bg-white/20"
              >
                <div className="flex items-center gap-3">
                  <Droplet className="w-5 h-5" />
                  Requests
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isRequestsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isRequestsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-1 overflow-hidden"
                  >
                    <Link
                      to="/admin/requests/public"
                      className={`block py-2 px-4 rounded-xl hover:bg-white/20 ${
                        isActive('/admin/requests/public') ? 'bg-white/20' : ''
                      }`}
                    >
                      Public
                    </Link>
                    <Link
                      to="/admin/requests/hospital"
                      className={`block py-2 px-4 rounded-xl hover:bg-white/20 ${
                        isActive('/admin/requests/hospital') ? 'bg-white/20' : ''
                      }`}
                    >
                      Hospitals
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
