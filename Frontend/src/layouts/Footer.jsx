import { motion } from 'framer-motion'

const Footer = ({ bgColor = 'bg-secondary' }) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`${bgColor} text-white mt-0 py-8`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center px-4 sm:px-6 gap-5 md:gap-0">
        {/* logo and name */}
        <div className="flex items-center gap-3 mb-6 md:mb-0 justify-center">
          <img
            src="/assets/logo.png"
            alt="BloodBridge Logo"
            className="w-10 h-10 rounded-lg bg-white p-1"
          />
          <span className="font-bold text-lg tracking-wide">BLOODBRIDGE</span>
        </div>

        {/* copyright */}
        <div className="order-3 md:order-none mt-6 md:mt-0 text-center text-sm text-white opacity-70 px-2 md:px-6">
          © {new Date().getFullYear()} BloodBridge. All rights reserved.
        </div>

        {/* contact */}
        <div className="flex flex-col items-center">
          <span className="font-bold">Contact Us</span>
          <a href="mailto:info@bloodbridge.com" className="text-sm hover:underline">
            info@bloodbridge.com
          </a>
          <a href="tel:+1234567890" className="text-sm hover:underline">
            +123 456 7890
          </a>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
