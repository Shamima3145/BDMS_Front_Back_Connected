import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Droplet, Download, Filter } from 'lucide-react'
import DataTable from '@components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Select } from '@components/ui/Select'
import { formatDate } from '@utils/helpers'
import { toast } from 'react-toastify'

const DonorHistory = () => {
  const [filterYear, setFilterYear] = useState('all')

  // Mock donation history data
  const [donations] = useState([
    {
      id: 'D-001',
      date: '2024-11-15',
      location: 'Dhaka Medical College Hospital',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Emergency Patient',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-002',
      date: '2024-09-20',
      location: 'Red Crescent Blood Bank',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Surgery Patient',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-003',
      date: '2024-07-10',
      location: 'Chittagong Medical College',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Accident Victim',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-004',
      date: '2024-05-05',
      location: 'Dhaka Medical College Hospital',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Cancer Patient',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-005',
      date: '2024-03-15',
      location: 'Square Hospitals Blood Bank',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Thalassemia Patient',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-006',
      date: '2024-01-20',
      location: 'Bangabandhu Medical College',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Emergency Surgery',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-007',
      date: '2023-11-10',
      location: 'Apollo Hospitals Dhaka',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Maternity Case',
      status: 'Completed',
      certificate: true,
    },
    {
      id: 'D-008',
      date: '2023-09-05',
      location: 'Dhaka Medical College Hospital',
      bloodGroup: 'A+',
      quantity: '450ml',
      recipient: 'Accident Patient',
      status: 'Completed',
      certificate: true,
    },
  ])

  const columns = [
    { key: 'id', label: 'Donation ID' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'recipient', label: 'Recipient Type' },
    { key: 'status', label: 'Status' },
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
      label: 'View Details',
      onClick: () => handleViewDetails(donation),
      variant: 'default',
    },
    {
      label: 'Download Certificate',
      onClick: () => handleDownloadCertificate(donation),
      variant: 'outline',
      disabled: !donation.certificate,
    },
  ]

  // Calculate statistics
  const totalDonations = donations.length
  const totalBlood = donations.reduce((acc, d) => acc + parseInt(d.quantity), 0)
  const livesSaved = Math.floor(totalDonations * 3) // Estimate: 1 donation saves 3 lives
  const lastDonation = donations[0]?.date

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
      value: `${(totalBlood / 1000).toFixed(1)}L`,
      icon: Award,
      color: 'bg-blue-500',
      description: `${totalBlood}ml total`,
    },
    {
      title: 'Lives Saved',
      value: `~${livesSaved}`,
      icon: Award,
      color: 'bg-green-500',
      description: 'Estimated impact',
    },
    {
      title: 'Last Donation',
      value: formatDate(lastDonation),
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Most recent',
    },
  ]

  // Filter donations by year
  const filteredDonations = filterYear === 'all' 
    ? donations 
    : donations.filter(d => new Date(d.date).getFullYear().toString() === filterYear)

  const availableYears = [...new Set(donations.map(d => new Date(d.date).getFullYear()))].sort((a, b) => b - a)

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
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between h-full">
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full text-white flex-shrink-0`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Achievement Badge */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-4 rounded-full text-white">
                <Award size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">Hero Donor Badge</h3>
                <p className="text-gray-600 mt-1">
                  You&apos;ve made {totalDonations} donations and potentially saved {livesSaved} lives! 
                  Thank you for your life-saving contributions.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600">{totalDonations}</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-4">
          <Filter className="text-gray-600" size={20} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Year
            </label>
            <Select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
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
            Showing {filteredDonations.length} of {totalDonations} donations
          </div>
        </div>
      </motion.div>

      {/* Donation History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-black" size={20} />
              Donation Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredDonations}
              columns={columns}
              actions={getActions}
              searchable={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Donation Eligibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-4 rounded-full text-white">
                <Calendar size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">Next Donation Eligibility</h3>
                <p className="text-gray-600 mt-1">
                  You can donate again after 90 days from your last donation. 
                  Stay healthy and keep saving lives!
                </p>
              </div>
              <div className="hidden md:block">
                <Button className="bg-green-600 hover:bg-green-700">
                  Schedule Donation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DonorHistory
