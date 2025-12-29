import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { registerSchema } from '@/utils/validationSchemas'
import { bloodGroups, genderOptions } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showDateField, setShowDateField] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const hasEverDonated = watch('hasEverDonated')

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register', {
        firstname: data.firstName,
        lastname: data.lastName,
        bloodgroup: data.bloodGroup,
        gender: data.gender,
        lastDonationDate: data.lastDonationDate || null,
        contactNumber: data.contactNumber,
        area: data.area,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: 'user', // default role
      })

      const response = res.data

      toast.success('Registration successful! Please login to continue.')
      
      // Redirect to login page instead of dashboard
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#fffaed] to-[#c74949] p-4">
      <div className="w-full max-w-5xl my-2">
        <div className="flex flex-col items-center mb-2">
          <Link to="/">
            <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-20 h-20 " />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Information Panel - Left Side */}
            <div className="bg-gradient-to-br from-[#8c1717] to-[#f45252] p-8 lg:p-12 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">Must Read before registration!</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>⚠️ <strong>Important Information for Blood Donors</strong></p>
                  <ul className="space-y-2 pl-1">
                    <li>• All provided information must be accurate and truthful.</li>
                    <li>• False information may result in removal and legal consequences.</li>
                    <li>• Must meet minimum health and eligibility requirements.</li>
                    <li>• Cannot donate with infectious diseases or unsafe health conditions.</li>
                    <li>• Consult a doctor if taking medication or undergoing treatment.</li>
                    <li>• You may be contacted for emergency blood requests.</li>
                    <li>• Contact details shared only for donation purposes per privacy policy.</li>
                    <li>• Account can be updated or deleted anytime.</li>
                    <li>• Platform misuse will result in permanent ban.</li>
                    <li>• Donors must meet receivers only at the hospital. Meeting anywhere else is prohibited and authorities will not be responsible.</li>
                  </ul><br></br>
                  <strong>Make sure to read all above this because these rules are crucial for your safety and the safety of others.</strong>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/login">
                  <Button className="bg-white text-[#a21c1c] hover:bg-gray-100 font-semibold px-8 py-2.5 rounded-lg">
                    Have An Account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Registration Form - Right Side */}
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-2 text-[#a21c1c] uppercase tracking-wide">REGISTER FORM</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your details to create your account.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <Label className="text-gray-700 text-sm font-medium">First Name</Label>
                    <Input
                      placeholder="First Name"
                      {...register('firstName')}
                      className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <Label className="text-gray-700 text-sm font-medium">Last Name</Label>
                    <Input
                      placeholder="Last Name"
                      {...register('lastName')}
                      className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Your Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email" 
                    {...register('email')} 
                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`} 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Blood Group & Gender */}
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <Label htmlFor="bloodGroup" className="text-gray-700 text-sm font-medium">Blood Group</Label>
                    <Select id="bloodGroup" {...register('bloodGroup')} className={`mt-1 ${errors.bloodGroup ? 'border-red-500' : ''}`}>
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </Select>
                    {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="gender" className="text-gray-700 text-sm font-medium">Gender</Label>
                    <Select id="gender" {...register('gender')} className={`mt-1 ${errors.gender ? 'border-red-500' : ''}`}>
                      <option value="">Select Gender</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                  </div>
                </div>

                {/* Previous donation */}
                <div>
                  <Label htmlFor="hasEverDonated" className="text-gray-700 text-sm font-medium">Have you ever given blood?</Label>
                  <Select
                    id="hasEverDonated"
                    {...register('hasEverDonated')}
                    onChange={(e) => setShowDateField(e.target.value === 'yes')}
                    className={`mt-1 ${errors.hasEverDonated ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                  {errors.hasEverDonated && <p className="text-red-500 text-xs mt-1">{errors.hasEverDonated.message}</p>}
                </div>

                {/* Conditional last donation date */}
                {(showDateField || hasEverDonated === 'yes') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Label htmlFor="lastDonationDate" className="text-gray-700 text-sm font-medium">Last Blood Donation Date</Label>
                    <Input id="lastDonationDate" type="date" {...register('lastDonationDate')} className="mt-1" />
                  </motion.div>
                )}

                {/* Contact Number */}
                <div>
                  <Label htmlFor="contactNumber" className="text-gray-700 text-sm font-medium">Contact Number</Label>
                  <Input 
                    id="contactNumber" 
                    placeholder="Contact Number" 
                    {...register('contactNumber')} 
                    className={`mt-1 ${errors.contactNumber ? 'border-red-500' : ''}`} 
                  />
                  {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
                </div>

                {/* Area */}
                <div>
                  <Label htmlFor="area" className="text-gray-700 text-sm font-medium">Area</Label>
                  <Input 
                    id="area" 
                    placeholder="Enter your Area" 
                    {...register('area')} 
                    className={`mt-1 ${errors.area ? 'border-red-500' : ''}`} 
                  />
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                </div>

                {/* Password & Confirm */}
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Password" 
                      {...register('password')} 
                      className={`mt-1 ${errors.password ? 'border-red-500' : ''}`} 
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm Password" 
                      {...register('confirmPassword')} 
                      className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`} 
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-[#a21c1c] border-gray-300 rounded focus:ring-[#a21c1c]"
                  />
                  <Label htmlFor="termsCheckbox" className="text-gray-700 text-sm font-medium cursor-pointer">
                    Yes, I agree with the terms and conditions
                  </Label>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-[#a21c1c] hover:bg-[#8c1717] text-white font-semibold py-2.5 rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isSubmitting || !termsAccepted}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
