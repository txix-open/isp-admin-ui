import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@utils/apiUtils'
import { getConfigProperty } from '@utils/configUtils'
import { NewProjectType, ProjectType } from '@pages/stress-ui/ProjectsPage/project.ts'
import { apiPaths } from '@constants/api/apiPaths.ts'

const projectApi = createApi({
  reducerPath: 'projectApi',
  refetchOnFocus: true,
  tagTypes: ['Project'],
  baseQuery: baseQuery(apiPaths.baseStressUrl, {
    'X-APPLICATION-TOKEN': getConfigProperty(
      'APP_TOKEN',
      import.meta.env.VITE_APP_TOKEN
    )
  }),
  endpoints: (builder) => ({
    getAllProjects: builder.query<ProjectType[], void>({
      query: () => ({
        url: apiPaths.getAllProject,
        method: 'POST',
        body: {}
      }),
      providesTags: () => ['Project']
    }),
    createProject: builder.mutation<ProjectType, NewProjectType>({
      query: (newProject) => ({
        url: apiPaths.createProject,
        method: 'POST',
        body: newProject
      }),
      invalidatesTags: ['Project']
    }),
    updateProject: builder.mutation<void, ProjectType>({
      query: (project) => ({
        url: apiPaths.updateProject,
        method: 'POST',
        body: project
      }),
      invalidatesTags: ['Project']
    }),
    getOneProject: builder.mutation<ProjectType, string>({
      query: (id) => ({
        url: apiPaths.getOneProject,
        method: 'POST',
        body: { id }
      }),
      invalidatesTags: ['Project']
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: apiPaths.deleteProject,
        method: 'POST',
        body: { id }
      }),
      invalidatesTags: ['Project']
    })
  })
})

export default projectApi
