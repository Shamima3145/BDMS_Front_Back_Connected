import { motion } from 'framer-motion'
import { cn } from '@/utils/constants'

const StatCard = ({ icon: Icon, title, value, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white rounded-lg p-6 shadow flex items-center gap-4',
        className
      )}
    >
      {Icon && <Icon className="w-6 h-6 text-[#0052cc]" />}
      <div>
        <div className="text-sm text-gray-700">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </motion.div>
  )
}

export default StatCard
