import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal, ModalHeader, ModalContent, ModalTitle, ModalDescription } from '@/components/ui/Modal'
import axios from 'axios'

// Step-specific validation schemas
const emailSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

const otpSchema = yup.object({
  otp: yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
})

const passwordSchema = yup.object({
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: yupResolver(
      step === 1 ? emailSchema : step === 2 ? otpSchema : passwordSchema
    ) 
  })

  const handleSendOtp = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/password-reset/send-otp', {
        email: data.email,
      })
      setEmail(data.email)
      setStep(2)
      toast.success('OTP sent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    }
  }

  const handleVerifyOtp = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/password-reset/verify-otp', {
        email: email,
        otp: data.otp,
      })
      setStep(3)
      toast.success('OTP verified successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP. Please try again.')
    }
  }

  const handleResetPassword = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/password-reset/reset', {
        email: email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      })

      toast.success('Password reset successful! You can now login with your new password.')
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.')
    }
  }

  const onSubmit = (data) => {
    if (step === 1) return handleSendOtp(data)
    if (step === 2) return handleVerifyOtp(data)
    if (step === 3) return handleResetPassword(data)
  }

  const handleClose = () => {
    reset()
    setStep(1)
    setEmail('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="bg-white">
      <ModalHeader>
        <div className="flex justify-between items-center">
          <ModalTitle className="text-xl font-semibold text-gray-800">
            Reset Password {step === 1 && '- Enter Email'} 
            {step === 2 && '- Verify OTP'} 
            {step === 3 && '- New Password'}
          </ModalTitle>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <ModalDescription className="text-gray-600">
          {step === 1 && 'Enter your email address to receive OTP'}
          {step === 2 && 'Enter the 6-digit OTP sent to your email'}
          {step === 3 && 'Enter your new password'}
        </ModalDescription>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
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
          )}

          {step === 2 && (
            <div>
              <Label className="block text-red-700 font-medium mb-1">OTP Code</Label>
              <Input 
                {...register('otp')} 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit OTP" 
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.otp ? 'border-red-500' : ''}`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
              <p className="text-sm text-gray-500 mt-2">OTP sent to: {email}</p>
            </div>
          )}

          {step === 3 && (
            <>
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
            </>
          )}

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
              {isSubmitting ? 'Processing...' : 
                step === 1 ? 'Send OTP' : 
                step === 2 ? 'Verify OTP' : 
                'Reset Password'
              }
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ForgotPasswordModal