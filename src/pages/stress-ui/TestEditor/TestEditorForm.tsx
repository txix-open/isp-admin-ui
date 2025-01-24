import { Button, Card, Space } from 'antd'
import { FormComponents } from 'isp-ui-kit'
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ValidationRules } from '@constants/form/validationRules.ts'

import { ObjectFieldRenderer } from '@pages/stress-ui/ObjectFieldRenderer'
import { TestType } from '@pages/stress-ui/TestsPage/tests.ts'

import { routePaths } from '@routes/routePaths.ts'

const { FormInput, FormInputNumber, FormCheckbox } = FormComponents

export interface TestFormProps {
  initialValues: TestType
  onSubmit: (data: TestType) => void
  readOnly?: boolean
  isNew?: boolean
}

const TestForm = ({
  initialValues = {} as TestType,
  onSubmit,
  readOnly = false,
  isNew
}: TestFormProps) => {
  const navigate = useNavigate()
  const { handleSubmit, control, reset } = useForm({
    mode: 'onChange',
    defaultValues: initialValues
  })

  const {
    fields: requestFields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'scenario.requests'
  })

  const {
    fields: rpsStepsFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control,
    name: 'scenario.rps.steps'
  })

  useEffect(() => {
    reset(initialValues)
  }, [initialValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Space style={{ marginBottom: 8 }}>
        {!readOnly && (
          <>
            <Button onClick={() => navigate(routePaths.tests)}>Назад</Button>

            <Button type="primary" htmlType="submit" disabled={readOnly}>
              {isNew ? 'Создать' : 'Сохранить'}
            </Button>
          </>
        )}
      </Space>

      <Card>
        <FormInput
          style={{ maxWidth: 185 }}
          disabled={readOnly}
          control={control}
          name="name"
          label="Наименование теста"
          rules={{ required: ValidationRules.required }}
        />
        <FormInput
          style={{ maxWidth: 185 }}
          disabled={readOnly}
          control={control}
          name="description"
          label="Описание"
          rules={{ required: ValidationRules.required }}
        />
      </Card>
      <Card>
        <h4>Global Headers</h4>
        <ObjectFieldRenderer
          readOnly={readOnly}
          control={control}
          name={'scenario.globalHeaders'}
        />
      </Card>
      <Card>
        <h4>Пул</h4>
        <FormInput
          style={{ maxWidth: 185 }}
          disabled={readOnly}
          control={control}
          name="scenario.pool.dialTimeout"
          label="Тайм-аут подключения"
        />
        <FormCheckbox
          disabled={readOnly}
          control={control}
          name="scenario.pool.enableHttp2"
          label="Включить HTTP/2"
        />
        <FormCheckbox
          disabled={readOnly}
          control={control}
          name="scenario.pool.enableKeepalive"
          label="Включить Keepalive"
        />
        <FormInputNumber
          disabled={readOnly}
          control={control}
          name="scenario.pool.maxIdleCons"
          label="Максимальное количество соединений"
        />
      </Card>

      <Card>
        <h4>Запросы</h4>
        {requestFields.map((field, index) => (
          <Card key={field.id}>
            <h4>ammo</h4>
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.endpoint.method`}
              label="Метод"
              rules={{ required: ValidationRules.required }}
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.endpoint.url`}
              label="URL"
              rules={{ required: ValidationRules.required }}
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.file`}
              label="Файл"
              rules={{ required: ValidationRules.required }}
            />
            <Card>
              <h4>Заголовки</h4>
              <ObjectFieldRenderer
                readOnly={readOnly}
                control={control}
                name={`scenario.requests.${index}.ammo.headers`}
              />
            </Card>
            <FormCheckbox
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.iterable`}
              label="iterable"
            />
            <FormCheckbox
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.templatedBody`}
              label="templatedBody"
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.ammo.type`}
              label="Тип"
              rules={{ required: ValidationRules.required }}
            />

            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.baseUrl`}
              label="Базовый URL"
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.discardResponseBody`}
              label="discardResponseBody"
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.name`}
              label="Имя запроса"
              rules={{ required: ValidationRules.required }}
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.timeout`}
              label="Тайм-аут"
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.requests.${index}.type`}
              label="Тип"
              rules={{ required: ValidationRules.required }}
            />
            <Space>
              <Button danger disabled={readOnly} onClick={() => remove(index)}>
                Удалить запрос
              </Button>
              <Button
                disabled={readOnly}
                onClick={() =>
                  append({
                    name: '',
                    baseUrl: '',
                    timeout: '',
                    ammo: {
                      endpoint: { method: '', url: '' },
                      headers: {},
                      file: '',
                      iterable: false,
                      templatedBody: false,
                      type: ''
                    },
                    debug: false,
                    discardResponseBody: false,
                    type: ''
                  })
                }
              >
                Добавить запрос
              </Button>
            </Space>
          </Card>
        ))}
      </Card>
      <Card>
        <h4>RPS</h4>
        {rpsStepsFields.map((field, index) => (
          <Card key={field.id}>
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.rps.steps.${index}.duration`}
              label="Длительность"
            />
            <FormInputNumber
              disabled={readOnly}
              control={control}
              name={`scenario.rps.steps.${index}.from`}
              label="От"
            />
            <FormInputNumber
              disabled={readOnly}
              control={control}
              name={`scenario.rps.steps.${index}.step`}
              label="step"
            />
            <FormInputNumber
              disabled={readOnly}
              control={control}
              name={`scenario.rps.steps.${index}.to`}
              label="До"
            />
            <FormInput
              style={{ maxWidth: 185 }}
              disabled={readOnly}
              control={control}
              name={`scenario.rps.steps.${index}.type`}
              label="Тип"
            />
            <Button
              danger
              disabled={readOnly}
              onClick={() => removeStep(index)}
            >
              Удалить шаг
            </Button>
          </Card>
        ))}
        <Space direction="vertical">
          <Button
            style={{ marginTop: 8 }}
            disabled={readOnly}
            onClick={() =>
              appendStep({ duration: '', from: 0, to: 0, step: 0, type: '' })
            }
          >
            Добавить шаг
          </Button>
        </Space>
      </Card>
    </form>
  )
}

export default TestForm
