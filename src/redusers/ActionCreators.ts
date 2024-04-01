import {createAsyncThunk} from '@reduxjs/toolkit';
import {ProfileDataType} from "../types/profile.type.ts";
import {apiService} from "../services/apiService.ts";
import {apiPaths} from "../constants/api/apiPaths.ts";

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, {rejectWithValue}) => {
        try {
            const response = await apiService.post<ProfileDataType>(
                apiPaths.baseUrl,
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
