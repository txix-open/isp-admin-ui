import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import testApi from '@services/testsService.ts'
import { TestType } from '@pages/stress-ui/TestsPage/tests.ts'
import { routePaths } from '@routes/routePaths.ts'
import TestForm from '@pages/stress-ui/TestEditor/TestEditorForm.tsx'

const TestEditor = ({readOnly, propsId} :{readOnly?: boolean, propsId?: string} ) => {
  const { id: urlId } = useParams()
  const id = urlId || propsId
  const navigate = useNavigate()
  const validatedId = id && id !== 'new' ? id : ''
  const [updateTest] = testApi.useUpdateTestMutation()
  const [createTest] = testApi.useCreateTestMutation()
  const [getOneTest, { data: test, isLoading: isLoadingTest}] = testApi.useGetOneTestMutation()
  const [currentTest, setCurrentTest] = useState<TestType>()

  const defaultTest = {
    comment: '',
    name: '',
    projectId: localStorage.getItem('selectedProject') ?? undefined,
    scenario: {
      globalHeaders: {},
      pool: {
        dialTimeout: '1s',
        enableHttp2: true,
        enableKeepalive: true,
        maxIdleCons: 100,
      },
      requests: [
        {
          ammo: {
            endpoint: {
              method: '',
              url: '',
            },
            file: '',
            headers: {},
            iterable: false,
            templatedBody: false,
            type: 'http',
          },
          baseUrl: '',
          debug: false,
          discardResponseBody: false,
          name: '',
          timeout: '0s',
          type: 'basic',
        },
      ],
      rps: {
        steps: [
          {
            duration: '30s',
            from: 1,
            step: 0,
            to: 100,
            type: 'linear',
          },
        ],
        workers: 10,
      },
    },
  }

  useEffect(() => {
    const handleFetchTest = async () => {
      if (validatedId) {
        try {
          await getOneTest(validatedId).unwrap()
        } catch (err) {
          console.error('Error fetching test:', err)
        }
      } else {
        setCurrentTest(defaultTest as TestType)
      }
    }
    handleFetchTest().then()
  }, [validatedId])

  const isNew = id === 'new'

  useEffect(() => {
    setCurrentTest(test ? test : defaultTest as TestType)
  }, [test])

  if (!isNew && isLoadingTest) return <Spin />

  const handleSubmitForm = (data: TestType) => {
    if (isNew) {
      createTest(data)
        .unwrap()
        .then(() => {
          message.success('Тест создан')
          navigate(routePaths.tests)
        })
        .catch(() => message.error('Ошибка создания теста'))
    } else {
      updateTest(data).unwrap()
        .then(() => {
          message.success('Тест изменен')
          navigate(routePaths.tests)
        })
        .catch(() => message.error('Ошибка изменения теста'))
    }
  }

  return (
    <section className="test-editor">

      {currentTest &&
        <TestForm initialValues={currentTest} onSubmit={handleSubmitForm} readOnly={readOnly} isNew={isNew}/>
      }
    </section>
  )
}

export default TestEditor
