import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, Database, Droplet, LogOut } from 'lucide-react'
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
    { path: '/user/track', icon: Droplet, label: 'Track' },
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
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-white to-secondary flex justify-between items-center px-8 py-3 text-white">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-10 h-10" />
          <span className="font-bold text-green-800 text-xl tracking-wide">
            BLOODBRIDGE
          </span>
        </div>
        <div className="flex items-center gap-4 bg-white shadow px-5 py-2 rounded-xl">
          <span className="font-semibold text-secondary">{user?.name || 'User'}</span>
          <Button
            size="sm"
            className="bg-green-800 hover:bg-green-500 flex items-center gap-2"
            onClick={handleLogout}
          >
            Logout <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
      </header>

      <div className="flex flex-1 mx-auto w-full bg-gradient-to-br from-white to-green-100 shadow-xl rounded-xl">
        {/* Sidebar */}
        <aside className="w-52 flex flex-col py-8 shadow-lg rounded-tr-3xl rounded-br-3xl border-r border-green-700">
          <div className="mb-8 flex flex-col items-center text-center">
            <p className="font-bold mt-4 text-green-800">{getUserName()}</p>
            <p className="text-sm text-gray-500">{user?.email || 'iam@gmail.com'}</p>
          </div>
          <nav className="flex flex-col gap-2 text-green-700 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl transition ${
                  isActive(item.path)
                    ? 'bg-green-100/20 font-bold shadow text-green-800'
                    : 'hover:bg-green-100/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 py-10 px-10">
          <Outlet />
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default UserLayout
