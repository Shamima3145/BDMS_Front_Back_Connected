import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    bloodGroup: '',
    gender: '',
    contactNumber: '',
    area: '',
    hasEverDonated: false,
    lastDonationDate: null,
    totalDonations: 0,
  },
  donations: [],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    setDonations: (state, action) => {
      state.donations = action.payload
    },
    updateDonation: (state, action) => {
      const index = state.donations.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.donations[index] = { ...state.donations[index], ...action.payload }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setUserProfile, setDonations, updateDonation, setLoading, setError } = userSlice.actions

export default userSlice.reducer
