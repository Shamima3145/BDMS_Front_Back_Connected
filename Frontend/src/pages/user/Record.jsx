import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Calendar, Eye, Download, X } from 'lucide-react'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal, ModalHeader, ModalContent, ModalTitle } from '@/components/ui/Modal'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import CertificatePDF from '@/components/CertificatePDF'

const Record = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [totalDonations, setTotalDonations] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const user = useSelector((state) => state.auth.user)

  // Fetch donations from API
  const fetchDonations = async (page = 1, perPageValue = perPage) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPageValue.toString(),
      })

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
      toast.error('Failed to load donations')
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch donations on mount
  useEffect(() => {
    fetchDonations(currentPage, perPage)
  }, [currentPage, perPage])

  const trackData = []
  const filteredDonations = donations

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation)
    setIsModalOpen(true)
  }

  const handleShowCertificate = (donation) => {
    setSelectedDonation(donation)
    setIsCertificateModalOpen(true)
  }

  const handleDownloadCertificate = async () => {
    try {
      // Get user's full name from Redux state
      const userName = user?.name || 'Donor Name'
      
      toast.info('Generating certificate...')
      
      // Generate PDF blob
      const blob = await pdf(
        <CertificatePDF 
          userName={userName}
        />
      ).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${selectedDonation?.id || 'donation'}-${userName.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100)
      
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Failed to generate certificate: ' + error.message)
    }
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
      onClick: () => handleShowCertificate(donation),
      className: 'bg-green-500 hover:bg-green-600 text-white rounded-full p-2',
      title: 'Download Certificate',
    },
  ]

  const columns = [
    { header: 'Donation ID', accessor: 'id' },
    { 
      header: 'Date & Time', 
      accessor: 'donated_at',
      render: (value) => {
        const date = new Date(value)
        const dateStr = date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        })
        const timeStr = date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
        return `${dateStr}|${timeStr}`
      }
    },
    { header: 'Blood Group', accessor: 'blood_group' },
    { header: 'Units Donated', accessor: 'units' },
    { header: 'Donation Type', accessor: 'type' },
    { header: 'Donation Center', accessor: 'center_name' },
    { header: 'Status', accessor: 'status' },
  ]

  const handleRefresh = () => {
    toast.info('Refreshing donation status...')
    fetchDonations(currentPage, perPage)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-green-800"
        >
          Donation Records
        </motion.h1>
        <Button
          onClick={handleRefresh}
          className="bg-green-700 hover:bg-green-600 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-transparent border-0">
          <CardContent className="px-0">
            <DataTable
              data={filteredDonations}
              columns={columns}
              customActions={getActions}
              entriesPerPage={perPage}
              searchable={false}
              paginationColor="gray"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* View Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <ModalHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <ModalTitle className="text-2xl font-bold text-green-800">
              Donation Details
            </ModalTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </ModalHeader>
        <ModalContent className="pt-4">
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Donation ID</p>
                  <p className="text-base text-gray-900">{selectedDonation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Blood Group</p>
                  <p className="text-base text-red-600 font-bold">{selectedDonation.blood_group}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Date & Time</p>
                  <p className="text-base text-gray-900">
                    {new Date(selectedDonation.donated_at).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                    {' | '}
                    {new Date(selectedDonation.donated_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Units Donated</p>
                  <p className="text-base text-gray-900">{selectedDonation.units}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Donation Type</p>
                  <p className="text-base text-gray-900">{selectedDonation.type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <p className="text-base">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedDonation.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      selectedDonation.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      selectedDonation.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedDonation.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-span-2 pt-2">
                <p className="text-sm font-semibold text-gray-600">Donation Center</p>
                <p className="text-base text-gray-900">{selectedDonation.center_name}</p>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Certificate Preview Modal */}
      <Modal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)} className="max-w-4xl">
        <ModalHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <ModalTitle className="text-2xl font-bold text-green-800">
              Certificate of Appreciation
            </ModalTitle>
            <button
              onClick={() => setIsCertificateModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </ModalHeader>
        <ModalContent className="pt-4">
          {selectedDonation && (
            <div className="space-y-6">
              {/* Certificate Preview */}
              <div className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: '70.7%' }}>
                  <div className="absolute inset-0" style={{ backgroundColor: '#F5F1E8' }}>
                    {/* Border */}
                    <div className="absolute inset-4 md:inset-6" style={{ border: '3px solid #C8B091' }}>
                      <div className="absolute inset-2" style={{ border: '1px solid #C8B091' }}>
                        
                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center px-8 md:px-16 py-8">
                          {/* Certificate Title - Curved */}
                          <div className="text-center mb-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.3em] text-gray-800 mb-2" style={{ letterSpacing: '0.2em' }}>
                              CERTIFICATE
                            </h1>
                            <p className="text-sm md:text-base tracking-[0.3em] text-gray-700 font-serif mb-2">
                              OF COMPLETION
                            </p>
                            <p className="text-xs md:text-sm italic text-gray-600 font-serif">
                              proudly presented to
                            </p>
                          </div>
                          
                          {/* Name */}
                          <div className="my-8 md:my-12 text-center">
                            <p className="text-3xl md:text-4xl lg:text-5xl font-['Brush_Script_MT',cursive] text-gray-700 mb-4">
                              {user?.name || 'Donor Name'}
                            </p>
                            <div className="w-64 md:w-80 lg:w-96 mx-auto border-b border-gray-400"></div>
                          </div>
                          
                          {/* Description */}
                          <div className="text-center mt-6 md:mt-8">
                            <p className="text-sm md:text-base italic text-gray-600 font-serif">
                              for completing the Blood Donation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleDownloadCertificate}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-8 py-3 text-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Certificate
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Record
