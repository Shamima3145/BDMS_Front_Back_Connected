import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'

const PublicRequests = () => {
  const publicRequestsData = [
    { id: 'BR-001', patient: 'Maria Ahmed', blood: 'O+', units: 2, by: 'Public', status: 'Pending' },
    { id: 'BR-002', patient: 'Aziz Rahman', blood: 'A-', units: 1, by: 'Public', status: 'Accepted' },
    { id: 'BR-003', patient: 'Fatema Ali', blood: 'B+', units: 3, by: 'Public', status: 'Declined' },
    { id: 'BR-004', patient: 'Khalid Khan', blood: 'AB+', units: 2, by: 'Public', status: 'Pending' },
    { id: 'BR-005', patient: 'Samia Chowdhury', blood: 'O-', units: 2, by: 'Public', status: 'Pending' },
    { id: 'BR-006', patient: 'Joyti Ghosh', blood: 'A+', units: 1, by: 'Public', status: 'Accepted' },
    { id: 'BR-007', patient: 'Rashid Munna', blood: 'B-', units: 4, by: 'Public', status: 'Declined' },
    { id: 'BR-008', patient: 'Lamia Tabassum', blood: 'AB-', units: 3, by: 'Public', status: 'Accepted' },
  ]

  const columns = [
    { header: 'Request ID', accessor: 'id', className: 'font-semibold' },
    { header: 'Patient Name', accessor: 'patient' },
    { header: 'Blood Group', accessor: 'blood' },
    { header: 'Units', accessor: 'units' },
    { header: 'Requested By', accessor: 'by' },
    { header: 'Status', accessor: 'status' },
  ]

  const handleAccept = (row) => {
    toast.success(`Request ${row.id} accepted successfully!`)
  }

  const handleDecline = (row) => {
    toast.error(`Request ${row.id} declined!`)
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Public Requests
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={publicRequestsData}
          columns={columns}
          showActions={true}
          onAccept={handleAccept}
          onDecline={handleDecline}
          searchPlaceholder="Search public requests..."
        />
      </motion.div>
    </div>
  )
}

export default PublicRequests
