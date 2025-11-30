import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Droplet, User, Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { bloodGroups } from '@/utils/constants'

const bloodRequestSchema = yup.object({
  requestType: yup.string().required('Request type is required'),
  patientName: yup.string().when('requestType', {
    is: 'public',
    then: (schema) => schema.required('Patient name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  hospitalName: yup.string().when('requestType', {
    is: 'hospital',
    then: (schema) => schema.required('Hospital name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  bloodGroup: yup.string().required('Blood group is required'),
  units: yup.number().min(1, 'At least 1 unit required').required('Units is required'),
  requestedBy: yup.string().required('Requester name is required'),
})

const BloodRequestModal = ({ isOpen, onClose }) => {
  const [requestType, setRequestType] = useState('public')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(bloodRequestSchema),
    defaultValues: {
      requestType: 'public',
      requestedBy: 'Public', // Set default value
    },
  })

  const onSubmit = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/blood-requests', {
        patient_name: data.requestType === 'public' ? data.patientName : null,
        hospital_name: data.requestType === 'hospital' ? data.hospitalName : null,
        blood_group: data.bloodGroup,
        units: data.units,
        requested_by: data.requestedBy,
      })
      toast.success('Blood request submitted successfully!')
      reset()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request')
    }
  }

  const handleRequestTypeChange = (type) => {
    setRequestType(type)
    setValue('requestType', type)
    // Automatically set the requestedBy field based on request type
    setValue('requestedBy', type === 'public' ? 'Public' : 'Hospital')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#D40200] to-[#942222] p-6 rounded-t-2xl relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Droplet className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Request Blood</h2>
                    <p className="text-white/90 text-sm">Submit your blood request</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Request Type Toggle */}
                <div>
                  <Label className="text-gray-700 font-semibold mb-3 block">Request Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRequestTypeChange('public')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        requestType === 'public'
                          ? 'border-secondary bg-[#E8F5F1] text-secondary'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <User size={20} />
                      <span className="font-semibold">Public Request</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestTypeChange('hospital')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        requestType === 'hospital'
                          ? 'border-[#BAE6FD] bg-[#E0F2FF] text-[#0EA5E9]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Building2 size={20} />
                      <span className="font-semibold">Hospital Request</span>
                    </button>
                  </div>
                  <input type="hidden" {...register('requestType')} />
                </div>

                {/* Conditional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requestType === 'public' ? (
                    <div>
                      <Label htmlFor="patientName" className="text-gray-700 font-semibold">
                        Patient Name *
                      </Label>
                      <Input
                        id="patientName"
                        {...register('patientName')}
                        placeholder="Enter patient name"
                        className={`mt-1 ${errors.patientName ? 'border-red-500' : ''}`}
                      />
                      {errors.patientName && (
                        <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="hospitalName" className="text-gray-700 font-semibold">
                        Hospital Name *
                      </Label>
                      <Input
                        id="hospitalName"
                        {...register('hospitalName')}
                        placeholder="Enter hospital name"
                        className={`mt-1 ${errors.hospitalName ? 'border-red-500' : ''}`}
                      />
                      {errors.hospitalName && (
                        <p className="text-red-500 text-sm mt-1">{errors.hospitalName.message}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="requestedBy" className="text-gray-700 font-semibold">
                      Requested By *
                    </Label>
                    <Select
                      id="requestedBy"
                      {...register('requestedBy')}
                      className={`mt-1 ${errors.requestedBy ? 'border-red-500' : ''}`}
                      disabled
                    >
                      <option value="">Select type</option>
                      <option value="Public">Public</option>
                      <option value="Hospital">Hospital</option>
                    </Select>
                    {errors.requestedBy && (
                      <p className="text-red-500 text-sm mt-1">{errors.requestedBy.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodGroup" className="text-gray-700 font-semibold">
                      Blood Group *
                    </Label>
                    <Select
                      id="bloodGroup"
                      {...register('bloodGroup')}
                      className={`mt-1 ${errors.bloodGroup ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </Select>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="units" className="text-gray-700 font-semibold">
                      Units Needed *
                    </Label>
                    <Input
                      id="units"
                      type="number"
                      min="1"
                      {...register('units')}
                      placeholder="Number of units"
                      className={`mt-1 ${errors.units ? 'border-red-500' : ''}`}
                    />
                    {errors.units && (
                      <p className="text-red-500 text-sm mt-1">{errors.units.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 ${
                      requestType === 'public'
                        ? 'bg-secondary hover:bg-[#3A8971]'
                        : 'bg-[#0EA5E9] hover:bg-[#0284C7]'
                    } text-white`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BloodRequestModal
