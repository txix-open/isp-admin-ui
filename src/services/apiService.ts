import { message } from 'antd'
import axios, { AxiosError } from 'axios'

import { localStorageKeys } from '@constants/localStorageKeys.ts'

import { getConfigProperty } from '@utils/configUtils.ts'
import { LocalStorage } from '@utils/localStorageUtils.ts'

import { routePaths } from '@routes/routePaths.ts'

import { MSPError } from '@type/index.ts'

export const apiService = axios.create({
  timeout: 15000,
  data: {}
})

apiService.defaults.headers.post['X-APPLICATION-TOKEN'] = getConfigProperty(
  'APP_TOKEN',
  import.meta.env.APP_TOKEN
)

apiService.interceptors.request.use(
  async (config: any) => {
    const headerName = LocalStorage.get(localStorageKeys.HEADER_NAME)
    config.headers[headerName] = LocalStorage.get(localStorageKeys.USER_TOKEN)

    return config
  },
  (error: AxiosError<MSPError>) => Promise.reject(error)
)

apiService.interceptors.response.use(
  async (response: any) => response,
  (error: AxiosError<MSPError>) => {
    if (error.response && error.response.status === 401) {
      window.location.href = routePaths.home
      LocalStorage.clear()
    }

    if (error.response && error.response.status === 500) {
      message.error('Внутренняя ошибка сервиса').then()
    }

    return Promise.reject(error)
  }
)
