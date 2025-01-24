import { createApi } from '@reduxjs/toolkit/query/react'

import { apiPaths } from '@constants/api/apiPaths.ts'

import {
  NewTestType,
  PlayTestType,
  TestType
} from '@pages/stress-ui/TestsPage/tests.ts'

import { baseQuery } from '@utils/apiUtils.ts'
import { getConfigProperty } from '@utils/configUtils'

const testApi = createApi({
  reducerPath: 'testApi',
  refetchOnFocus: true,
  tagTypes: ['Test'],
  baseQuery: baseQuery(apiPaths.baseStressUrl, {
    'X-APPLICATION-TOKEN': getConfigProperty(
      'APP_TOKEN',
      import.meta.env.VITE_APP_TOKEN
    )
  }),
  endpoints: (builder) => ({
    getAllTests: builder.query<TestType[], string>({
      query: (projectId) => ({
        url: apiPaths.getAllTests,
        method: 'POST',
        body: { projectId }
      }),
      providesTags: () => ['Test']
    }),
    createTest: builder.mutation<TestType, NewTestType>({
      query: (newTest) => ({
        url: apiPaths.createTest,
        method: 'POST',
        body: newTest
      }),
      invalidatesTags: ['Test']
    }),
    runTest: builder.mutation<void, PlayTestType>({
      query: (test) => ({
        url: apiPaths.runTest,
        method: 'POST',
        body: test
      }),
      invalidatesTags: ['Test']
    }),
    stopTest: builder.mutation<void, string>({
      query: (id) => ({
        url: apiPaths.getOneTest,
        method: 'POST',
        body: { id }
      }),
      invalidatesTags: ['Test']
    }),
    updateTest: builder.mutation<void, TestType>({
      query: (test) => ({
        url: apiPaths.updateTest,
        method: 'POST',
        body: test
      }),
      invalidatesTags: ['Test']
    }),
    getOneTest: builder.mutation<TestType, string>({
      query: (id) => ({
        url: apiPaths.getOneTest,
        method: 'POST',
        body: { id }
      }),
      invalidatesTags: ['Test']
    }),
    deleteTest: builder.mutation<void, string>({
      query: (id) => ({
        url: apiPaths.deleteTest,
        method: 'POST',
        body: { id }
      }),
      invalidatesTags: ['Test']
    })
  })
})

export default testApi
