import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Droplet } from 'lucide-react'
import BloodGroupCard from '@/components/BloodGroupCard'
import axios from 'axios'
import { toast } from 'react-toastify'

const BloodInventory = () => {
  const [inventory, setInventory] = useState({
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0,
    'O+': 0,
    'O-': 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBloodInventory()
  }, [])

  const fetchBloodInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://127.0.0.1:8000/api/admin/blood-inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setInventory(response.data.data)
    } catch (error) {
      console.error('Error fetching blood inventory:', error)
      toast.error('Failed to fetch blood inventory')
    } finally {
      setLoading(false)
    }
  }

  const bloodGroupData = Object.entries(inventory).map(([group, units]) => ({
    bloodGroup: group,
    units,
  }))

  const totalUnits = Object.values(inventory).reduce((a, b) => a + b, 0)
  const mostAvailable = Object.entries(inventory).reduce((a, b) => (a[1] > b[1] ? a : b))
  const leastAvailable = Object.entries(inventory).reduce((a, b) => (a[1] < b[1] ? a : b))

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Blood Inventory Management</h1>
            <p className="text-gray-600">Monitor and track blood stock levels across all groups</p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Droplet className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading blood inventory...</p>
        </div>
      ) : (
        <>
          {/* Blood Group Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {bloodGroupData.map((data, index) => (
              <motion.div
                key={data.bloodGroup}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <BloodGroupCard {...data} />
          </motion.div>
        ))}
      </motion.div>

      {/* Inventory Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Blood Units Card */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" strokeWidth={2} />
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                Total
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Blood Units</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{totalUnits}</p>
            <p className="text-gray-500 text-sm">units available in stock</p>
          </motion.div>

          {/* Most Available Card */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" strokeWidth={2} />
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                Highest
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Most Available Group</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{mostAvailable[0]}</p>
            <p className="text-gray-500 text-sm">{mostAvailable[1]} units in stock</p>
          </motion.div>

          {/* Least Available Card */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-orange-600" strokeWidth={2} />
              </div>
              <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md">
                Lowest
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Least Available Group</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{leastAvailable[0]}</p>
            <p className="text-gray-500 text-sm">{leastAvailable[1]} units remaining</p>
          </motion.div>
        </div>
      </motion.div>
        </>
      )}
    </div>
  )
}

export default BloodInventory
