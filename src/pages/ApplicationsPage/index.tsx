import { message, Spin } from 'antd'
import { Layout, FormComponents } from 'isp-ui-kit'
import { ColumnItem } from 'isp-ui-kit/dist/Layout/Column/column.type'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { ValidationRules } from '@constants/form/validationRules.ts'

import ListItem from '@widgets/ListItem'
import Modal from '@widgets/Modal'

import ApplicationsContent from '@components/ApplicationsContent'

import {
  NewApplicationsGroupType,
  ApplicationsGroupType,
  UpdateApplicationsGroupType
} from '@pages/ApplicationsPage/applications.type.ts'

import { setSearchValue, setSelectedItemId } from '@utils/columnLayoutUtils.ts'
import { filterFirstColumnItems } from '@utils/firstColumnUtils.ts'

import useRole from '@hooks/useRole.tsx'

import applicationsGroupApi from '@services/applicationsGroupService.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeysType } from '@type/roles.type.ts'

import './applications-page.scss'

const { Column, ContentColumn, EmptyData } = Layout
const { FormInput } = FormComponents

const ApplicationsPage = () => {
  const navigate = useNavigate()
  const { id: selectedItemId = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams('')
  const { hasPermission } = useRole()

  const {
    data: applicationsGroup = [],
    isError: isErrorApplicationsGroup,
    isLoading: isLoadingApplicationsGroup
  } = applicationsGroupApi.useGetApplicationsGroupByDomainIdQuery({ id: 2 })

  const [createApplicationsGroup] =
    applicationsGroupApi.useCreateApplicationsGroupMutation()
  const [updateApplicationsGroup] =
    applicationsGroupApi.useUpdateApplicationsGroupMutation()

  const [deleteApplicationsGroup] =
    applicationsGroupApi.useRemoveApplicationsGroupMutation()

  const isPageAvailable = hasPermission(PermissionKeysType.read)
  const hasRevokePermission = hasPermission(PermissionKeysType.write)

  useEffect(() => {
    if (!isPageAvailable) {
      navigate(routePaths.home)
    }
  }, [isPageAvailable])

  const [showApplicationsModal, setShowApplicationsModal] = useState({
    addModal: false,
    updateModal: false
  })
  const searchValue = searchParams.get('search') || ''
  const { handleSubmit, control, reset } = useForm<ApplicationsGroupType>({
    mode: 'onChange'
  })

  if (isErrorApplicationsGroup) {
    return <EmptyData />
  }

  if (isLoadingApplicationsGroup) {
    return <Spin className="spin" />
  }

  const renderColumnItems = (item: ColumnItem<any>) => <ListItem item={item} />

  const addApplicationModal = () => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      addModal: true
    })
  }

  const updateApplicationModal = () => {
    setShowApplicationsModal({
      ...showApplicationsModal,
      updateModal: true
    })
  }

  const handleAddApplicationGroup = (data: any) => {
    const newService: NewApplicationsGroupType = {
      name: data.name,
      description: data.description,
      domainId: 2
    }
    createApplicationsGroup(newService)
    setShowApplicationsModal({
      ...showApplicationsModal,
      addModal: false
    })
    reset()
    message.info('Сервис успешно создан')
  }

  const handleUpdateApplicationsGroup = (data: NewApplicationsGroupType) => {
    const updateService: UpdateApplicationsGroupType = {
      name: data.name,
      description: data.description,
      domainId: 2,
      id: Number(selectedItemId)
    }

    updateApplicationsGroup(updateService)
    setShowApplicationsModal({
      ...showApplicationsModal,
      updateModal: false
    })

    reset()
    message.info('Сервис успешно отредактирован')
  }

  const renderMainContent = () => {
    if (!selectedItemId) {
      return <EmptyData />
    }
    return <ApplicationsContent id={Number(selectedItemId)} />
  }

  return (
    <main className="applications-page ">
      <div className="applications-page__wrap three-columns">
        <Column
          onUpdateItem={updateApplicationModal}
          showUpdateBtn={!!selectedItemId}
          onAddItem={addApplicationModal}
          onRemoveItem={() => deleteApplicationsGroup([Number(selectedItemId)])}
          items={filterFirstColumnItems(
            applicationsGroup as unknown as ColumnItem<ApplicationsGroupType>[],
            searchValue
          )}
          renderItems={renderColumnItems}
          searchValue={searchValue}
          selectedItemId={selectedItemId}
          setSelectedItemId={(itemId) => {
            setSelectedItemId(
              `${routePaths.applications}`,
              itemId,
              searchValue,
              navigate
            )
          }}
          onChangeSearchValue={(value) =>
            setSearchValue(value, setSearchParams)
          }
        />

        <ContentColumn>{renderMainContent()}</ContentColumn>

        <Modal
          onOk={handleSubmit(handleAddApplicationGroup)}
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
              control={control}
              name="name"
              label="Наименование"
              rules={{ required: ValidationRules.required }}
            />
            <FormInput control={control} label="Описание" name="description" />
          </form>
        </Modal>

        <Modal
          onOk={handleSubmit(handleUpdateApplicationsGroup)}
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
              control={control}
              name="name"
              label="Наименование"
              rules={{ required: ValidationRules.required }}
            />
            <FormInput control={control} label="Описание" name="description" />
          </form>
        </Modal>
      </div>
    </main>
  )
}

export default ApplicationsPage
