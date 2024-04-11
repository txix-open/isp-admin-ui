import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { theme } from 'antd'
import { MapToken, SeedToken } from 'antd/es/theme/interface'
import { createContext, Dispatch, SetStateAction } from 'react'

import roleApi from '@services/roleService.ts'

import profileReducer from './redusers/ProfileSlice.ts'


export interface ContextProps {
  setTheme: Dispatch<
    SetStateAction<{ algorithm: (token: SeedToken) => MapToken }>
  >
}

export const Context = createContext<ContextProps>({
  setTheme: () => theme.defaultAlgorithm
})

const rootReducer = combineReducers({
  profileReducer,
  [roleApi.reducerPath]: roleApi.reducer
})

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([roleApi.middleware])
  })

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
