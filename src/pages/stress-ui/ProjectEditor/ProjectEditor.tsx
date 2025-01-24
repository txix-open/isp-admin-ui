import { Button, message, Space, Spin } from 'antd'
import { FormComponents } from 'isp-ui-kit'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { ValidationRules } from '@constants/form/validationRules.ts'

import { ProjectType } from '@pages/stress-ui/ProjectsPage/project.ts'

import projectApi from '@services/projectService.ts'

import { routePaths } from '@routes/routePaths.ts'

const { FormInput } = FormComponents

const ProjectEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const validatedId = id && id !== 'new' ? id : ''
  const [getOneProject, { data, error, isLoading }] =
    projectApi.useGetOneProjectMutation()
  const [updateProject] = projectApi.useUpdateProjectMutation()
  const [createProject] = projectApi.useCreateProjectMutation()

  const isNew = id === 'new'

  useEffect(() => {
    const handleFetchProject = async () => {
      try {
        await getOneProject(validatedId).unwrap()
      } catch (err) {
        console.error('Error fetching project:', err)
      }
    }
    handleFetchProject().then()
  }, [])

  const { handleSubmit, control, reset } = useForm<ProjectType>({
    mode: 'onChange',
    defaultValues: isNew ? {} : data
  })

  useEffect(() => {
    reset(data)
  }, [data])

  if (isLoading) return <Spin />
  if (!isNew && error) return <p>Error</p>

  const handleSubmitForm = (data: ProjectType) => {
    console.log('handleSubmitForm')
    if (isNew) {
      const newData = {
        name: data.name
      }
      createProject(newData)
        .unwrap()
        .then(() => {
          message.success('Проект создан')
          navigate(routePaths.projects)
        })
        .catch(() => message.error('Ошибка создания проекта'))
    } else {
      const updateData = {
        ...data,
        name: data.name
      }
      updateProject(updateData as ProjectType)
        .unwrap()
        .then(() => {
          message.success('Проект изменен')
          navigate(routePaths.projects)
        })
        .catch(() => message.error('Ошибка изменения проекта'))
    }
  }

  return (
    <section className="project-editor">
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <FormInput
          style={{ maxWidth: 185 }}
          control={control}
          name="name"
          label="Наименование"
          rules={{ required: ValidationRules.required }}
        />
        <Space>
          <Button onClick={() => navigate(routePaths.projects)}>Назад</Button>
          <Button type="primary" htmlType="submit">
            {isNew ? 'Создать' : 'Сохранить'}
          </Button>
        </Space>
      </form>
    </section>
  )
}

export default ProjectEditor
