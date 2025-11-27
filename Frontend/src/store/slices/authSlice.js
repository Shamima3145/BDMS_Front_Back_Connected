import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  userType: localStorage.getItem('userType') || null, // 'user', 'admin', 'hospital'
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, userType } = action.payload
      state.user = user
      state.token = token
      state.userType = userType
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('userType', userType)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.userType = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserType = (state) => state.auth.userType
