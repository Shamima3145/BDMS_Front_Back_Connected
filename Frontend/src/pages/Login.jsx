import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { loginSchema } from '@/utils/validationSchemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import ForgotPasswordModal from '@/components/ForgotPasswordModal'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) })

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', {
        email: data.email,
        password: data.password,
      })

      const response = res.data

      // Save info to Redux
      dispatch(
        setCredentials({
          user: response.user,
          token: response.access_token,
          userType: response.userType,
        })
      )

      // Save in localStorage
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('userType', response.userType)

      toast.success('Login successful!')

      // Redirect based on role
      if (response.userType === 'admin') navigate('/admin/dashboard')
      else if (response.userType === 'hospital') navigate('/hospital/dashboard')
      else navigate('/user/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#fffaed] to-[#c74949] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <img src="/assets/logo.png" alt="BloodBridge Logo" className="w-20 h-20 mb-2" />
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your details to sign in
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input {...register('email')} type="email" placeholder="Enter Email" className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label>Password</Label>
                <Input {...register('password')} type="password" placeholder="Password" className={errors.password ? 'border-red-500' : ''} />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-sm text-blue-500 hover:underline block text-right cursor-pointer"
              >
                Forgot password?
              </button>

              <Button type="submit" className="w-full bg-[#a21c1c] hover:bg-[#8c1717]" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-sm text-black-500 mt-4">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#a21c1c] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </div>
  )
}

export default Login
