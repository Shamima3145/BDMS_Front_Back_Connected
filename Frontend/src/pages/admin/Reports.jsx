import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, TrendingUp, Users, Droplet, Calendar, FileText, BarChart3, PieChart } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card'
import { Select } from '@components/ui/Select'
import { bloodGroups } from '@utils/constants'
import { toast } from 'react-toastify'
import api from '@utils/api'
import { pdf } from '@react-pdf/renderer'
import ReportsAnalyticsPDF from '@components/pdf/ReportsAnalyticsPDF'
import PDFPreviewModal from '@components/modals/PDFPreviewModal'

const Reports = () => {
  const [reportType, setReportType] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pdfFileName, setPdfFileName] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  const [monthlyStats, setMonthlyStats] = useState({
    totalDonations: 0,
    newDonors: 0,
    bloodCollected: 0,
    requestsFulfilled: 0,
    donationsGrowth: '0%',
    donorsGrowth: '0%',
    bloodGrowth: '0%',
    requestsGrowth: '0%',
  })

  const [bloodGroupDistribution, setBloodGroupDistribution] = useState([])
  const monthlyTrends = []

  // Fetch reports statistics
  useEffect(() => {
    const fetchReportsStats = async () => {
      try {
        setLoading(true)
        const response = await api.get('/admin/reports-stats', {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        })
        
        console.log('API Response:', response.data)
        const data = response.data?.data
        
        if (data) {
          setMonthlyStats({
            totalDonations: data.totalDonations || 0,
            newDonors: data.newDonors || 0,
            bloodCollected: data.bloodCollected || 0,
            requestsFulfilled: data.requestsFulfilled || 0,
            donationsGrowth: data.donationsGrowth || '0%',
            donorsGrowth: data.donorsGrowth || '0%',
            bloodGrowth: data.bloodGrowth || '0%',
            requestsGrowth: data.requestsGrowth || '0%',
          })
          setBloodGroupDistribution(data.bloodGroupDistribution || [])
        }
      } catch (error) {
        console.error('Error fetching reports stats:', error)
        console.error('Error details:', error.response?.data)
        toast.error('Failed to fetch reports statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchReportsStats()
  }, [selectedMonth, selectedYear])

  const handleExportPDF = async () => {
    try {
      setExportLoading(true)
      toast.info('Preparing PDF preview...')

      const pdfDoc = (
        <ReportsAnalyticsPDF
          monthlyStats={monthlyStats}
          bloodGroupDistribution={bloodGroupDistribution}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )

      setPdfDocument(pdfDoc)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      setPdfFileName(`reports-analytics-${months[selectedMonth - 1]}-${selectedYear}.pdf`)
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

  const handleExportExcel = () => {
    toast.success('Report exported as Excel successfully!')
  }

  const handlePrintReport = () => {
    toast.info('Preparing report for printing...')
  }

  const stats = [
    {
      title: 'Total Donations',
      value: monthlyStats.totalDonations,
      icon: Droplet,
      color: 'bg-red-500',
      change: monthlyStats.donationsGrowth,
      changeType: 'increase',
    },
    {
      title: 'New Donors',
      value: monthlyStats.newDonors,
      icon: Users,
      color: 'bg-blue-500',
      change: monthlyStats.donorsGrowth,
      changeType: 'increase',
    },
    {
      title: 'Blood Collected',
      value: `${(monthlyStats.bloodCollected * 0.45).toFixed(1)}L`,
      icon: BarChart3,
      color: 'bg-green-500',
      change: monthlyStats.bloodGrowth,
      changeType: 'increase',
    },
    {
      title: 'Requests Fulfilled',
      value: monthlyStats.requestsFulfilled,
      icon: FileText,
      color: 'bg-purple-500',
      change: monthlyStats.requestsGrowth,
      changeType: 'increase',
    },
  ]

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track and analyze donation activities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePrintReport} variant="outline">
            <FileText size={18} className="mr-2" />
            Print
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <Download size={18} className="mr-2" />
            Excel
          </Button>
          <Button 
            onClick={handleExportPDF}
            disabled={exportLoading}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} className="mr-2" />
            {exportLoading ? 'Preparing...' : 'Export PDF'}
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="custom">Custom Range</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <Select value={selectedYear} disabled>
              <option value={selectedYear}>{selectedYear}</option>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                        <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                        <span className="text-gray-500 text-sm ml-2">vs last month</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full text-white`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Blood Group Distribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="text-primary" size={20} />
              Blood Group Distribution
            </CardTitle>
            <CardDescription>Donations by blood group this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bloodGroupDistribution.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No data available for this month</p>
              ) : (
                bloodGroupDistribution.map((item, index) => (
                  <motion.div
                    key={item.group}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="font-bold text-red-600">{item.group}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.donations} donations ({item.units} units)</span>
                          <span className="text-sm text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                            className="bg-red-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              Donation Trends
            </CardTitle>
            <CardDescription>Monthly donation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4">
              {monthlyTrends.map((item, index) => {
                const maxValue = Math.max(...monthlyTrends.map(t => t.donations))
                const height = (item.donations / maxValue) * 100
                return (
                  <motion.div
                    key={item.month}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group cursor-pointer hover:from-primary/90 hover:to-primary/50 transition-all"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {item.donations}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
                      {item.month}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-gray-600">Donations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

export default Reports
