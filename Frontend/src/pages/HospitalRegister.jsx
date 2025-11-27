import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

import { hospitalRegisterSchema } from '@/utils/validationSchemas'
import { hospitalTypes, districts, bloodGroups } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const HospitalRegister = () => {
  const navigate = useNavigate()
  const [showBloodGroups, setShowBloodGroups] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(hospitalRegisterSchema),
  })

  const hasBloodBank = watch('hasBloodBank')

  const onSubmit = async (data) => {
    try {
      const payload = {
        hospitalName: data.hospitalName,
        registrationId: data.registrationId,
        hospitalType: data.hospitalType,
        yearEstablished: data.yearEstablished,
        address: data.address,
        city: data.city,
        district: data.district,
        email: data.email,
        contactNumber: data.contactNumber,
        emergencyHotline: data.emergencyHotline || null,
        hasBloodBank: data.hasBloodBank,
        availableBloodGroups: data.availableBloodGroups || [],
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: 'hospital',
      }

      await axios.post("http://127.0.0.1:8000/api/hospital-register", payload)

      toast.success("Hospital registration successful! Please login.")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#fffaed] to-primary p-4">
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
            <CardTitle className="text-2xl font-semibold text-primary">Hospital Registration</CardTitle>
            <CardDescription>Enter your hospital details to register</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Hospital Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hospital Name</Label>
                  <Input {...register('hospitalName')} className={errors.hospitalName ? 'border-red-500' : ''} />
                  {errors.hospitalName && <p className="text-red-500 text-sm">{errors.hospitalName.message}</p>}
                </div>
                <div>
                  <Label>Registration ID</Label>
                  <Input {...register('registrationId')} className={errors.registrationId ? 'border-red-500' : ''} />
                  {errors.registrationId && <p className="text-red-500 text-sm">{errors.registrationId.message}</p>}
                </div>
              </div>

              {/* Type & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hospital Type</Label>
                  <Select {...register('hospitalType')} className={errors.hospitalType ? 'border-red-500' : ''}>
                    <option value="">Select Type</option>
                    {hospitalTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                  {errors.hospitalType && <p className="text-red-500 text-sm">{errors.hospitalType.message}</p>}
                </div>
                <div>
                  <Label>Year Established</Label>
                  <Input type="number" {...register('yearEstablished')} className={errors.yearEstablished ? 'border-red-500' : ''} />
                  {errors.yearEstablished && <p className="text-red-500 text-sm">{errors.yearEstablished.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <Input {...register('address')} className={errors.address ? 'border-red-500' : ''} />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>

              {/* City & District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input {...register('city')} className={errors.city ? 'border-red-500' : ''} />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>
                <div>
                  <Label>District</Label>
                  <Select {...register('district')} className={errors.district ? 'border-red-500' : ''}>
                    <option value="">Select District</option>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                  {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact Number</Label>
                  <Input {...register('contactNumber')} className={errors.contactNumber ? 'border-red-500' : ''} />
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
                </div>
                <div>
                  <Label>Emergency Hotline</Label>
                  <Input {...register('emergencyHotline')} />
                </div>
              </div>

              {/* Blood Bank */}
              <div>
                <Label>Has Blood Bank?</Label>
                <Select
                  {...register('hasBloodBank')}
                  onChange={(e) => setShowBloodGroups(e.target.value === 'yes')}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </div>

              {/* Conditional Blood Groups */}
              <AnimatePresence>
                {(showBloodGroups || hasBloodBank === 'yes') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Label>Available Blood Groups</Label>
                    <Select multiple {...register('availableBloodGroups')} className="h-32">
                      {bloodGroups.map((g) => <option key={g}>{g}</option>)}
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Password</Label>
                  <Input type="password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input type="password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500' : ''} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-[#8f2929]" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>

            </form>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default HospitalRegister
