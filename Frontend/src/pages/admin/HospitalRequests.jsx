import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'

const HospitalRequests = () => {
  const hospitalRequestsData = [
    { id: 'HR-001', hospital: 'City Hospital', blood: 'B+', units: 5, by: 'Dr. Karim', status: 'Pending' },
    { id: 'HR-002', hospital: 'General Hospital', blood: 'O-', units: 3, by: 'Dr. Hassan', status: 'Accepted' },
    { id: 'HR-003', hospital: 'Memorial Clinic', blood: 'A+', units: 7, by: 'Dr. Fatima', status: 'Declined' },
    { id: 'HR-004', hospital: 'Community Care', blood: 'AB-', units: 4, by: 'Dr. Reza', status: 'Pending' },
    { id: 'HR-005', hospital: "St. Mary's", blood: 'B-', units: 2, by: 'Dr. Jamal', status: 'Accepted' },
    { id: 'HR-006', hospital: 'County Hospital', blood: 'O+', units: 6, by: 'Dr. Nadia', status: 'Pending' },
  ]

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
