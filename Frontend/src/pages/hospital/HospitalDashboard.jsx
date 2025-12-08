import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import UpdateInventoryModal from '@/components/UpdateInventoryModal'

const HospitalDashboard = () => {
  const token = useSelector((state) => state.auth.token)
  const [hospitalInfo, setHospitalInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bloodInventory, setBloodInventory] = useState([])

  const fetchBloodInventory = async (hospitalName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/hospital/blood-bank?hospital_name=${encodeURIComponent(hospitalName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data.data
      setBloodInventory([
        { group: 'A+', units: data.a_positive || 0, color: 'bg-[#0EA5E9]' },
        { group: 'A-', units: data.a_negative || 0, color: 'bg-[#1D4ED8]' },
        { group: 'B+', units: data.b_positive || 0, color: 'bg-[#06B6D4]' },
        { group: 'B-', units: data.b_negative || 0, color: 'bg-[#F59E0B]' },
        { group: 'AB+', units: data.ab_positive || 0, color: 'bg-[#8B5CF6]' },
        { group: 'AB-', units: data.ab_negative || 0, color: 'bg-[#DC2626]' },
        { group: 'O+', units: data.o_positive || 0, color: 'bg-[#16A34A]' },
        { group: 'O-', units: data.o_negative || 0, color: 'bg-[#4B5563]' },
      ])
    } catch (error) {
      console.error('Error fetching blood inventory:', error)
    }
  }

  // Fetch hospital data from backend
  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/hospital/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setHospitalInfo(response.data.hospital)
        fetchBloodInventory(response.data.hospital.hospitalName)
        setLoading(false)
      } catch (error) {
        toast.error('Failed to fetch hospital data')
        setLoading(false)
      }
    }

    fetchHospitalData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleInventoryUpdate = (updatedInventory) => {
    setBloodInventory([
      { group: 'A+', units: updatedInventory.a_positive || 0, color: 'bg-[#0EA5E9]' },
      { group: 'A-', units: updatedInventory.a_negative || 0, color: 'bg-[#1D4ED8]' },
      { group: 'B+', units: updatedInventory.b_positive || 0, color: 'bg-[#06B6D4]' },
      { group: 'B-', units: updatedInventory.b_negative || 0, color: 'bg-[#F59E63]' },
      { group: 'AB+', units: updatedInventory.ab_positive || 0, color: 'bg-[#8B5CF6]' },
      { group: 'AB-', units: updatedInventory.ab_negative || 0, color: 'bg-[#DC2626]' },
      { group: 'O+', units: updatedInventory.o_positive || 0, color: 'bg-[#16A34A]' },
      { group: 'O-', units: updatedInventory.o_negative || 0, color: 'bg-[#4B5563]' },
    ])
  }



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading hospital data...</p>
      </div>
    )
  }

  if (!hospitalInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Failed to load hospital data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hospital Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white border border-[#BAE6FD]">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Hospital Information</h2>
                <p className="text-sm text-gray-600">Overview of registered hospital details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#0F172A]">
              <div className=" rounded-xl p-4">
                <p className="mb-2">
                  <span className="font-semibold">Hospital Name:</span> {hospitalInfo.hospitalName}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Registration ID:</span> {hospitalInfo.registrationId}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Type:</span> {hospitalInfo.hospitalType}
                </p>
                <p>
                  <span className="font-semibold">Year Established:</span> {hospitalInfo.yearEstablished}
                </p>
              </div>
              <div className=" rounded-xl p-4">
                <p className="mb-2">
                  <span className="font-semibold">Address:</span> {hospitalInfo.address}, {hospitalInfo.city}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">District:</span> {hospitalInfo.district}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Official Email:</span> {hospitalInfo.email}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span> {hospitalInfo.contactNumber} {hospitalInfo.emergencyHotline && `| Emergency: ${hospitalInfo.emergencyHotline}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blood Bank Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-[#BAE6FD]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-[#0F172A] mb-1">Blood Bank Information</CardTitle>
                <p className="text-sm text-gray-600">Available blood groups and stored units</p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="self-start md:self-center bg-[#0EA5E9] hover:bg-[#0284C7] text-xs font-semibold"
              >
                Update Inventory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Blood Group Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {bloodInventory.map((item, index) => (
                <motion.div
                  key={item.group}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div className="rounded-xl p-3 bg-gradient-to-b from-[#E0F2FF] to-white border border-[#BAE6FD] shadow-sm flex flex-col items-center hover:shadow-md transition">
                    <div className={`w-10 h-10 rounded-full ${item.color}/10 flex items-center justify-center mb-1`}>
                      <span className="text-black font-bold text-lg">
                        {item.group}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Units</p>
                    <p className="text-lg font-bold text-[#0F172A]">{item.units}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <UpdateInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hospitalName={hospitalInfo?.hospitalName}
        onUpdate={handleInventoryUpdate}
      />
    </div>
  )
}

export default HospitalDashboard
