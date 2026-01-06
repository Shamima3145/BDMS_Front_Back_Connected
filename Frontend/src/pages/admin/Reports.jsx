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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
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
  const [monthlyTrends, setMonthlyTrends] = useState([])

  // Fetch reports statistics
  useEffect(() => {
    const fetchReportsStats = async () => {
      try {
        setLoading(true)
        console.log('Fetching reports stats...')
        console.log('Month:', selectedMonth, 'Year:', selectedYear)
        
        const response = await api.get('/admin/reports-stats', {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        })
        
        console.log('Full API Response:', response)
        console.log('Response Data:', response.data)
        console.log('Response Data.data:', response.data?.data)
        console.log('Response keys:', Object.keys(response.data || {}))
        
        const data = response.data?.data
        
        if (data) {
          console.log('Setting monthly stats with:', data)
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
          setMonthlyTrends(data.monthlyTrends || [])
          console.log('Stats updated successfully')
        } else {
          console.error('No data found in response')
        }
      } catch (error) {
        console.error('Error fetching reports stats:', error)
        console.error('Error response:', error.response)
        console.error('Error details:', error.response?.data)
        console.error('Error message:', error.message)
        toast.error('Failed to fetch reports statistics: ' + (error.response?.data?.message || error.message))
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
            <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
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
            {bloodGroupDistribution.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available for this month</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Pie Chart */}
                <div className="flex items-center justify-center lg:justify-start">
                  <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
                    {(() => {
                      let currentAngle = 0
                      const colors = [
                        '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
                        '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
                        '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
                      ]
                      
                      return bloodGroupDistribution.map((item, index) => {
                        const percentage = parseFloat(item.percentage) / 100
                        const startAngle = currentAngle
                        const endAngle = currentAngle + (percentage * 360)
                        currentAngle = endAngle
                        
                        const startRad = (startAngle * Math.PI) / 180
                        const endRad = (endAngle * Math.PI) / 180
                        const radius = 90
                        const centerX = 110
                        const centerY = 110
                        
                        const x1 = centerX + radius * Math.cos(startRad)
                        const y1 = centerY + radius * Math.sin(startRad)
                        const x2 = centerX + radius * Math.cos(endRad)
                        const y2 = centerY + radius * Math.sin(endRad)
                        
                        const largeArcFlag = percentage > 0.5 ? 1 : 0
                        
                        const pathData = [
                          `M ${centerX} ${centerY}`,
                          `L ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ')
                        
                        return (
                          <motion.path
                            key={item.group}
                            d={pathData}
                            fill={colors[index % colors.length]}
                            stroke="white"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        )
                      })
                    })()}
                    {/* Center circle for donut effect */}
                    <circle cx="110" cy="110" r="50" fill="white" />
                    <text
                      x="110"
                      y="105"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-gray-800"
                      transform="rotate(90 110 105)"
                    >
                      {bloodGroupDistribution.reduce((sum, item) => sum + parseInt(item.units), 0)}
                    </text>
                    <text
                      x="90"
                      y="120"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs fill-gray-500"
                      transform="rotate(90 90 120)"
                    >
                      Total Units
                    </text>
                  </svg>
                </div>
                
                {/* Legend - 2 Column Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 content-start">
                  {bloodGroupDistribution.map((item, index) => {
                    const colors = [
                      '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
                      '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
                      '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
                    ]
                    return (
                      <motion.div
                        key={item.group}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="font-semibold text-gray-800">{item.group}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{item.units} units</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
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
            {monthlyTrends.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available</p>
            ) : (
              <>
                <div className="h-64 flex items-end justify-between gap-4">
                  {monthlyTrends.map((item, index) => {
                    const maxValue = Math.max(...monthlyTrends.map(t => t.donations), 1)
                    const height = maxValue > 0 ? (item.donations / maxValue) * 100 : 0
                    return (
                      <motion.div
                        key={item.month}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group cursor-pointer hover:from-primary/90 hover:to-primary/50 transition-all min-h-[20px]"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.donations} donations
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
              </>
            )}
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
