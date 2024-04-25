import { createAsyncThunk } from '@reduxjs/toolkit'

import { apiPaths } from '@constants/api/apiPaths.ts'

import { ProfileDataType } from '@pages/ProfilePage/profile-page.type.ts'

import { apiService } from '@services/apiService.ts'


export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.post<ProfileDataType>(
        apiPaths.getProfile
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
