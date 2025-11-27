import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bloodGroups: {
    'A+': 1,
    'B+': 2,
    'O+': 37,
    'AB+': 8,
    'A-': 7,
    'B-': 1,
    'O-': 10,
    'AB-': 32,
  },
  totalDonors: 3,
  totalRequests: 3,
  approvedRequests: 2,
  totalBloodUnits: 98,
  loading: false,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action) => {
      state.bloodGroups = action.payload
    },
    updateBloodGroup: (state, action) => {
      const { bloodGroup, units } = action.payload
      state.bloodGroups[bloodGroup] = units
    },
    setStats: (state, action) => {
      const { totalDonors, totalRequests, approvedRequests, totalBloodUnits } = action.payload
      state.totalDonors = totalDonors
      state.totalRequests = totalRequests
      state.approvedRequests = approvedRequests
      state.totalBloodUnits = totalBloodUnits
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setInventory, updateBloodGroup, setStats, setLoading } = inventorySlice.actions

export default inventorySlice.reducer
