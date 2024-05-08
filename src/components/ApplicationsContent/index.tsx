import { LinkOutlined } from '@ant-design/icons'
import { List, message, Spin, Tooltip } from 'antd'
import { FormComponents, Layout } from 'isp-ui-kit'
import { ColumnItem } from 'isp-ui-kit/dist/Layout/Column/column.type'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { ValidationRules } from '@constants/form/validationRules.ts'

import Modal from '@widgets/Modal'

import TokenContent from '@components/TokenContent'

import {
  ApplicationAppType,
  ApplicationsServiceType,
  NewApplicationAppType,
  UpdateApplicationAppType
} from '@pages/ApplicationsPage/applications.type.ts'

import { setSearchValue, setSelectedItemId } from '@utils/columnLayoutUtils.ts'
import { filterFirstColumnItems } from '@utils/firstColumnUtils.ts'

import applicationsApi from '@services/applicationsService.ts'

import { routePaths } from '@routes/routePaths.ts'

import './applications-content.scss'

const { FormInput } = FormComponents
const { EmptyData, Column, ContentColumn } = Layout

interface ApplicationsContentPropTypes {
  selectedItemId: number
  currentApplicationsApp: number
  setCurrentApplicationsApp: Dispatch<SetStateAction<number>>
}

const ApplicationsContent: FC<ApplicationsContentPropTypes> = ({
  selectedItemId,
  setCurrentApplicationsApp
}) => {
  const { data: applications, isLoading: isLoadingApplicationsContent = [] } =
    applicationsApi.useGetApplicationsByServiceIdQuery({
      id: selectedItemId
    })

  const [createApplicationService] =
    applicationsApi.useCreateApplicationServiceMutation()
  const [updateApplication] =
    applicationsApi.useUpdateApplicationsServiceMutation()
  const [removeApplicationsService] =
    applicationsApi.useRemoveApplicationsServiceMutation()
  const [showApplicationsModal, setShowApplicationsModal] = useState({
    addModal: false,
    updateModal: false
  })
  const [searchParams, setSearchParams] = useSearchParams('')
  const searchAppValue = searchParams.get('appSearch') || ''
  const navigate = useNavigate()
  const { appId = '' } = useParams()

  const {
    handleSubmit,
    control: controlApplicationApp,
    reset
  } = useForm<ApplicationAppType>({
    mode: 'onChange'
  })
  const updateApplicationModal = () => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      updateModal: true
    })
  }
  const addApplicationModal = () => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      addModal: true
    })
  }
  const renderTokenContent = () => {
    if (!appId) {
      return <EmptyData />
    }

    return <TokenContent key={appId} id={Number(appId)} />
  }

  const handleUpdateApplicationApp = (data: UpdateApplicationAppType) => {
    const currentElement = applications?.filter(
      (el) => el.app.id === Number(appId)
    )[0].app
    if (currentElement) {
      const updateApplications: UpdateApplicationAppType = {
        id: currentElement.id,
        name: data.name,
        description: data.description
          ? data.description
          : currentElement.description,
        serviceId: selectedItemId,
        type: 'SYSTEM'
      }
      updateApplication({ ...currentElement, ...updateApplications })
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
      serviceId: selectedItemId,
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
      .unwrap()
      .then(() => message.success('Элемент удален'))
      .catch(() => message.info('Ошибка удаления элемента'))

  const renderColumnItems = (item: ColumnItem<any>) => {
    return (
      <List.Item>
        <Tooltip mouseEnterDelay={1} title={item.name}>
          <List.Item.Meta title={item.name} />
          <div
            className="link-btn"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/appAccess/${item.id}`)
            }}
          >
            <LinkOutlined />
          </div>
        </Tooltip>
      </List.Item>
    )
  }

  if (!selectedItemId) {
    return <EmptyData />
  }
  if (selectedItemId)
    if (isLoadingApplicationsContent) {
      return <Spin className="spin" />
    }

  return (
    <section className="applications-content">
      <Column
        title="Приложения"
        onUpdateItem={updateApplicationModal}
        showUpdateBtn={!!appId}
        onAddItem={addApplicationModal}
        onRemoveItem={() => handleRemoveApplicationApp(Number(appId))}
        items={filterFirstColumnItems(
          applications?.map((el) => {
            return el.app
          }) as unknown as ColumnItem<ApplicationsServiceType>[],
          searchAppValue
        )}
        renderItems={renderColumnItems}
        searchValue={searchAppValue}
        selectedItemId={appId}
        setSelectedItemId={(itemId: string) => {
          setCurrentApplicationsApp(Number(itemId))
          setSelectedItemId(
            `${routePaths.applicationsGroup}/${selectedItemId}/${routePaths.application}`,
            itemId.toString(),
            searchAppValue,
            navigate
          )
        }}
        onChangeSearchValue={(value: string) => {
          setSearchValue(
            value.trim().toLowerCase(),
            setSearchParams,
            'appSearch'
          )
        }}
      />
      <ContentColumn>{renderTokenContent()}</ContentColumn>

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
    </section>
  )
}

export default ApplicationsContent
