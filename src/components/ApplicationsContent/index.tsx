import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined
} from '@ant-design/icons'
import { Button, message, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FormComponents } from 'isp-ui-kit'
import { EmptyData } from 'isp-ui-kit/dist/Layout'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ValidationRules } from '@constants/form/validationRules.ts'

import Modal from '@widgets/Modal'

import CanEdit from '@components/CanEdit'

import {
  ApplicationAppType,
  ApplicationsServiceType,
  ApplicationTokenType,
  NewApplicationAppType,
  NewApplicationTokenType,
  UpdateApplicationAppType
} from '@pages/ApplicationsPage/applications.type.ts'

import applicationsApi from '@services/applicationsService.ts'
import tokensApi from '@services/tokensService.ts'

import './applications-content.scss'

const { FormInput, FormSelect } = FormComponents

interface ApplicationsContentPropTypes {
  id: number
}

const ApplicationsContent: FC<ApplicationsContentPropTypes> = (id) => {
  const { data: applications, isLoading: isLoadingApplicationsContent = [] } =
    applicationsApi.useGetApplicationsByServiceIdQuery(id)

  const [createApplicationService] =
    applicationsApi.useCreateApplicationServiceMutation()
  const [updateApplication] =
    applicationsApi.useUpdateApplicationsServiceMutation()
  const [removeApplicationsService] =
    applicationsApi.useRemoveApplicationsServiceMutation()
  const [createToken] = tokensApi.useCreateTokenMutation()
  const [showApplicationsModal, setShowApplicationsModal] = useState({
    addModal: false,
    updateModal: false,
    addToken: false
  })
  const [currentApplicationsApp, setCurrentApplicationsApp] =
    useState<ApplicationAppType>()

  const {
    handleSubmit,
    control: controlApplicationApp,
    reset
  } = useForm<ApplicationAppType>({
    mode: 'onChange'
  })

  const { handleSubmit: handleSubmitTokens, control: controlTokens } =
    useForm<ApplicationTokenType>({
      mode: 'onChange'
    })

  const handleShowUpdateModalApplicationApp = (data: ApplicationAppType) => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      updateModal: true
    })
    setCurrentApplicationsApp(data)
  }
  const handleShowCreateModalApplicationApp = () => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      addModal: true
    })
  }
  const handleShowAddModalToken = (data: ApplicationAppType) => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      addToken: true
    })
    setCurrentApplicationsApp(data)
  }

  const handleUpdateApplicationApp = (data: UpdateApplicationAppType) => {
    if (currentApplicationsApp) {
      const updateApplications: UpdateApplicationAppType = {
        id: currentApplicationsApp.id,
        name: data.name,
        description: data.description
          ? data.description
          : currentApplicationsApp.description,
        serviceId: id.id,
        type: 'SYSTEM'
      }
      updateApplication({ ...currentApplicationsApp, ...updateApplications })
        .unwrap()
        .then(() => {
          setShowApplicationsModal({
            ...showApplicationsModal,
            updateModal: false
          })
          reset()
          message.info('Элемент сохранен')
        })
        .catch(() => message.error('Ошибка обновления элемента'))
    }
  }

  const handleCreateApplicationApp = (data: NewApplicationAppType) => {
    const newApplicationApp: NewApplicationAppType = {
      name: data.name,
      description: data.description,
      serviceId: id.id,
      type: 'SYSTEM'
    }

    createApplicationService(newApplicationApp)
      .unwrap()
      .then(message.info('Элемент сохранен'))
      .catch((e) => message.error(e))
    setShowApplicationsModal({
      ...showApplicationsModal,
      addModal: false
    })
    reset()
  }
  const handleRemoveApplicationApp = (id: number) =>
    removeApplicationsService([id])
      .then(() => {
        message.info('Элемент удален')
      })
      .catch(message.error('Ошибка добавления элемента'))

  const handleCreateToken = (data: NewApplicationTokenType) => {
    if (currentApplicationsApp) {
      const newToken: NewApplicationTokenType = {
        expireTimeMs: data.expireTimeMs,
        appId: currentApplicationsApp.id
      }

      createToken(newToken)
        .then(() => {
          setShowApplicationsModal({
            ...showApplicationsModal,
            addToken: false
          })
          reset()
          message.info('Элемент добавлен')
        })
        .catch(() => {
          message.error('Ошибка добавления элемента')
        })
    }
  }

  const columns: ColumnsType<ApplicationsServiceType> = [
    {
      title: 'id',
      dataIndex: ['app', 'id'],
      key: 'id'
    },
    {
      title: 'Наименование',
      dataIndex: ['app', 'name'],
      key: 'name'
    },
    {
      title: 'Описание',
      dataIndex: ['app', 'description'],
      key: 'description'
    },
    {
      title: 'Type',
      dataIndex: ['app', 'type'],
      key: 'Type'
    },
    {
      title: 'Количество токенов',
      dataIndex: 'tokens',
      key: 'tokensAmount',
      render: (value) => {
        return value.length
      }
    },
    {
      title: 'Действия',
      dataIndex: 'app',
      key: 'actions',
      render: (record) => {
        return (
          <CanEdit>
            <Button
              danger
              className="applications-content__update-btn"
              onClick={() => {
                handleShowUpdateModalApplicationApp(record)
              }}
              icon={<EditOutlined />}
            />
            <Button
              onClick={() => handleRemoveApplicationApp(record.id)}
              icon={<DeleteOutlined />}
            />
          </CanEdit>
        )
      }
    }
  ]

  const tokensOptions = [
    {
      value: -1,
      label: 'Бессрочно'
    },
    {
      value: 3600000,
      label: 'Один час'
    },
    {
      value: 86400000,
      label: 'Один день'
    },
    {
      value: 2592000000,
      label: '30 дней'
    },
    {
      value: 31536000000,
      label: 'Один год'
    }
  ]

  if (!id) {
    return <EmptyData />
  }

  if (isLoadingApplicationsContent) {
    return <Spin className="spin" />
  }

  return (
    <section className="applications-content">
      <CanEdit>
        <Button
          className="applications-content__add-btn"
          type="primary"
          onClick={handleShowCreateModalApplicationApp}
        >
          Добавить
        </Button>
      </CanEdit>
      <Table
        expandable={{
          expandedRowRender: (record) => (
            <CanEdit>
              <Button
                className="applications-content__addToken-btn"
                onClick={() => handleShowAddModalToken(record.app)}
              >
                <PlusSquareOutlined /> Добавить токен
              </Button>
            </CanEdit>
          )
        }}
        className="appliactions-content__table"
        rowKey={(record) => record.app.id}
        pagination={false}
        dataSource={applications}
        columns={columns}
      />

      <Modal
        onOk={handleSubmit(handleUpdateApplicationApp)}
        title="Редактировать"
        open={showApplicationsModal.updateModal}
        footer={{ onCanselText: 'Отмена', onOkText: 'Сохранить' }}
        onClose={() =>
          setShowApplicationsModal({
            ...showApplicationsModal,
            updateModal: false
          })
        }
      >
        <form>
          <FormInput
            control={controlApplicationApp}
            name="name"
            label="Наименование"
            rules={{ required: ValidationRules.required }}
          />
          <FormInput
            control={controlApplicationApp}
            label="Описание"
            name="description"
          />
        </form>
      </Modal>

      <Modal
        onOk={handleSubmit(handleCreateApplicationApp)}
        title="Добавить"
        open={showApplicationsModal.addModal}
        footer={{ onCanselText: 'Отмена', onOkText: 'Сохранить' }}
        onClose={() =>
          setShowApplicationsModal({
            ...showApplicationsModal,
            addModal: false
          })
        }
      >
        <form>
          <FormInput
            control={controlApplicationApp}
            name="name"
            label="Наименование"
            rules={{ required: ValidationRules.required }}
          />
          <FormInput
            control={controlApplicationApp}
            label="Описание"
            name="description"
          />
        </form>
      </Modal>

      <Modal
        onOk={handleSubmitTokens(handleCreateToken)}
        title="Добавить"
        open={showApplicationsModal.addToken}
        footer={{ onCanselText: 'Отмена', onOkText: 'Сохранить' }}
        onClose={() =>
          setShowApplicationsModal({
            ...showApplicationsModal,
            addToken: false
          })
        }
      >
        <form>
          <FormSelect
            options={tokensOptions}
            name="expireTimeMs"
            control={controlTokens}
            label="Время действия"
            rules={{ required: ValidationRules.required }}
          />
        </form>
      </Modal>
    </section>
  )
}

export default ApplicationsContent
