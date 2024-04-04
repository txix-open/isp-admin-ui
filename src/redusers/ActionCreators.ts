import { createAsyncThunk } from '@reduxjs/toolkit'

import { apiPaths } from '../constants/api/apiPaths.ts'
import { apiService } from '../services/apiService.ts'
import { ProfileDataType } from '../types/profile.type.ts'

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.post<ProfileDataType>(apiPaths.baseUrl)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
