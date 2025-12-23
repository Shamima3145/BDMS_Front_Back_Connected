import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Droplet, Download, Filter, Eye } from 'lucide-react'
import DataTable from '@components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Select } from '@components/ui/Select'
import { formatDate } from '@utils/helpers'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import DonationHistoryPDF from '@components/pdf/DonationHistoryPDF'
import PDFPreviewModal from '@components/modals/PDFPreviewModal'

const UserDashboard = () => {
  const [filterYear, setFilterYear] = useState('all')
  const [donations, setDonations] = useState([])
  const [lastDonationDate, setLastDonationDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [totalDonations, setTotalDonations] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [exportLoading, setExportLoading] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pdfFileName, setPdfFileName] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const user = useSelector((state) => state.auth.user)

  // Fetch donations from API
  const fetchDonations = async (page = 1, perPageValue = perPage, year = filterYear) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPageValue.toString(),
      })
      
      if (year && year !== 'all') {
        params.append('year', year)
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/donations?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setDonations(response.data.data || [])
      setCurrentPage(response.data.current_page)
      setTotalDonations(response.data.total)
      setLastPage(response.data.last_page)
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast.error('Failed to load donation history')
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch last donation date from user data
  useEffect(() => {
    if (user?.lastDonationDate) {
      setLastDonationDate(user.lastDonationDate)
    } else {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          if (userData?.lastDonationDate) {
            setLastDonationDate(userData.lastDonationDate)
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }, [user])

  // Fetch donations on mount and when filters change
  useEffect(() => {
    fetchDonations(currentPage, perPage, filterYear)
  }, [currentPage, perPage, filterYear])

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage)
    }
  }

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value)
    setPerPage(newPerPage)
    setCurrentPage(1) // Reset to first page
  }

  const handleYearChange = (e) => {
    setFilterYear(e.target.value)
    setCurrentPage(1) // Reset to first page
  }

  const trackData = []

  const columns = [
    { header: 'Donation ID', accessor: 'id', className: 'font-semibold' },
    { header: 'Blood Group', accessor: 'blood' },
    { header: 'Units', accessor: 'units' },
    { header: 'Center', accessor: 'center' },
    { header: 'Status', accessor: 'status' },
    { header: 'Completion', accessor: 'completion' },
  ]

  const handleDownloadCertificate = (donation) => {
    toast.success(`Certificate for donation ${donation.id} downloaded!`)
  }

  const handleViewDetails = (donation) => {
    toast.info(`Viewing details for donation ${donation.id}`)
  }

  const handleExportHistory = async () => {
    try {
      setExportLoading(true)
      toast.info('Preparing PDF preview...')

      // Fetch ALL donations (not paginated) for export
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      if (filterYear && filterYear !== 'all') {
        params.append('year', filterYear)
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/donations?${params.toString()}&all=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const allDonations = response.data.data || []

      if (allDonations.length === 0) {
        toast.warning('No donation records to export')
        setExportLoading(false)
        return
      }

      // Get user info
      const userName = user?.firstname && user?.lastname 
        ? `${user.firstname} ${user.lastname}` 
        : 'N/A'
      const userEmail = user?.email || 'N/A'

      // Generate PDF document
      const pdfDoc = (
        <DonationHistoryPDF
          donations={allDonations}
          userName={userName}
          userEmail={userEmail}
          totalDonations={totalDonations}
          filterYear={filterYear}
        />
      )

      // Set the PDF document and filename
      setPdfDocument(pdfDoc)
      const fileName = filterYear && filterYear !== 'all'
        ? `donation-history-${filterYear}.pdf`
        : `donation-history-${new Date().getFullYear()}.pdf`
      setPdfFileName(fileName)

      // Show the preview modal
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

      // Generate blob from PDF document
      const blob = await pdf(pdfDocument).toBlob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = pdfFileName
      link.click()

      // Cleanup
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

  const getActions = (donation) => [
    {
      icon: Eye,
      onClick: () => handleViewDetails(donation),
      className: 'bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2',
      title: 'View Details',
    },
    {
      icon: Download,
      onClick: () => handleDownloadCertificate(donation),
      className: 'bg-green-500 hover:bg-green-600 text-white rounded-full p-2 disabled:opacity-50',
      title: 'Download Certificate',
      disabled: !donation.certificate,
    },
  ]

  // Calculate statistics
  const totalDonationsCount = donations.length
  const totalBlood = donations.reduce((acc, d) => acc + parseInt(d.units || 0), 0)
  const livesSaved = Math.floor(totalDonationsCount * 3) // Estimate: 1 donation saves 3 lives

  const stats = [
    {
      title: 'Total Donations',
      value: totalDonations,
      icon: Droplet,
      color: 'bg-red-500',
      description: 'All time',
    },
    {
      title: 'Blood Donated',
      value: `${totalBlood} units`,
      icon: Award,
      color: 'bg-blue-500',
      description: `${totalBlood * 450}ml total`,
    },
    {
      title: 'Lives Saved',
      value: `~${Math.floor(totalDonations * 3)}`,
      icon: Award,
      color: 'bg-green-500',
      description: 'Estimated impact',
    },
    {
      title: 'Last Donation',
      value: lastDonationDate ? formatDate(lastDonationDate) : 'No donation yet',
      icon: Calendar,
      color: 'bg-purple-500',
      description: lastDonationDate ? 'Most recent' : 'Ready to donate',
    },
  ]

  // Filter donations by year
  const filteredDonations = donations
  const availableYears = [...new Set(donations.map(d => new Date(d.donated_at).getFullYear()))].sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Donation History</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Track your life-saving contributions</p>
        </div>
        <Button 
          onClick={handleExportHistory} 
          disabled={exportLoading}
          className="bg-green-800 hover:bg-green-500 flex items-center gap-2 text-sm md:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="hidden sm:inline">{exportLoading ? 'Preparing...' : 'Export History'}</span>
          <span className="sm:hidden">{exportLoading ? '...' : 'Export'}</span>
        </Button>
      </motion.div>

      {/* Next Donation Eligibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {lastDonationDate ? (
          (() => {
            const lastDate = new Date(lastDonationDate)
            const today = new Date()
            const daysSinceLastDonation = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
            const daysUntilEligible = Math.max(0, 90 - daysSinceLastDonation)
            const isEligible = daysSinceLastDonation >= 90
            const eligibleDate = new Date(lastDate)
            eligibleDate.setDate(eligibleDate.getDate() + 90)

            return (
              <Card className={`bg-gradient-to-r ${isEligible ? 'from-green-50 to-teal-50 border-green-200' : 'from-orange-50 to-yellow-50 border-orange-200'}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className={`${isEligible ? 'bg-green-500' : 'bg-orange-500'} p-3 md:p-4 rounded-full text-white flex-shrink-0`}>
                      <Calendar size={24} className="md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">Next Donation Eligibility</h3>
                      {isEligible ? (
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                          <span className="font-semibold text-green-600">You are eligible to donate!</span> It has been {daysSinceLastDonation} days since your last donation.
                          Stay healthy and keep saving lives!
                        </p>
                      ) : (
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                          You can donate again in <span className="font-semibold text-orange-600">{daysUntilEligible} days</span> (on {formatDate(eligibleDate.toISOString())}).
                          You need to wait 90 days between donations.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()
        ) : (
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-green-500 p-3 md:p-4 rounded-full text-white flex-shrink-0">
                  <Calendar size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Next Donation Eligibility</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    <span className="font-semibold text-green-600">You are eligible to donate!</span> No previous donation record found.
                    Stay healthy and keep saving lives!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between h-full">
                      <p className="text-gray-600 text-xs font-medium">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`${stat.color} p-2 rounded-full text-white flex-shrink-0`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Donation History Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={trackData}
          columns={columns}
          searchPlaceholder="Search donations..."
          paginationColor="green"
        />
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

export default UserDashboard
