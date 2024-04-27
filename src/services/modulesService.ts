import { createApi } from '@reduxjs/toolkit/query/react'

import { apiPaths } from '@constants/api/apiPaths.ts'

import { ModuleType } from '@pages/ModulesPage/module.type.ts'

import { axiosBaseQuery } from '@utils/apiUtils.ts'

const modulesServiceApi = createApi({
  reducerPath: 'modulesServiceApi',
  refetchOnFocus: true,
  tagTypes: ['modules'],
  baseQuery: axiosBaseQuery({ baseUrl: apiPaths.baseConfigUrl }),
  endpoints: (builder) => ({
    getModules: builder.query<ModuleType[], string>({
      query: () => ({ url: apiPaths.getModules, data: { limit: 1000 } }),
      providesTags: () => ['modules']
    }),
    removeModule: builder.mutation<void, string>({
      query: (id) => ({
        url: apiPaths.deleteModule,
        data: [id]
      }),
      invalidatesTags: ['modules']
    })
  })
})

export default modulesServiceApi
