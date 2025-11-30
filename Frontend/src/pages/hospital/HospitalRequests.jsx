import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, CheckCircle, XCircle, Eye, Check, X } from 'lucide-react'
import DataTable from '@/components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { toast } from 'react-toastify'

const HospitalRequests = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [requests] = useState([])

  const stats = [
    {
      title: 'Total Requests',
      value: 24,
      icon: ClipboardList,
      color: 'bg-[#0EA5E9]',
      borderColor: 'border-[#BAE6FD]',
      bgGradient: 'from-[#E0F2FF] to-white',
    },
    {
      title: 'Pending',
      value: 8,
      icon: Clock,
      color: 'bg-[#F59E0B]',
      borderColor: 'border-[#FDE68A]',
      bgGradient: 'from-[#FEF9C3] to-white',
    },
    {
      title: 'Approved',
      value: 12,
      icon: CheckCircle,
      color: 'bg-[#16A34A]',
      borderColor: 'border-[#A7F3D0]',
      bgGradient: 'from-[#DCFCE7] to-white',
    },
    {
      title: 'Rejected',
      value: 4,
      icon: XCircle,
      color: 'bg-[#DC2626]',
      borderColor: 'border-[#FECACA]',
      bgGradient: 'from-[#FEF2F2] to-white',
    },
  ]

  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'units', label: 'Units' },
    { key: 'urgency', label: 'Urgency' },
    { key: 'requestDate', label: 'Request Date' },
    { key: 'status', label: 'Status' },
  ]

  const handleApprove = (request) => {
    toast.success(`Request ${request.id} approved!`)
  }

  const handleReject = (request) => {
    toast.error(`Request ${request.id} rejected!`)
  }

  const handleViewDetails = (request) => {
    toast.info(`Viewing details for request ${request.id}`)
  }

  const getActions = (request) => {
    if (request.status === 'Pending') {
      return [
        {
          label: <Check size={16} />,
          onClick: () => handleApprove(request),
          variant: 'default',
          className: 'bg-green-500 hover:bg-green-600',
        },
        {
          label: <X size={16} />,
          onClick: () => handleReject(request),
          variant: 'outline',
          className: 'bg-blue-500 hover:bg-blue-600 text-white',
        },
      ]
    }
    return [
      {
        label: (
          <>
            <Eye size={16} className="inline mr-1" /> View
          </>
        ),
        onClick: () => handleViewDetails(request),
        variant: 'default',
        className: 'bg-[#0EA5E9] hover:bg-[#0284C7]',
      },
    ]
  }

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status.toLowerCase() === filterStatus
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color.replace('bg-', 'text-')} mt-1`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color}/10 rounded-full flex items-center justify-center`}>
                      <Icon className={`${stat.color.replace('bg-', 'text-')} w-6 h-6`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Request Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white border border-[#BAE6FD]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl text-[#0F172A] mb-1">Blood Requests</CardTitle>
                <p className="text-sm text-gray-600">Manage and track all blood requests</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="text"
                  placeholder="Search by ID or Patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredRequests}
              columns={columns}
              actions={getActions}
              searchable={false}
              paginationColor="blue"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default HospitalRequests
