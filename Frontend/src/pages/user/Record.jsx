import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Calendar, Eye, Download } from 'lucide-react'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Record = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [totalDonations, setTotalDonations] = useState(0)
  const [lastPage, setLastPage] = useState(1)
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
    toast.info(`Viewing details for donation ${donation.id}`)
  }

  const handleDownloadCertificate = (donation) => {
    toast.success(`Certificate for donation ${donation.id} downloaded!`)
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
    </div>
  )
}

export default Record
