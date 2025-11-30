import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

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
    { header: 'Requested By', accessor: 'by' },
    { header: 'Status', accessor: 'status' },
  ]

  const handleAccept = (row) => {
    toast.success(`Request ${row.id} from ${row.hospital} accepted successfully!`)
  }

  const handleDecline = (row) => {
    toast.error(`Request ${row.id} from ${row.hospital} declined!`)
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
          showActions={true}
          onAccept={handleAccept}
          onDecline={handleDecline}
          searchPlaceholder="Search hospital requests..."
        />
      </motion.div>
    </div>
  )
}

export default HospitalRequests
