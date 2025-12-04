import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must not exceed 12 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  gender: yup.string().required('Gender is required'),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{11}$/, 'Contact number must be 11 digits')
    .required('Contact number is required'),
  area: yup.string().required('Area is required'),
  hasEverDonated: yup.string().required('This field is required'),
  lastDonationDate: yup.string().nullable(),
})

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must not exceed 12 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

export const hospitalRegisterSchema = yup.object({
  hospitalName: yup.string().required('Hospital name is required'),
  registrationId: yup.string().required('Registration ID is required'),
  hospitalType: yup.string().required('Hospital type is required'),
  yearEstablished: yup
    .number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Year established is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  district: yup.string().required('District is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{11}$/, 'Contact number must be 11 digits')
    .required('Contact number is required'),
  emergencyHotline: yup.string().nullable(),
  hasBloodBank: yup.string().required('Please select an option'),
  availableBloodGroups: yup.array().nullable(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

export const profileUpdateSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  gender: yup.string().required('Gender is required'),
  area: yup.string().required('Area is required'),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{11}$/, 'Contact number must be 11 digits')
    .required('Contact number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must not exceed 12 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('New password is required'),
})
