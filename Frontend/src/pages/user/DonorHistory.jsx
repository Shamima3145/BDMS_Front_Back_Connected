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

const DonorHistory = () => {
  const [filterYear, setFilterYear] = useState('all')
  const [donations, setDonations] = useState([])
  const [lastDonationDate, setLastDonationDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [totalDonations, setTotalDonations] = useState(0)
  const [lastPage, setLastPage] = useState(1)
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

  const handleDownloadCertificate = (donation) => {
    toast.success(`Certificate for donation ${donation.id} downloaded!`)
  }

  const handleViewDetails = (donation) => {
    toast.info(`Viewing details for donation ${donation.id}`)
  }

  const handleExportHistory = () => {
    toast.success('Donation history exported successfully!')
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
          <h1 className="text-3xl font-bold text-gray-800">My Donation History</h1>
          <p className="text-gray-600 mt-1">Track your life-saving contributions</p>
        </div>
        <Button onClick={handleExportHistory} className="bg-green-800 hover:bg-green-500 flex items-center gap-2">
          <Download size={18} />
          Export History
        </Button>
      </motion.div>

      {/* Statistics Cards */}
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

      {/* Next Donation Eligibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${isEligible ? 'bg-green-500' : 'bg-orange-500'} p-4 rounded-full text-white`}>
                      <Calendar size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Next Donation Eligibility</h3>
                      {isEligible ? (
                        <p className="text-gray-600 mt-1">
                          <span className="font-semibold text-green-600">You are eligible to donate!</span> It has been {daysSinceLastDonation} days since your last donation.
                          Stay healthy and keep saving lives!
                        </p>
                      ) : (
                        <p className="text-gray-600 mt-1">
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
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-4 rounded-full text-white">
                  <Calendar size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">Next Donation Eligibility</h3>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold text-green-600">You are eligible to donate!</span> No previous donation record found.
                    Stay healthy and keep saving lives!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg"
      >
        <div className="flex items-center gap-4">
          <Filter className="text-gray-600" size={20} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Year
            </label>
            <Select
              value={filterYear}
              onChange={handleYearChange}
              className="max-w-xs"
            >
              <option value="all">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalDonations)} of {totalDonations} donations
          </div>
        </div>
      </motion.div>

      {/* Donation History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-transparent border-0">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-black" size={20} />
              Donation Records
            </CardTitle>
          </CardHeader>
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

export default DonorHistory
