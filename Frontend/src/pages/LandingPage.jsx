import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Droplet, Calendar, ClipboardCheck, BookOpen, UserPlus, Stethoscope, Coffee, HeartHandshake, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import BloodRequestModal from '@/components/BloodRequestModal'
import { useState, useEffect } from 'react'
import axios from 'axios'

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [donors, setDonors] = useState([])
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null)
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const steps = [
    {
      number: 1,
      title: 'Register',
      description:
        'Sign up online and schedule an appointment at your nearest blood center or hospital.',
      icon: <UserPlus className="w-12 h-12 text-primary" />,
    },
    {
      number: 2,
      title: 'Health Check',
      description:
        'A thorough health checkup to make sure everything is safe and suitable for you today.',
      icon: <Stethoscope className="w-12 h-12 text-primary" />,
    },
    {
      number: 3,
      title: 'Donate Blood',
      description:
        'The donation process takes just a few minutes and is completely safe for everyone.',
      icon: <Droplet className="w-12 h-12 text-primary fill-primary" />,
    },
    {
      number: 4,
      title: 'Refresh and Recover',
      description:
        'Relax comfortably and enjoy tasty snacks and refreshing drinks after your donation.',
      icon: <Coffee className="w-12 h-12 text-primary" />,
    },
  ]

  const services = [
    {
      title: 'Make an appointment',
      description: 'Register yourself and select nearby hospital for donation.',
      icon: <Calendar className="w-12 h-12 text-white" />,
      bgColor: 'bg-secondary',
      btnColor: 'text-white',
      iconBg: 'bg-[#3A8971]',
    },
    {
      title: 'Learn about donation',
      description: 'Learn about every step for your simple blood donation process.',
      icon: <BookOpen className="w-12 h-12 text-[#1C0F4A]" />,
      bgColor: 'bg-[#99CEF9]',
      btnColor: 'text-[#1C0F4A]',
      iconBg: 'bg-[#DDF1FF]',
    },
    {
      title: 'Are you eligible?',
      description: 'Find out the eligibility criteria before you donate blood.',
      icon: <ClipboardCheck className="w-12 h-12 text-secondary" />,
      bgColor: 'bg-[#FFC269]',
      btnColor: 'text-secondary',
      iconBg: 'bg-[#FFEFD9]',
    },
  ]

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleBloodGroupClick = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroup)
    setIsDonorModalOpen(true)
  }

  const getFilteredDonors = () => {
    if (!selectedBloodGroup) return []
    return donors.filter(donor => donor.bloodgroup === selectedBloodGroup)
  }

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/donors')
        console.log('Donors fetched:', response.data)
        setDonors(response.data.slice(0, 6)) // Show only 6 donors
      } catch (error) {
        console.error('Error fetching donors:', error)
      }
    }
    fetchDonors()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#FFFAEF]" id="home">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="py-8 bg-gradient-to-br from-[#FFF0C9] to-[#E6F5FF] max-w-full sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1200px] rounded-3xl mx-auto shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 px-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl text-[#D40200] leading-tight">
                Give Bloods
              </h1>
              <h1 className="font-semibold text-6xl sm:text-7xl md:text-8xl text-[#D40200] leading-tight">
                Save Lives.
              </h1>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] shadow-2xl rounded-3xl overflow-hidden"
            >
              <img
                className="h-full w-full object-cover rounded-3xl"
                src="/assets/R.jpg"
                alt="Blood Donation"
              />
            </motion.div>
          </div>

          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 mt-6 max-w-full sm:max-w-[600px] md:max-w-[1000px] mx-auto px-4"
          >
            <h1 className="text-primary text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-center md:text-left">
              Your blood donation can give someone another <br />
              chance at life. Be the reason someone smiles today.
            </h1>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#D40200] hover:bg-[#A61C1C] px-5 py-2 rounded-3xl text-white transition-all duration-300 flex items-center gap-2"
              >
                <HeartHandshake size={20} />
                Request Blood
              </Button>
            </div>
          </motion.section>
        </motion.section>
      </div>

      {/* About How it Works */}
      <section className="bg-[#FFFAEF]" id="about">
        <section className="pt-8 mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-[#942222] mb-9"
          >
            About how it works
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="bg-secondary text-white px-4 py-2 rounded-full">
                  {step.number}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                  <h1 className="mb-4 text-primary font-semibold text-2xl">
                    {step.title}
                  </h1>
                  <p className="font-medium text-[#848181]">{step.description}</p>
                </div>
                <div className="hidden md:flex bg-[#FFD7D7] rounded-full p-6">
                  {step.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Services */}
        <div id="services" className="mt-32">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-[#942222] mb-9"
          >
            How to get our services?
          </motion.h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-5 px-4 pb-12"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`${service.bgColor} rounded-xl shadow-lg px-4 py-8 w-full sm:w-72 flex flex-col items-center`}
            >
              <span className={`rounded-full px-5 py-3 mb-4 ${service.iconBg}`}>
                {service.icon}
              </span>
              <span className={`font-bold ${service.btnColor} text-lg mb-1`}>
                {service.title}
              </span>
              <span className={`text-md mb-4 ${service.btnColor} text-center`}>
                {service.description}
              </span>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className={`border-2 ${index === 0 ? 'border-white' : 'border-white'} px-5 py-1 rounded-3xl bg-white ${index === 0 ? 'text-secondary hover:bg-secondary hover:text-white' : service.btnColor + (index === 1 ? ' hover:bg-[#1C0F4A] hover:text-white' : ' hover:bg-secondary hover:text-white')} transition-all duration-300 font-bold`}
                >
                  {index === 0 ? 'Donate Now' : index === 1 ? 'Learn More' : 'Eligibility'}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Available Donors */}
      <section
        id="donors"
        className="py-12 bg-gradient-to-t from-secondary via-[#cbead7] to-[#FFFAEF]"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-[#942222] mb-9"
        >
          Available Donors
        </motion.h2>

        <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {bloodGroups.map((bloodGroup, index) => {
            const donorCount = donors.filter(d => d.bloodgroup === bloodGroup).length
            return (
              <motion.div
                key={bloodGroup}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => handleBloodGroupClick(bloodGroup)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 flex flex-col items-center min-w-[160px]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-3xl font-bold text-[#942222]">
                    {bloodGroup}
                  </h3>
                  <Droplet className="w-6 h-6 text-[#942222] fill-[#942222]" />
                </div>
                <p className="text-gray-700 text-2xl font-semibold">
                  {donorCount}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Donor List Modal */}
      {isDonorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsDonorModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="bg-[#942222] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-[#942222] fill-[#942222]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedBloodGroup} Blood Group</h2>
                  <p className="text-sm opacity-90">{getFilteredDonors().length} Available Donors</p>
                </div>
              </div>
              <button
                onClick={() => setIsDonorModalOpen(false)}
                className="text-white hover:bg-white hover:text-[#942222] rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {getFilteredDonors().length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg">No donors available for {selectedBloodGroup} blood group</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredDonors().map((donor, index) => (
                    <motion.div
                      key={donor.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#942222] rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#942222] text-lg truncate">
                            {donor.firstname} {donor.lastname}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{donor.area}</p>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-[#942222] flex-shrink-0" />
                            <span className="text-sm">{donor.contactNumber}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Blood Request Modal */}
      <BloodRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default LandingPage
