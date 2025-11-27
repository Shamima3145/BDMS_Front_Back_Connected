import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Requests', 'Inventory', 'Donors'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getUserProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getRequests: builder.query({
      query: (type) => `/requests?type=${type}`,
      providesTags: ['Requests'],
    }),
    updateRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/requests/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Requests'],
    }),
    getInventory: builder.query({
      query: () => '/inventory',
      providesTags: ['Inventory'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetRequestsQuery,
  useUpdateRequestStatusMutation,
  useGetInventoryQuery,
} = apiSlice
