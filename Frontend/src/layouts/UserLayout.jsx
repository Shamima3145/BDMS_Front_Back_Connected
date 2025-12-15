import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, Database, FileText, LogOut } from 'lucide-react'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/Button'
import Footer from './Footer'
import { toast } from 'react-toastify'

const UserLayout = () => {
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
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/history', icon: Database, label: 'History' },
    { path: '/user/track', icon: FileText, label: 'Records' },
  ]

  const isActive = (path) => location.pathname === path

  // Get user display name
  const getUserName = () => {
    if (!user) return 'John Doe'
    if (user.name) return user.name
    if (user.firstname || user.lastname) {
      return `${user.firstname || ''} ${user.lastname || ''}`.trim()
    }
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
    return 'John Doe'
  }

  return (
    <div className="h-screen flex flex-col bg-green-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-white to-secondary flex justify-between items-center px-4 md:px-8 py-3 text-white flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-bold text-green-800 text-lg md:text-xl tracking-wide">
            BLOODBRIDGE
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 bg-white shadow px-3 md:px-5 py-2 rounded-xl">
          <span className="font-semibold text-secondary text-sm md:text-base hidden sm:inline">{user?.name || 'User'}</span>
          <Button
            size="sm"
            className="bg-green-800 hover:bg-green-500 flex items-center gap-2"
            onClick={handleLogout}
          >
            Logout <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
      </header>

      <div className="flex flex-1 mx-auto w-full max-w-full bg-gradient-to-br from-white to-green-100 shadow-none rounded-none md:rounded-xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 md:w-52 flex-shrink-0 flex flex-col py-4 md:py-8 shadow-lg rounded-tr-3xl rounded-br-3xl border-r border-green-700 overflow-y-auto">
          <div className="mb-4 md:mb-8 flex flex-col items-center text-center px-2">
            <p className="font-bold mt-4 text-green-800 text-xs md:text-base hidden md:block">{getUserName()}</p>
            <p className="text-xs text-gray-500 hidden md:block">{user?.email || 'iam@gmail.com'}</p>
          </div>
          <nav className="flex flex-col gap-2 text-green-700 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center md:justify-start gap-3 py-2 px-2 md:px-4 rounded-xl transition ${
                  isActive(item.path)
                    ? 'bg-green-100/20 font-bold shadow text-green-800'
                    : 'hover:bg-green-100/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 py-4 px-3 md:py-10 md:px-10 overflow-y-auto">
          <Outlet />
        </section>
      </div>

      
    </div>
  )
}

export default UserLayout
