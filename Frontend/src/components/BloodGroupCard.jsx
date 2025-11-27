import { Droplet } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/constants'

const BloodGroupCard = ({ bloodGroup, units, className }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[110px] shadow-md',
        className
      )}
    >
      <div className="flex gap-2 items-center mb-2">
        <span className="text-3xl font-semibold">{bloodGroup}</span>
        <Droplet className="w-6 h-6 text-[#f5222d] fill-[#f5222d]" />
      </div>
      <div className="text-lg font-bold text-[#23272f]">{units}</div>
    </motion.div>
  )
}

export default BloodGroupCard
