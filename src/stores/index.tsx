import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { theme } from 'antd'
import { MapToken, SeedToken } from 'antd/es/theme/interface'
import { createContext, Dispatch, SetStateAction } from 'react'

import sessionServiceApi from '@services/sessionService.ts'
import accessListApi from '@services/accessListService.ts'
import appApi from '@services/appService.ts'
import roleApi from '@services/roleService.ts'
import securityLogServiceApi from '@services/securityLogService.ts'
import userServiceApi from '@services/userService.ts'
import routeApi from '@services/routeService.ts'

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
  [roleApi.reducerPath]: roleApi.reducer,
  [userServiceApi.reducerPath]: userServiceApi.reducer,
  [sessionServiceApi.reducerPath]: sessionServiceApi.reducer,
  [securityLogServiceApi.reducerPath]: securityLogServiceApi.reducer,
  [appApi.reducerPath]: appApi.reducer,
  [accessListApi.reducerPath]: accessListApi.reducer,
  [routeApi.reducerPath]: routeApi.reducer
})

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        roleApi.middleware,
        userServiceApi.middleware,
        securityLogServiceApi.middleware,
        appApi.middleware,
        accessListApi.middleware,
        routeApi.middleware,
        userServiceApi.middleware,
        sessionServiceApi.middleware
      )
  })

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
