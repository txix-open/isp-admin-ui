import { DeleteOutlined, FormOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import { Button, message, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from 'antd'
import { ColumnGroupType, ColumnType } from 'antd/es/table'
import { FormComponents } from 'isp-ui-kit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import projectApi from '@services/projectService.ts'
import testApi from '@services/testsService.ts'
import './tests.scss'
import { PlayTestType, TestType } from '@pages/stress-ui/TestsPage/tests.ts'
import { ValidationRules } from '@constants/form/validationRules.ts'
import { ProjectType } from '@pages/stress-ui/ProjectsPage/project.ts'
import { routePaths } from '@routes/routePaths.ts'
import TestEditor from '@pages/stress-ui/TestEditor/TestEditor.tsx'
import ErrorWrapperPage from '@pages/ErrorWrapperPage'
const { FormTextArea, FormInputNumber } = FormComponents


const TestsPage = () => {
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState('')
  const {
    data: allProjects,
    isLoading: isLoadingAllProjects,
    isError: isErrorAllProjects
  } = projectApi.useGetAllProjectsQuery()

  const [deleteTest] = testApi.useDeleteTestMutation()
  const [runTest] = testApi.useRunTestMutation()
  const [stopTest] = testApi.useStopTestMutation()

  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)
  const [isLaunchesModalOpen, setIsLaunchesModalOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<TestType>()


  const [tests, setTests] = useState<TestType[]>([])

  const { handleSubmit, control } = useForm<TestType | PlayTestType>({
    mode: 'onChange',
    defaultValues: {}
  })


  useEffect(() => {
    setSelectedProject(localStorage.getItem('selectedProject') || '')
  }, [])


  const { data: testsFromServer, isLoading: isLoadingTests } =
    testApi.useGetAllTestsQuery(selectedProject ? selectedProject : '', {
      skip: !selectedProject,
      pollingInterval: 3000
    })

  useEffect(() => {
    if (testsFromServer) {
      setTests(testsFromServer)
    }
  }, [testsFromServer])

  const handleOpenScenarioModal = (scenario: TestType) => {
    setSelectedScenario(scenario)
    setIsScenarioModalOpen(true)
  }

  const handlePlay = (record: PlayTestType) => {
    const modal = Modal.confirm({
      title: 'Запустить тест',
      footer: false,
      content: (
        <form>
          <FormTextArea
            control={control}
            name="comment"
            label="Комментарий"
            rules={{ required: ValidationRules.required }}
          />
          <FormInputNumber control={control} name="dataOffset" label="dataOffset" />
          <Space>
            <Button onClick={() => modal.destroy()} danger>
              Закрыть
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit((data) => {
                const newData = { ...record, ...data }
                runTest(newData)
                    .unwrap()
                    .then(() => {
                      message.success('Тест запущен')
                      setTests((prev) =>
                        prev.map((test) =>
                          test.id === record.id ? { ...test, status: 'RUNNING' } : test
                        )
                      )
                    })
                    .catch(() => message.error('Ошибка запуска теста'))
                modal.destroy()
              })}
            >
              Запустить
            </Button>
          </Space>
        </form>
      ),
    })
  }

  const handleStop = (record: PlayTestType) => {
    stopTest(record.id)
      .unwrap()
      .then(() => {
        message.success('Тест остановлен')
        setTests((prev) =>
          prev.map((test) =>
            test.id === record.id ? { ...test, status: 'READY' } : test
          )
        )
      })
      .catch(() => message.error('Ошибка остановки теста'))
  }

  const handleChange = (value: string) => {
    setSelectedProject(value)
    localStorage.setItem('selectedProject', value)
  }

  const transformToSelectOptions = (data: ProjectType[] | []) => {
    if (data.length) {
      return data.map((item) => ({
        value: item.id,
        label: item.name
      }))
    }
  }

  const columns: (ColumnGroupType<TestType> | ColumnType<TestType>)[] = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Сценарий',
      dataIndex: 'scenario',
      key: 'scenario',
      render: (_, record) => (
        <a onClick={() => handleOpenScenarioModal(record)}>Смотреть сценарий</a>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'READY' | 'RUNNING') => (
        <Tag color={status === 'READY' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handlePlay(record)}
            disabled={record.status === 'RUNNING'}
            icon={<PlayCircleOutlined />}
          />
          <Button
            danger
            onClick={() => handleStop(record)}
            disabled={record.status === 'READY'}
            icon={<StopOutlined />}
          />
          <Button
            type="primary"
            onClick={() => navigate(`${routePaths.test}/${record.id}`)}
            icon={<FormOutlined />}
          />
          <Popconfirm
            title="Удалить этот тест?"
            onConfirm={() => {
              deleteTest(record.id)
                .unwrap()
                .then(() => message.success('Тест удален'))
                .catch(() => message.error('Ошибка удаления теста'))
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]
  
  if (isLoadingAllProjects) return <Spin />
  if (isErrorAllProjects) return   <ErrorWrapperPage />

  const projectName =
    allProjects &&
    allProjects.find((project) => project.id === selectedProject)?.name

  return (
    <section className="tests-page">
      {allProjects && (
        <div style={{ marginBottom: 8 }}>
          <Select
            style={{ marginRight: 8 }}
            value={projectName}
            onChange={handleChange}
            placeholder="Выберите проект"
            className="tests-select"
            options={transformToSelectOptions(allProjects)}
          />

          <Button
            type="primary"
            onClick={() => navigate(`${routePaths.test}/new`)}
          >
            Создать
          </Button>
        </div>
      )}

      {}
      {isLoadingTests ? (
        <Spin />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={tests}
            rowKey={(record) => record.id}
          />
          <Modal
            title="Сценарий"
            open={isScenarioModalOpen}
            onCancel={() => setIsScenarioModalOpen(false)}
            footer={null}
          >
            {selectedScenario?.id && (
              <TestEditor readOnly={true} propsId={selectedScenario.id} />
            )}
          </Modal>
          <Modal
            title="Запуски"
            open={isLaunchesModalOpen}
            onCancel={() => setIsLaunchesModalOpen(false)}
            footer={null}
          >
            <p>Таблица с запусками</p>
          </Modal>
        </>
      )}
    </section>
  )
}

export default TestsPage
