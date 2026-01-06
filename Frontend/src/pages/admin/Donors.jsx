import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Phone, Mail, Calendar, Droplet, User, MapPin, Filter, Download, MessageSquare } from 'lucide-react'
import axios from 'axios'
import DataTable from '@components/DataTable'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Select } from '@components/ui/Select'
import { bloodGroups } from '@utils/constants'
import { toast } from 'react-toastify'
import { pdf } from '@react-pdf/renderer'
import DonorListPDF from '@components/pdf/DonorListPDF'
import PDFPreviewModal from '@components/modals/PDFPreviewModal'

const Donors = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pdfFileName, setPdfFileName] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  // Use token from localStorage (saved after login)
  const token = localStorage.getItem('token')

  // Fetch donors from backend
  useEffect(() => {
    const fetchDonors = async () => {
      if (!token) return

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDonors(response.data.users)
        setLoading(false)
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch donors. Please check your login.')
        setLoading(false)
      }
    }

    fetchDonors()
  }, [token])

  const columns = [
    { header: 'Donor ID', accessor: 'id' },
    { header: 'Email', accessor: 'email' },
    { header: 'Blood Group', accessor: 'bloodgroup', className: 'font-extrabold text-red-600' },
    { header: 'Contact', accessor: 'contactNumber' },
    { header: 'Location', accessor: 'area' },
    { header: 'Gender', accessor: 'gender' },
  ]

  const handleContact = (donor) => {
    toast.info(`Contacting ${donor.firstname} ${donor.lastname} at ${donor.contactNumber}`)
  }

  const handleSendSMS = (donor) => {
    // Format phone number for WhatsApp (remove any special characters and spaces)
    const phoneNumber = donor.contactNumber?.replace(/[^0-9]/g, '')
    
    if (!phoneNumber) {
      toast.error('No contact number available for this donor')
      return
    }
    
    // Prepare WhatsApp message
    const message = `Hello ${donor.firstname} ${donor.lastname},

We are reaching out from Blood Donation Management System.

Thank you for being a registered blood donor. Your willingness to donate blood saves lives!

If you have any questions or would like to schedule a donation, please let us know.

Best regards,
BDMS Team`

    // WhatsApp URL format: https://wa.me/PHONENUMBER?text=MESSAGE
    // For Bangladesh, add country code 880 if not already present
    const formattedNumber = phoneNumber.startsWith('880') ? phoneNumber : `880${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    toast.success(`Opening WhatsApp for ${donor.firstname} ${donor.lastname}`)
  }

  const handleSendEmail = async (donor) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        'http://127.0.0.1:8000/api/admin/send-email',
        {
          donor_id: donor.id,
          subject: 'Thank You for Being a Blood Donor',
          message: `Dear ${donor.firstname} ${donor.lastname},\n\nWe want to express our sincere gratitude for being a registered blood donor with us.\n\nYour willingness to donate blood is truly life-saving. Every donation you make has the potential to save up to three lives.\n\nWe appreciate your commitment to this noble cause and look forward to your continued support.\n\nThank you for making a difference!\n\nBest regards,\nBlood Donation Management System Team`
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data.success) {
        toast.success(`Email sent successfully to ${donor.firstname} ${donor.lastname}`)
      } else {
        toast.error('Failed to send email')
      }
    } catch (error) {
      console.error('Email error:', error)
      toast.error('Failed to send email: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleExport = async () => {
    try {
      setExportLoading(true)
      toast.info('Preparing PDF preview...')

      if (filteredDonors.length === 0) {
        toast.warning('No donors to export')
        setExportLoading(false)
        return
      }

      const totalDonors = donors.length
      const eligibleDonors = donors.filter((d) => {
        if (!d.lastDonationDate) return true
        const last = new Date(d.lastDonationDate)
        const today = new Date()
        const months = (today - last) / (1000 * 60 * 60 * 24 * 30)
        return months >= 4
      }).length
      const uniqueBloodGroups = new Set(donors.map((d) => d.bloodgroup)).size

      // Determine filter applied
      let filterApplied = ''
      if (selectedBloodGroup !== 'all') filterApplied += `Blood Group: ${selectedBloodGroup}`
      if (selectedStatus !== 'all') filterApplied += (filterApplied ? ', ' : '') + `Status: ${selectedStatus}`
      if (searchQuery) filterApplied += (filterApplied ? ', ' : '') + `Search: ${searchQuery}`

      const pdfDoc = (
        <DonorListPDF
          donors={filteredDonors}
          totalDonors={totalDonors}
          eligibleDonors={eligibleDonors}
          bloodGroups={uniqueBloodGroups}
          filterApplied={filterApplied || 'None'}
        />
      )

      setPdfDocument(pdfDoc)
      setPdfFileName(`donor-list-${new Date().toISOString().split('T')[0]}.pdf`)
      setShowPDFModal(true)
      toast.success('PDF preview ready!')
    } catch (error) {
      console.error('Error preparing PDF:', error)
      toast.error('Failed to prepare PDF preview')
    } finally {
      setExportLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      toast.info('Downloading PDF...')

      const blob = await pdf(pdfDocument).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = pdfFileName
      link.click()
      URL.revokeObjectURL(url)

      toast.success('PDF downloaded successfully!')
      setShowPDFModal(false)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClosePDFModal = () => {
    setShowPDFModal(false)
    setPdfDocument(null)
    setPdfFileName('')
  }

  const getActions = (donor) => [
    { 
      icon: MessageSquare,
      onClick: () => handleSendSMS(donor), 
      className: 'bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2',
      title: 'Send SMS'
    },
    { 
      icon: Mail,
      onClick: () => handleSendEmail(donor), 
      className: 'bg-green-500 hover:bg-green-600 text-white rounded-xl p-2',
      title: 'Send Email'
    },
  ]

  // Filter donors
  const filteredDonors = donors.filter((donor) => {
    const fullName = `${donor.firstname} ${donor.lastname}`.toLowerCase()

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      donor.contactNumber?.includes(searchQuery) ||
      donor.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBloodGroup =
      selectedBloodGroup === 'all' || donor.bloodgroup === selectedBloodGroup

    const isEligible = () => {
      if (!donor.lastDonationDate) return true
      const last = new Date(donor.lastDonationDate)
      const today = new Date()
      const months = (today - last) / (1000 * 60 * 60 * 24 * 30)
      return months >= 4
    }

    const status = isEligible() ? 'active' : 'inactive'
    const matchesStatus =
      selectedStatus === 'all' || selectedStatus.toLowerCase() === status

    return matchesSearch && matchesBloodGroup && matchesStatus
  }).map((donor) => {
    const isEligible = !donor.lastDonationDate || 
      (new Date() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24 * 30) >= 4
    
    return {
      ...donor,
      eligibilityStatus: isEligible ? '✓ Eligible' : 'Not Eligible',
      isEligible
    }
  })

  const stats = [
    { label: 'Total Donors', value: donors.length, icon: User, color: 'bg-blue-500' },
    {
      label: 'Eligible Now',
      value: donors.filter((d) => {
        if (!d.lastDonationDate) return true
        const last = new Date(d.lastDonationDate)
        const today = new Date()
        const months = (today - last) / (1000 * 60 * 60 * 24 * 30)
        return months >= 4
      }).length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    { label: 'Blood Groups', value: new Set(donors.map((d) => d.bloodgroup)).size, icon: Filter, color: 'bg-red-500' },
    { label: 'Total Registered', value: donors.length, icon: Droplet, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Donor Management</h1>
        <Button 
          onClick={handleExport} 
          disabled={exportLoading}
          className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          {exportLoading ? 'Preparing...' : 'Export List'}
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Donors</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by name, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <Select value={selectedBloodGroup} onChange={(e) => setSelectedBloodGroup(e.target.value)}>
              <option value="all">All Blood Groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Donors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Loading donors...</p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No donors found</p>
          </div>
        ) : (
          <DataTable
            data={filteredDonors}
            columns={columns}
            customActions={getActions}
            searchable={false}
            paginationColor="red"
          />
        )}
      </motion.div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFModal}
        onClose={handleClosePDFModal}
        pdfDocument={pdfDocument}
        fileName={pdfFileName}
        onDownload={handleDownloadPDF}
        isDownloading={isDownloading}
      />
    </div>
  )
}

export default Donors
