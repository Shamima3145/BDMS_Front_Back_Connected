import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setCredentials } from '@/store/slices/authSlice'
import { profileUpdateSchema, passwordChangeSchema } from '@/utils/validationSchemas'
import { bloodGroups, genderOptions } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const UserSettings = () => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstname || '',
      lastName: user?.lastname || '',
      bloodGroup: user?.bloodgroup || 'A+',
      gender: user?.gender || 'Male',
      area: user?.area || '',
      contactNumber: user?.contactnumber || user?.contact || '',
      email: user?.email || '',
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

  const onProfileSubmit = async (data) => {
    try {
     
      const response = await axios.put(
        'http://127.0.0.1:8000/api/user/profile',
        {
          firstname: data.firstName,
          lastname: data.lastName,
          bloodgroup: data.bloodGroup,
          gender: data.gender,
          area: data.area,
          contactNumber: data.contactNumber,
          email: data.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Update user in Redux store and localStorage
      const updatedUser = response.data.user
      dispatch(
        setCredentials({
          user: updatedUser,
          token: token,
          userType: localStorage.getItem('userType'),
        })
      )
      localStorage.setItem('user', JSON.stringify(updatedUser))

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
     
      await axios.put(
        'http://127.0.0.1:8000/api/user/password',
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
      {/* General Information Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800">General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...registerProfile('firstName')}
                    className={profileErrors.firstName ? 'border-gray-500' : ''}
                  />
                  {profileErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...registerProfile('lastName')}
                    className={profileErrors.lastName ? 'border-gray-500' : ''}
                  />
                  {profileErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    id="bloodGroup"
                    {...registerProfile('bloodGroup')}
                    className={profileErrors.bloodGroup ? 'border-gray-500' : ''}
                  >
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Select>
                  {profileErrors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.bloodGroup.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    id="gender"
                    {...registerProfile('gender')}
                    className={profileErrors.gender ? 'border-gray-500' : ''}
                  >
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {profileErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.gender.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    {...registerProfile('area')}
                    className={profileErrors.area ? 'border-gray-500' : ''}
                  />
                  {profileErrors.area && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.area.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact</Label>
                  <Input
                    id="contactNumber"
                    {...registerProfile('contactNumber')}
                    className={profileErrors.contactNumber ? 'border-gray-500' : ''}
                  />
                  {profileErrors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.contactNumber.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerProfile('email')}
                    className={profileErrors.email ? 'border-gray-500' : ''}
                  />
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                  )}
                </div>
                {/* <div>
                  <Label>Total Donations</Label>
                  <Input value="0" readOnly className="bg-gray-100" />
                </div> */}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-800 hover:bg-green-500"
                  disabled={isProfileSubmitting}
                >
                  {isProfileSubmitting ? 'Saving...' : 'Save all'}
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
            <CardTitle className="text-lg text-green-800">Password Information</CardTitle>
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
                  className={passwordErrors.currentPassword ? 'border-gray-500' : ''}
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
                  className={passwordErrors.newPassword ? 'border-gray-500' : ''}
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
                className="w-full bg-green-800 hover:bg-green-400"
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

export default UserSettings
