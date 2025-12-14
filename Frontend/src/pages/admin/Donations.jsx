import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplet, Plus, Search, Calendar } from 'lucide-react'
import axios from 'axios'
import DataTable from '@components/DataTable'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Select } from '@components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card'
import { bloodGroups } from '@utils/constants'
import { toast } from 'react-toastify'

const Donations = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalDonations, setTotalDonations] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    dateTime: '',
    bloodGroup: '',
    units: 1,
    type: 'Whole Blood',
    centerName: '',
    status: 'Completed',
  })
  const [editingId, setEditingId] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchDonations()
  }, [currentPage, perPage, searchQuery])

  const fetchDonations = async () => {
    if (!token) return

    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/admin/donations?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      
      setDonations(response.data.data || [])
      setTotalDonations(response.data.total || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast.error('Failed to fetch donations')
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      userId: '',
      dateTime: '',
      bloodGroup: '',
      units: 1,
      type: 'Whole Blood',
      centerName: '',
      status: 'Completed',
    })
    setEditingId(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.userId) {
      toast.error('Please provide User ID')
      return
    }
    if (!formData.dateTime) {
      toast.error('Please provide donation date and time')
      return
    }
    if (!formData.bloodGroup) {
      toast.error('Please select a blood group')
      return
    }
    if (!formData.centerName) {
      toast.error('Please provide a donation center')
      return
    }

    try {
      const payload = {
        user_id: parseInt(formData.userId),
        donated_at: formData.dateTime,
        blood_group: formData.bloodGroup,
        units: parseInt(formData.units),
        type: formData.type,
        center_name: formData.centerName,
        status: formData.status,
      }

      if (editingId) {
        // Update existing donation
        await axios.patch(
          `http://127.0.0.1:8000/api/admin/donations/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        toast.success('Donation updated successfully!')
      } else {
        // Create new donation
        await axios.post(
          'http://127.0.0.1:8000/api/admin/donations',
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        toast.success('Donation recorded successfully!')
      }

      resetForm()
      fetchDonations()
    } catch (error) {
      console.error('Error saving donation:', error)
      toast.error(error.response?.data?.message || 'Failed to save donation')
    }
  }
  const handleEdit = (donation) => {
    setFormData({
      userId: donation.user_id?.toString() || '',
      dateTime: donation.donated_at?.slice(0, 16) || '', // Format: YYYY-MM-DDTHH:MM
      bloodGroup: donation.blood_group,
      units: donation.units,
      type: donation.type || 'Whole Blood',
      centerName: donation.center_name,
      status: donation.status,
    })
    setEditingId(donation.id)
    setIsModalOpen(true)
  }

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Donor', accessor: 'donor_name' },
    { header: 'Date', accessor: 'donated_at' },
    { header: 'Blood Group', accessor: 'blood_group' },
    { header: 'Units', accessor: 'units' },
    { header: 'Center', accessor: 'center_name' },
    { header: 'Status', accessor: 'status' },
  ]

  const getActions = (donation) => [
    {
      label: 'Edit',
      onClick: () => handleEdit(donation),
      variant: 'outline',
    },
  ]
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Droplet className="text-red-600" size={32} />
            Donations
          </h1>
          <p className="text-gray-600 mt-1">Manage and track blood donation records</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Donation
        </Button>
      </motion.div>

      {/* Donations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-red-600" size={20} />
              Recent Donations
            </CardTitle>
            <CardDescription>
              View and manage all donation records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by donor name, ID, center..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <DataTable
              data={donations}
              columns={columns}
              customActions={getActions}
              entriesPerPage={perPage}
              searchable={false}
              paginationColor="red"
            />

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading donations...</p>
              </div>
            )}

            {!loading && donations.length === 0 && (
              <div className="text-center py-8">
                <Droplet className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No donations found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="text-red-600" size={24} />
                  {editingId ? 'Edit Donation' : 'Record Donation'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="Enter user ID"
                    type="number"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    type="datetime-local"
                    required
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Units */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Units <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="units"
                    value={formData.units}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Type
                  </label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Plasma">Plasma</option>
                    <option value="Platelets">Platelets</option>
                    <option value="Double Red Cells">Double Red Cells</option>
                  </Select>
                </div>

                {/* Center Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="centerName"
                    value={formData.centerName}
                    onChange={handleInputChange}
                    placeholder="Enter center/hospital name"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Process">In Process</option>
                    <option value="Deferred">Deferred</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {editingId ? 'Update' : 'Save'} Donation
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Donations
