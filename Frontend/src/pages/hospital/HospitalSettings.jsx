import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setCredentials } from '@/store/slices/authSlice'
import * as yup from 'yup'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { passwordChangeSchema } from '@/utils/validationSchemas'

const hospitalInfoSchema = yup.object({
  hospitalName: yup.string().required('Hospital name is required'),
  registrationId: yup.string().required('Registration ID is required'),
  type: yup.string().required('Hospital type is required'),
  yearEstablished: yup.number().min(1800).max(2099).required('Year is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  district: yup.string().required('District is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contact: yup.string().required('Contact number is required'),
  emergency: yup.string(),
  hasBloodBank: yup.string().required('Please select an option'),
})

const HospitalSettings = () => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()

  const {
    register: registerHospital,
    handleSubmit: handleHospitalSubmit,
    formState: { errors: hospitalErrors, isSubmitting: isHospitalSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(hospitalInfoSchema),
    defaultValues: {
      hospitalName: user?.hospitalname || '',
      registrationId: user?.registrationid || '',
      type: user?.type || '',
      yearEstablished: user?.yearestablished || '',
      address: user?.address || '',
      city: user?.city || '',
      district: user?.district || '',
      email: user?.email || '',
      contact: user?.contact || user?.contactnumber || '',
      emergency: user?.emergency || '',
      hasBloodBank: user?.hasbloodbank || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordChangeSchema),
  })

  const hasBloodBank = watch('hasBloodBank')

  const onHospitalSubmit = async (data) => {
    try {
      // TODO: Backend route needed
      const response = await axios.put(
        'http://127.0.0.1:8000/api/hospital/profile',
        {
          hospitalname: data.hospitalName,
          registrationid: data.registrationId,
          type: data.type,
          yearestablished: data.yearEstablished,
          address: data.address,
          city: data.city,
          district: data.district,
          email: data.email,
          contact: data.contact,
          emergency: data.emergency,
          hasbloodbank: data.hasBloodBank,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const updatedUser = response.data.user
      dispatch(
        setCredentials({
          user: updatedUser,
          token: token,
          userType: localStorage.getItem('userType'),
        })
      )
      localStorage.setItem('user', JSON.stringify(updatedUser))

      toast.success('Hospital information updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update hospital information')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await axios.put(
        'http://127.0.0.1:8000/api/hospital/password',
        {
          current_password: data.currentPassword,
          new_password: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success('Password updated successfully!')
      resetPassword()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Hospital Information Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">Hospital Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHospitalSubmit(onHospitalSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    {...registerHospital('hospitalName')}
                    className={hospitalErrors.hospitalName ? 'border-red-500' : ''}
                  />
                  {hospitalErrors.hospitalName && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.hospitalName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registrationId">Registration ID</Label>
                  <Input
                    id="registrationId"
                    {...registerHospital('registrationId')}
                    className={hospitalErrors.registrationId ? 'border-red-500' : ''}
                  />
                  {hospitalErrors.registrationId && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.registrationId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Hospital Type</Label>
                  <Select
                    id="type"
                    {...registerHospital('type')}
                    className={hospitalErrors.type ? 'border-red-500' : ''}
                  >
                    <option value="">Select type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="NGO">NGO</option>
                    <option value="Clinic">Clinic</option>
                  </Select>
                  {hospitalErrors.type && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.type.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    {...registerHospital('yearEstablished')}
                    className={hospitalErrors.yearEstablished ? 'border-red-500' : ''}
                  />
                  {hospitalErrors.yearEstablished && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.yearEstablished.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...registerHospital('address')}
                  className={hospitalErrors.address ? 'border-red-500' : ''}
                />
                {hospitalErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{hospitalErrors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...registerHospital('city')}
                    className={hospitalErrors.city ? 'border-red-500' : ''}
                  />
                  {hospitalErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    id="district"
                    {...registerHospital('district')}
                    className={hospitalErrors.district ? 'border-red-500' : ''}
                  >
                    <option value="">Select District</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </Select>
                  {hospitalErrors.district && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.district.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Official Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerHospital('email')}
                  className={hospitalErrors.email ? 'border-red-500' : ''}
                />
                {hospitalErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{hospitalErrors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    {...registerHospital('contact')}
                    className={hospitalErrors.contact ? 'border-red-500' : ''}
                  />
                  {hospitalErrors.contact && (
                    <p className="text-red-500 text-sm mt-1">{hospitalErrors.contact.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="emergency">Emergency Hotline</Label>
                  <Input
                    id="emergency"
                    {...registerHospital('emergency')}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hasBloodBank">Has Blood Bank?</Label>
                <Select
                  id="hasBloodBank"
                  {...registerHospital('hasBloodBank')}
                  className={hospitalErrors.hasBloodBank ? 'border-red-500' : ''}
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
                {hospitalErrors.hasBloodBank && (
                  <p className="text-red-500 text-sm mt-1">{hospitalErrors.hasBloodBank.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-500"
                  disabled={isHospitalSubmitting}
                >
                  {isHospitalSubmitting ? 'Saving...' : 'Save all'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Update Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Password Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  {...registerPassword('currentPassword')}
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  {...registerPassword('newPassword')}
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <ul className="text-xs text-gray-500">
                <li>• At least 8 characters, up to 12</li>
                <li>• At least one lowercase & uppercase</li>
              </ul>

              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-400"
                disabled={isPasswordSubmitting}
              >
                {isPasswordSubmitting ? 'Saving...' : 'Save all'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default HospitalSettings
