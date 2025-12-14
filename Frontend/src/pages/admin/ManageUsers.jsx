import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Eye, Edit, Trash2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import DataTable from '@/components/DataTable'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import axios from 'axios'

// Validation schema for public user
const publicUserSchema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contactNumber: yup.string().required('Contact number is required'),
  bloodgroup: yup.string().required('Blood group is required'),
  gender: yup.string().required('Gender is required'),
  area: yup.string().required('Area is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

// Validation schema for hospital
const hospitalSchema = yup.object({
  hospitalName: yup.string().required('Hospital name is required'),
  registrationId: yup.string().required('Registration ID is required'),
  hospitalType: yup.string().required('Hospital type is required'),
  yearEstablished: yup.number().required('Year established is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  district: yup.string().required('District is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contactNumber: yup.string().required('Contact number is required'),
  hasBloodBank: yup.string().required('Blood bank availability is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const ManageUsers = () => {
  const [userType, setUserType] = useState('user') // 'user' or 'hospital'
  const [users, setUsers] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(userType === 'user' ? publicUserSchema : hospitalSchema),
  })

  useEffect(() => {
    fetchUsers()
    fetchHospitals()
  }, [])

  useEffect(() => {
    reset()
  }, [userType, reset])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Transform data to add full name
      const usersData = (response.data.users || []).map(user => ({
        ...user,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim()
      }))
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem('token')
      // Assuming there's an endpoint for hospitals
      const response = await axios.get('http://127.0.0.1:8000/api/admin/hospitals', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHospitals(response.data.hospitals || [])
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const endpoint = userType === 'user' ? '/api/register' : '/api/hospital-register'
      
      await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        ...data,
        password_confirmation: data.password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(`${userType === 'user' ? 'User' : 'Hospital'} added successfully!`)
      reset()
      setIsModalOpen(false)
      
      if (userType === 'user') {
        fetchUsers()
      } else {
        fetchHospitals()
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || `Failed to add ${userType}`
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleView = (item) => {
    toast.info(`Viewing ${userType === 'user' ? 'user' : 'hospital'}: ${item.email}`)
  }

  const handleEdit = (item) => {
    toast.info(`Edit functionality for ${item.email}`)
  }

  const handleDelete = (item) => {
    toast.warning(`Delete functionality for ${item.email}`)
  }

  const userColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Email', accessor: 'email' },
    { header: 'Blood Group', accessor: 'bloodgroup' },
    { header: 'Contact', accessor: 'contactNumber' },
    { header: 'Area', accessor: 'area' },
  ]

  const hospitalColumns = [
    { header: 'Hospital Name', accessor: 'hospitalName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Type', accessor: 'hospitalType' },
    { header: 'City', accessor: 'city' },
    { header: 'Contact', accessor: 'contactNumber' },
  ]

  const getActions = (item) => [
    {
      label: <Eye size={14} />,
      onClick: () => handleView(item),
      variant: 'default',
      className: 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1',
    },
    {
      label: <Edit size={14} />,
      onClick: () => handleEdit(item),
      variant: 'default',
      className: 'bg-green-500 hover:bg-green-600 text-white px-2 py-1',
    },
    {
      label: <Trash2 size={14} />,
      onClick: () => handleDelete(item),
      variant: 'default',
      className: 'bg-red-500 hover:bg-red-600 text-white px-2 py-1',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Manage Users
        </motion.h1>

        {/* Add User Buttons - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={() => {
              setUserType('user')
              setIsModalOpen(true)
            }}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-primary to-red-600 text-white shadow-md flex items-center gap-2 text-sm"
          >
            <UserPlus size={16} />
            <span>Add Public User</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserType('hospital')
              setIsModalOpen(true)
            }}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md flex items-center gap-2 text-sm"
          >
            <UserPlus size={16} />
            <span>Add Hospital</span>
          </button>
        </motion.div>
      </div>

      {/* Modal for Add User/Hospital Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                <UserPlus size={20} />
                Add {userType === 'user' ? 'Public User' : 'Hospital'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {userType === 'user' ? (
                // Public User Form
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        {...register('firstname')}
                        placeholder="Enter first name"
                        className={errors.firstname ? 'border-red-500' : ''}
                      />
                      {errors.firstname && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        {...register('lastname')}
                        placeholder="Enter last name"
                        className={errors.lastname ? 'border-red-500' : ''}
                      />
                      {errors.lastname && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter email"
                        autoComplete="off"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        {...register('contactNumber')}
                        placeholder="Enter contact number"
                        className={errors.contactNumber ? 'border-red-500' : ''}
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bloodgroup">Blood Group</Label>
                      <Select
                        id="bloodgroup"
                        {...register('bloodgroup')}
                        className={errors.bloodgroup ? 'border-red-500' : ''}
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Select>
                      {errors.bloodgroup && (
                        <p className="text-red-500 text-sm mt-1">{errors.bloodgroup.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        id="gender"
                        {...register('gender')}
                        className={errors.gender ? 'border-red-500' : ''}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        {...register('area')}
                        placeholder="Enter area"
                        className={errors.area ? 'border-red-500' : ''}
                      />
                      {errors.area && (
                        <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // Hospital Form
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hospitalName">Hospital Name</Label>
                      <Input
                        id="hospitalName"
                        {...register('hospitalName')}
                        placeholder="Enter hospital name"
                        className={errors.hospitalName ? 'border-red-500' : ''}
                      />
                      {errors.hospitalName && (
                        <p className="text-red-500 text-sm mt-1">{errors.hospitalName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="registrationId">Registration ID</Label>
                      <Input
                        id="registrationId"
                        {...register('registrationId')}
                        placeholder="Enter registration ID"
                        className={errors.registrationId ? 'border-red-500' : ''}
                      />
                      {errors.registrationId && (
                        <p className="text-red-500 text-sm mt-1">{errors.registrationId.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="hospitalType">Hospital Type</Label>
                      <Select
                        id="hospitalType"
                        {...register('hospitalType')}
                        className={errors.hospitalType ? 'border-red-500' : ''}
                      >
                        <option value="">Select type</option>
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Semi-Government">Semi-Government</option>
                      </Select>
                      {errors.hospitalType && (
                        <p className="text-red-500 text-sm mt-1">{errors.hospitalType.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        {...register('yearEstablished')}
                        placeholder="Enter year"
                        className={errors.yearEstablished ? 'border-red-500' : ''}
                      />
                      {errors.yearEstablished && (
                        <p className="text-red-500 text-sm mt-1">{errors.yearEstablished.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="Enter address"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="Enter city"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        {...register('district')}
                        placeholder="Enter district"
                        className={errors.district ? 'border-red-500' : ''}
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter email"
                        autoComplete="off"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        {...register('contactNumber')}
                        placeholder="Enter contact number"
                        className={errors.contactNumber ? 'border-red-500' : ''}
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="hasBloodBank">Has Blood Bank</Label>
                      <Select
                        id="hasBloodBank"
                        {...register('hasBloodBank')}
                        className={errors.hasBloodBank ? 'border-red-500' : ''}
                      >
                        <option value="">Select option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                      {errors.hasBloodBank && (
                        <p className="text-red-500 text-sm mt-1">{errors.hasBloodBank.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : `Add ${userType === 'user' ? 'User' : 'Hospital'}`}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users/Hospitals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users size={20} />
              {userType === 'user' ? 'Registered Users' : 'Registered Hospitals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <DataTable
                data={userType === 'user' ? users : hospitals}
                columns={userType === 'user' ? userColumns : hospitalColumns}
                customActions={getActions}
                searchable={false}
                paginationColor="blue"
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ManageUsers
