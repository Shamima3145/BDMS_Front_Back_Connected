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
  Pending: 'text-yellow-700',
  'In Process': 'text-blue-700',
  Accepted: 'text-green-700',
  Completed: 'text-green-700',
  Declined: 'text-red-700',
}

export const getStatusColor = (status) => {
  return requestStatusColors[status] || 'text-gray-700'
}
