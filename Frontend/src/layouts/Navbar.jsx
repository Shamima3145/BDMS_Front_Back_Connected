import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const Navbar = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all bg-gradient-to-r from-[#FFFAEF] via-[#fce9e9] to-[#FFFAEF]
        ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <nav className="max-w-full md:max-w-[1200px] mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              className="w-10 h-10"
              src="/assets/logo.png"
              alt="logo"
            />
            <span className="text-primary font-bold text-xl hidden md:block">BloodBridge</span>
          </Link>

          {/* Navigation Links */}
          <ul className="flex flex-wrap justify-center items-center gap-2">
            <li className="text-primary px-3 py-1 font-medium hover:bg-primary/10 rounded-3xl transition">
              <a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a>
            </li>
            <li className="text-primary px-3 py-1 font-medium hover:bg-primary/10 rounded-3xl transition">
              <a href="#about" onClick={(e) => scrollToSection(e, '#about')}>About</a>
            </li>
            <li className="text-primary px-3 py-1 font-medium hover:bg-primary/10 rounded-3xl transition">
              <a href="#services" onClick={(e) => scrollToSection(e, '#services')}>Service</a>
            </li>
            <li className="text-primary px-3 py-1 font-medium hover:bg-primary/10 rounded-3xl transition">
              <a href="#donors" onClick={(e) => scrollToSection(e, '#donors')}>Donors</a>
            </li>
          </ul>

          {/* Search Bar */}
          {/* <div className="flex items-center bg-white rounded-3xl px-3 py-1.5 w-full md:w-48">
            <Search className="text-primary w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none text-primary ml-2 w-full border-0 p-0 h-auto focus-visible:ring-0 text-sm"
            />
          </div> */}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="relative inline-block text-left">
              <Button
                variant="outline"
                className="border-2 border-primary px-4 py-1 rounded-3xl text-primary bg-transparent hover:scale-105 transition hover:bg-primary/10 text-sm"
                onClick={() => setIsSignupOpen(!isSignupOpen)}
              >
                Sign Up <ChevronDown className="ml-1 h-4 w-4" />
              </Button>

              <AnimatePresence>
                {isSignupOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsSignupOpen(false)}
                      >
                        User
                      </Link>
                      <Link
                        to="/hospital-register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsSignupOpen(false)}
                      >
                        Hospital
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/login">
              <Button className="border-2 border-primary px-4 py-1 rounded-3xl bg-primary text-white hover:scale-105 transition text-sm">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Navbar
