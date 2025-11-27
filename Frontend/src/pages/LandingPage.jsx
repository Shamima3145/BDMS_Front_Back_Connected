import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Droplet, Calendar, ClipboardCheck, BookOpen, UserPlus, Stethoscope, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import TestimonialCard from '@/components/TestimonialCard'

const LandingPage = () => {
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
      description: 'Donating blood is safe and easy. Find out the eligibility criteria.',
      icon: <ClipboardCheck className="w-12 h-12 text-secondary" />,
      bgColor: 'bg-[#FFC269]',
      btnColor: 'text-secondary',
      iconBg: 'bg-[#FFEFD9]',
    },
  ]

  const testimonials = [
    {
      name: 'John Doe',
      place: 'Dhaka',
      testimonial:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: 'Jane Smith',
      place: 'Chittagong',
      testimonial:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: 'Mike Johnson',
      place: 'Sylhet',
      testimonial:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ]

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
              <Link to="/login">
                <Button className="bg-secondary px-5 py-2 rounded-3xl text-white hover:scale-110 transition-transform">
                  Donate Now
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-2 border-primary px-5 py-2 rounded-3xl text-primary hover:scale-110 transition-transform"
              >
                Learn More
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
                  className={`border-2 ${index === 0 ? 'border-white' : 'border-white'} px-5 py-1 rounded-3xl bg-white ${index === 0 ? 'text-secondary' : service.btnColor} hover:scale-110 font-bold`}
                >
                  {index === 0 ? 'Donate Now' : index === 1 ? 'Learn More' : 'Eligibility'}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-12 bg-gradient-to-t from-secondary via-[#cbead7] to-[#FFFAEF]"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-[#942222] mb-9"
        >
          Testimonials
        </motion.h2>

        <div className="max-w-[1240px] mx-auto flex flex-wrap justify-center gap-4 px-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default LandingPage
