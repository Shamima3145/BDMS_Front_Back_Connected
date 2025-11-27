import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const genderOptions = ['Male', 'Female', 'Other']

export const hospitalTypes = ['Government', 'Private', 'NGO', 'Clinic']

export const districts = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Rajshahi',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh'
]

export const requestStatusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Process': 'bg-blue-100 text-blue-700',
  Accepted: 'bg-green-100 text-green-700',
  Completed: 'bg-green-100 text-green-700',
  Declined: 'bg-red-100 text-red-700',
}

export const getStatusColor = (status) => {
  return requestStatusColors[status] || 'bg-gray-100 text-gray-700'
}
