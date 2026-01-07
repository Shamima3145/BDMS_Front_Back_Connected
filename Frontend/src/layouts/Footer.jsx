import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = ({ bgColor = 'bg-secondary' }) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`${bgColor} text-white mt-0 py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="BloodBridge Logo"
                className="w-12 h-12 rounded-lg bg-white p-1"
              />
              <span className="font-bold text-xl tracking-wide">BloodBridge</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your premier blood donation platform connecting donors with those in need, saving lives through dedication and excellence.
            </p>
          </div>

          {/* Design and Developed by */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide">Design and Developed by</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              <h2 className="font-bold">Shamima Akter Eti</h2> Department of CSE <br></br> International University of Business Agriculture and Technology (IUBAT)
            </p>
          </div>
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@bloodbridge.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="tel:+8801234567890" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +880 123 456 7890
                </a>
              </li>
            </ul>
          </div>

          {/* Technology partner */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide">Technology Partner</h3>
              <img
                src="/assets/codetree_logo.png"
                alt="Codetree Logo"
                className="w-32 h-auto bg-white p-1"
              />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} BloodBridge. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
