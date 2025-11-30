import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/Button'

const TrackDonation = () => {
  const trackData = []

  const columns = [
    { header: 'Donation ID', accessor: 'id', className: 'font-semibold' },
    { header: 'Blood Group', accessor: 'blood' },
    { header: 'Units', accessor: 'units' },
    { header: 'Center', accessor: 'center' },
    { header: 'Status', accessor: 'status' },
    { header: 'Completion', accessor: 'completion' },
  ]

  const handleRefresh = () => {
    toast.info('Refreshing donation status...')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-green-800"
        >
          Track Donation
        </motion.h1>
        <Button
          onClick={handleRefresh}
          className="bg-green-700 hover:bg-green-600 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={trackData}
          columns={columns}
          searchPlaceholder="Search donations..."
          paginationColor="green"
        />
      </motion.div>
    </div>
  )
}

export default TrackDonation
