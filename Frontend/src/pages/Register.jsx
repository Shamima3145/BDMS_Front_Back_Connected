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

      // Save token & user info in Redux
      dispatch(
        setCredentials({
          token: response.access_token,
          user: response.user,
          userType: response.userType,
        })
      )

      // Save in localStorage
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('userType', response.userType)

      toast.success('Registration successful!')

      // Redirect based on role
      if (response.userType === 'admin') navigate('/admin/dashboard')
      else navigate('/user/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#fffaed] to-[#c74949] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl my-8"
      >
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-20 h-20 mb-2" />
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#a21c1c]">Register</CardTitle>
            <CardDescription>Enter your details to create your account.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <div className="flex gap-3 mt-1">
                  <div className="w-1/2">
                    <Input
                      placeholder="First Name"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <Input
                      placeholder="Last Name"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
              </div>

              {/* Blood Group & Gender */}
              <div className="flex gap-3">
                <div className="w-1/2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select id="bloodGroup" {...register('bloodGroup')} className={errors.bloodGroup ? 'border-red-500' : ''}>
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </Select>
                  {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
                </div>
                <div className="w-1/2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" {...register('gender')} className={errors.gender ? 'border-red-500' : ''}>
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
              </div>

              {/* Previous donation */}
              <div>
                <Label htmlFor="hasEverDonated">Have you ever given blood?</Label>
                <Select
                  id="hasEverDonated"
                  {...register('hasEverDonated')}
                  onChange={(e) => setShowDateField(e.target.value === 'yes')}
                  className={errors.hasEverDonated ? 'border-red-500' : ''}
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
                {errors.hasEverDonated && <p className="text-red-500 text-sm mt-1">{errors.hasEverDonated.message}</p>}
              </div>

              {/* Conditional last donation date */}
              {(showDateField || hasEverDonated === 'yes') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Label htmlFor="lastDonationDate">Last Blood Donation Date</Label>
                  <Input id="lastDonationDate" type="date" {...register('lastDonationDate')} />
                </motion.div>
              )}

              {/* Contact Number */}
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" placeholder="Contact Number" {...register('contactNumber')} className={errors.contactNumber ? 'border-red-500' : ''} />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Area */}
              <div>
                <Label htmlFor="area">Area</Label>
                <Input id="area" placeholder="Enter your Area" {...register('area')} className={errors.area ? 'border-red-500' : ''} />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
              </div>

              {/* Password & Confirm */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500' : ''} />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full bg-[#a21c1c] hover:bg-[#8c1717]" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-sm text-gray-700 mt-4 text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#a21c1c] hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
