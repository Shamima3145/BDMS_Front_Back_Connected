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

      // Send WhatsApp message
      handleSendWhatsApp(row)
    } catch (error) {
      toast.error('Failed to accept request')
    }
  }

  const handleSendWhatsApp = (row) => {
    try {
      // Format phone number for Bangladesh (remove any spaces, dashes, etc.)
      let phone = row.contact.replace(/[^0-9]/g, '')
      
      // Add country code if not present
      if (phone.startsWith('0')) {
        phone = '880' + phone.substring(1)
      } else if (!phone.startsWith('880')) {
        phone = '880' + phone
      }

      const message = `Dear ${row.by},\n\nYour blood request has been ACCEPTED!\n\n📋 Request Details:\nRequest ID: ${row.id}\nHospital: ${row.hospital}\nBlood Group: ${row.blood}\nUnits Required: ${row.units}\n\nWe will arrange the blood donation as soon as possible.\n\nThank you,\nBlood Donation Management System`

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      
      toast.success('Opening WhatsApp...')
    } catch (error) {
      toast.error('Failed to open WhatsApp')
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
          item.id === row.id ? { ...item, status: 'Decline' } : item
        )
      )

      // Send WhatsApp decline message
      handleSendDeclineWhatsApp(row)
    } catch (error) {
      toast.error('Failed to decline request')
    }
  }

  const handleSendDeclineWhatsApp = (row) => {
    try {
      // Format phone number for Bangladesh (remove any spaces, dashes, etc.)
      let phone = row.contact.replace(/[^0-9]/g, '')
      
      // Add country code if not present
      if (phone.startsWith('0')) {
        phone = '880' + phone.substring(1)
      } else if (!phone.startsWith('880')) {
        phone = '880' + phone
      }

      const message = `Dear ${row.by},\n\nWe sincerely apologize, but your blood request has been DECLINED.\n\n📋 Request Details:\nRequest ID: ${row.id}\nHospital: ${row.hospital}\nBlood Group: ${row.blood}\nUnits Required: ${row.units}\n\n❌ Reason: Unfortunately, we are unable to fulfill this request at this time due to unavailability of matching donors or other constraints.\n\nWe apologize for any inconvenience caused. Please try again later or contact us for alternative arrangements.\n\nThank you for understanding,\nBlood Donation Management System`

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      
      toast.info('Opening WhatsApp for decline notification...')
    } catch (error) {
      toast.error('Failed to open WhatsApp')
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
