import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Check, X } from 'lucide-react'

const HospitalRequests = () => {
  const [hospitalRequestsData, setHospitalRequestsData] = useState([])
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    const fetchHospitalRequests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/blood-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const hospitalRequests = response.data.requests.filter(
          (request) => request.hospital_name !== null
        )
        const formattedData = hospitalRequests.map((request) => ({
          id: request.request_id,
          hospital: request.hospital_name,
          blood: request.blood_group,
          units: request.units,
          contact: request.contact,
          by: request.requested_by,
          status: request.status,
        }))
        setHospitalRequestsData(formattedData)
        setLoading(false)
      } catch (error) {
        toast.error('Failed to fetch hospital requests')
        setLoading(false)
      }
    }

    fetchHospitalRequests()
  }, [token])

  const columns = [
    { header: 'Request ID', accessor: 'id', className: 'font-semibold' },
    { header: 'Hospital', accessor: 'hospital' },
    { header: 'Blood Group', accessor: 'blood' },
    { header: 'Units', accessor: 'units' },
    { header: 'Contact', accessor: 'contact' },
    { header: 'Requested By', accessor: 'by' },
    { header: 'Status', accessor: 'status' },
  ]

  const handleAccept = async (row) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/blood-requests', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const request = response.data.requests.find(r => r.request_id === row.id)
      
      if (!request) {
        toast.error('Request not found')
        return
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/blood-requests/${request.id}`,
        { status: 'Accept' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success(`Request ${row.id} from ${row.hospital} accepted successfully!`)
      
      // Update local state
      setHospitalRequestsData(prevData =>
        prevData.map(item =>
          item.id === row.id ? { ...item, status: 'Accept' } : item
        )
      )
    } catch (error) {
      toast.error('Failed to accept request')
    }
  }

  const handleDecline = async (row) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/blood-requests', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const request = response.data.requests.find(r => r.request_id === row.id)
      
      if (!request) {
        toast.error('Request not found')
        return
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/blood-requests/${request.id}`,
        { status: 'Decline' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.error(`Request ${row.id} from ${row.hospital} declined!`)
      
      // Update local state
      setHospitalRequestsData(prevData =>
        prevData.map(item =>
          item.id === row.id ? { ...item, status: 'declined' } : item
        )
      )
    } catch (error) {
      toast.error('Failed to decline request')
    }
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Hospital Requests
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={hospitalRequestsData}
          columns={columns}
          customActions={(row) => {
            const status = row.status?.toLowerCase()
            if (status === 'accept' || status === 'decline' || status === 'accepted' || status === 'declined') {
              return []
            }
            return [
              {
                icon: () => <Check size={18} />,
                onClick: () => handleAccept(row),
                className: 'bg-green-600 hover:bg-green-700 text-white p-2 rounded',
                title: 'Accept'
              },
              {
                icon: () => <X size={18} />,
                onClick: () => handleDecline(row),
                className: 'bg-red-600 hover:bg-red-700 text-white p-2 rounded',
                title: 'Decline'
              }
            ]
          }}
          searchPlaceholder="Search hospital requests..."
        />
      </motion.div>
    </div>
  )
}

export default HospitalRequests
