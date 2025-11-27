import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const TestimonialCard = ({ name, place, testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow flex flex-col items-center p-8 w-full md:w-1/3"
    >
      <span className="bg-[#942222] rounded-full p-3 mb-4">
        <User className="w-10 h-10 text-white" />
      </span>
      <span className="font-semibold text-xl text-[#942222] mb-1">{name}</span>
      <span className="text-[#942222] text-sm mb-1">{place}</span>
      <span className="text-[#942222] text-center">{testimonial}</span>
    </motion.div>
  )
}

export default TestimonialCard
