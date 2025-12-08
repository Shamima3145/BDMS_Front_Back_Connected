import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { toast } from 'react-toastify'
import axios from 'axios'

const UpdateInventoryModal = ({ isOpen, onClose, hospitalName, onUpdate }) => {
  const [inventory, setInventory] = useState({
    a_positive: 0,
    a_negative: 0,
    b_positive: 0,
    b_negative: 0,
    ab_positive: 0,
    ab_negative: 0,
    o_positive: 0,
    o_negative: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && hospitalName) {
      fetchCurrentInventory()
    }
  }, [isOpen, hospitalName])

  const fetchCurrentInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `http://127.0.0.1:8000/api/hospital/blood-bank?hospital_name=${encodeURIComponent(hospitalName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setInventory(response.data.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setInventory((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://127.0.0.1:8000/api/hospital/blood-bank',
        {
          hospital_name: hospitalName,
          ...inventory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success('Blood bank inventory updated successfully!')
      onUpdate(inventory)
      onClose()
    } catch (error) {
      console.error('Error updating inventory:', error)
      toast.error('Failed to update inventory')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Blood Bank Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="a_positive">A+ Units</Label>
              <Input
                type="number"
                id="a_positive"
                name="a_positive"
                value={inventory.a_positive}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="a_negative">A- Units</Label>
              <Input
                type="number"
                id="a_negative"
                name="a_negative"
                value={inventory.a_negative}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="b_positive">B+ Units</Label>
              <Input
                type="number"
                id="b_positive"
                name="b_positive"
                value={inventory.b_positive}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="b_negative">B- Units</Label>
              <Input
                type="number"
                id="b_negative"
                name="b_negative"
                value={inventory.b_negative}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ab_positive">AB+ Units</Label>
              <Input
                type="number"
                id="ab_positive"
                name="ab_positive"
                value={inventory.ab_positive}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ab_negative">AB- Units</Label>
              <Input
                type="number"
                id="ab_negative"
                name="ab_negative"
                value={inventory.ab_negative}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="o_positive">O+ Units</Label>
              <Input
                type="number"
                id="o_positive"
                name="o_positive"
                value={inventory.o_positive}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="o_negative">O- Units</Label>
              <Input
                type="number"
                id="o_negative"
                name="o_negative"
                value={inventory.o_negative}
                onChange={handleChange}
                min="0"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              className="flex-1 bg-[#0EA5E9] hover:bg-[#0284C7]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Inventory'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateInventoryModal
