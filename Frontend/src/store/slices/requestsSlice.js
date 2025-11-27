import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  publicRequests: [],
  hospitalRequests: [],
  currentPage: 1,
  entriesPerPage: 5,
  searchQuery: '',
  loading: false,
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setPublicRequests: (state, action) => {
      state.publicRequests = action.payload
    },
    setHospitalRequests: (state, action) => {
      state.hospitalRequests = action.payload
    },
    updateRequestStatus: (state, action) => {
      const { id, status, type } = action.payload
      const requests = type === 'public' ? state.publicRequests : state.hospitalRequests
      const index = requests.findIndex(r => r.id === id)
      if (index !== -1) {
        requests[index].status = status
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setEntriesPerPage: (state, action) => {
      state.entriesPerPage = action.payload
      state.currentPage = 1
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  setPublicRequests,
  setHospitalRequests,
  updateRequestStatus,
  setCurrentPage,
  setEntriesPerPage,
  setSearchQuery,
  setLoading,
} = requestsSlice.actions

export default requestsSlice.reducer
