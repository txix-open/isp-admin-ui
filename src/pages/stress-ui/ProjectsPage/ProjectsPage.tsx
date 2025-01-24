import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Space, Spin, Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ProjectType } from '@pages/stress-ui/ProjectsPage/project.ts'
import projectApi from '@services/projectService.ts'
import { dateFormats } from '@constants/date.ts'
import { routePaths } from '@routes/routePaths.ts'

const ProjectsPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = projectApi.useGetAllProjectsQuery()
  const [deleteProject] = projectApi.useDeleteProjectMutation()

  if (isLoading) return <Spin />
  if (isError) return <p>Error</p>

  const columns: ColumnsType<ProjectType> = [
    {
      key: 'id',
      title: 'Id',
      dataIndex: 'id',

    },
    {
      key: 'name',
      title: 'Наименование',
      dataIndex: 'name'
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
      dataIndex: 'createdAt',
      render: (value: string) => {
        return dayjs(value).format(dateFormats.fullFormat)
      }
    },
    {
      key: 'updatedAt',
      title: ' Дата обновления',
      dataIndex: 'updatedAt',
      render: (value: string) => {
        return dayjs(value).format(dateFormats.fullFormat)
      }
    },
    {
      key: 'control',
      render: (record) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={ <FormOutlined />}
              onClick={() => navigate(`${routePaths.project}/${record.id}`)} />

            <Button
              danger
              onClick={() => {
                deleteProject(record.id)
                .unwrap()
                  .then(() =>  message.success('Проект удален'))
                  .catch(() =>  message.error('Ошибка удаления проекта'))
              }}
              icon={<DeleteOutlined />}
            />

          </Space>
        )
      }
    }
  ]

  return (
    <section>
      <Button style={{marginBottom: "8px"}} type="primary" onClick={() => navigate(`${routePaths.project}/new`)}>
        Создать
      </Button>
      <Table
        size="small"
        columns={columns}
        pagination={{ pageSize: 30 }}
        dataSource={data}
        rowKey={(record) => record.id}
      />
    </section>
  )
}

export default ProjectsPage
