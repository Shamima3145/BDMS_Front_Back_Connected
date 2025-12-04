import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { forgotPasswordSchema } from '@/utils/validationSchemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal, ModalHeader, ModalContent, ModalTitle, ModalDescription } from '@/components/ui/Modal'
import axios from 'axios'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema) })

  const onSubmit = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password', {
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      })

      toast.success('Password reset successful! You can now login with your new password.')
      reset()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="bg-white">
      <ModalHeader>
        <div className="flex justify-between items-center">
          <ModalTitle className="text-xl font-semibold text-gray-800">
            Reset Password
          </ModalTitle>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <ModalDescription className="text-gray-600">
          Enter your email and new password to reset your account
        </ModalDescription>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="block text-red-700 font-medium mb-1">Email</Label>
            <Input 
              {...register('email')} 
              type="email" 
              placeholder="Enter your email" 
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label className="block text-red-700 font-medium mb-1">New Password</Label>
            <Input 
              {...register('password')} 
              type="password" 
              placeholder="Enter new password" 
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label className="block text-red-700 font-medium mb-1">Confirm New Password</Label>
            <Input 
              {...register('confirmPassword')} 
              type="password" 
              placeholder="Confirm new password" 
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              onClick={handleClose}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full bg-[#a21c1c] text-white font-semibold py-2 rounded-lg hover:bg-[#8c1717] transition-all" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ForgotPasswordModal