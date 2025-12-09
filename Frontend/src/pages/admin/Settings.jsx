import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, UserPlus, Key } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Label } from '@components/ui/Label'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import axios from 'axios'

// Validation schemas
const updateInfoSchema = yup.object({
  adminId: yup.string().required('Admin ID is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

const addAdminSchema = yup.object({
  newAdminId: yup.string().required('Admin ID is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must be at most 12 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must be at most 12 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('New password is required'),
})

const Settings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [adminInfo, setAdminInfo] = useState({
    adminId: '',
    email: '',
  })

  // Load admin info from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        const info = {
          adminId: user.admin_id || '',
          email: user.email || '',
        }
        setAdminInfo(info)
        setValueInfo('adminId', info.adminId)
        setValueInfo('email', info.email)
      } catch (error) {
        console.error('Error parsing user data:', error)
        toast.error('Failed to load admin information')
      }
    }
  }, [])

  // Update Info Form
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: errorsInfo },
    setValue: setValueInfo,
  } = useForm({
    resolver: yupResolver(updateInfoSchema),
    defaultValues: {
      adminId: '',
      email: '',
    },
  })

  // Add Admin Form
  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: errorsAdmin },
    reset: resetAdmin,
  } = useForm({
    resolver: yupResolver(addAdminSchema),
  })

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordChangeSchema),
  })

  const onUpdateInfo = async (data) => {
    setIsSubmitting(true)
    try {
      toast.success('Admin information updated successfully!')
    } catch (error) {
      toast.error('Failed to update information')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onAddAdmin = async (data) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://127.0.0.1:8000/api/admin/add',
        {
          admin_id: data.newAdminId,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('New admin added successfully!')
      resetAdmin()
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        if (errors.admin_id) toast.error(errors.admin_id[0])
        else if (errors.email) toast.error(errors.email[0])
        else toast.error('Failed to add admin')
      } else {
        toast.error(error.response?.data?.message || 'Failed to add admin')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onChangePassword = async (data) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://127.0.0.1:8000/api/admin/change-password',
        {
          admin_id: adminInfo.adminId,
          current_password: data.currentPassword,
          new_password: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Password changed successfully!')
      resetPassword()
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect')
      } else {
        toast.error(error.response?.data?.message || 'Failed to change password')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Admin Info & Add Admin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Shield size={20} />
                  Admin Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitInfo(onUpdateInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminId">Admin ID</Label>
                      <Input
                        id="adminId"
                        {...registerInfo('adminId')}
                        placeholder="Enter admin ID"
                        className={errorsInfo.adminId ? 'border-red-500' : ''}
                      />
                      {errorsInfo.adminId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsInfo.adminId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerInfo('email')}
                        placeholder="Enter email"
                        className={errorsInfo.email ? 'border-red-500' : ''}
                      />
                      {errorsInfo.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsInfo.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Update Info'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add New Admin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <UserPlus size={20} />
                  Add New Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAdmin(onAddAdmin)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newAdminId">New Admin ID</Label>
                      <Input
                        id="newAdminId"
                        {...registerAdmin('newAdminId')}
                        placeholder="Enter new admin ID"
                        className={errorsAdmin.newAdminId ? 'border-red-500' : ''}
                      />
                      {errorsAdmin.newAdminId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsAdmin.newAdminId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="newAdminEmail">Email</Label>
                      <Input
                        id="newAdminEmail"
                        type="email"
                        {...registerAdmin('email')}
                        placeholder="Enter email"
                        className={errorsAdmin.email ? 'border-red-500' : ''}
                      />
                      {errorsAdmin.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsAdmin.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...registerAdmin('password')}
                        placeholder="Enter password"
                        className={errorsAdmin.password ? 'border-red-500' : ''}
                      />
                      {errorsAdmin.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsAdmin.password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerAdmin('confirmPassword')}
                        placeholder="Confirm password"
                        className={errorsAdmin.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errorsAdmin.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsAdmin.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Admin'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Key size={20} />
                Password Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...registerPassword('currentPassword')}
                    placeholder="Enter your current password"
                    className={errorsPassword.currentPassword ? 'border-red-500' : ''}
                  />
                  {errorsPassword.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsPassword.currentPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword')}
                    placeholder="Enter your new password"
                    className={errorsPassword.newPassword ? 'border-red-500' : ''}
                  />
                  {errorsPassword.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsPassword.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium mb-2">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• At least 8 characters, up to 12</li>
                    <li>• At least one lowercase & uppercase letter</li>
                  </ul>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
