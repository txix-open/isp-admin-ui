import { List, Spin, message } from 'antd'
import { Layout } from 'isp-ui-kit'
import { useEffect } from 'react'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import RolesContent from '@components/RolesContent'

import { filterFirstColumnItems } from '@utils/firstColumnUtils.ts'

import useRole from '@hooks/useRole.tsx'

import roleApi from '@services/roleService.ts'
import userServiceApi from '@services/userService.ts'

import { routePaths } from '@routes/routePaths.ts'

import { NewRoleType, PermissionKeysType, RoleType } from '@type/roles.type.ts'

import './roles-page.scss'

const { Column, EmptyData, NoData } = Layout

const RolesPage = () => {
  const { id: selectedItemId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const fromApp = location.state?.fromApp || false
  const { role, hasPermission } = useRole()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('search') || ''
  const { data: permissionList = [], isLoading: isPermissionLoading } =
    userServiceApi.useGetAllPermissionsQuery()
  const { data = [], isLoading: isRolesLoading } = roleApi.useGetAllRolesQuery()
  const [createRole] = roleApi.useCreateRoleMutation()
  const [updateRole] = roleApi.useUpdateRoleMutation()
  const [removeRole] = roleApi.useRemoveRoleMutation()

  const isPageAvailable = hasPermission(PermissionKeysType.read)
  const isAddRolePermissions = hasPermission(PermissionKeysType.write)
  const isRemoveRolePermissions = hasPermission(PermissionKeysType.write)
  const isLoading = isPermissionLoading || isRolesLoading

  const isNew = selectedItemId === 'new'

  useEffect(() => {
    if (!fromApp) {
      navigate(routePaths.roles)
    }
  }, [fromApp])

  useEffect(() => {
    if (!isPageAvailable) {
      navigate(routePaths.home)
    }
  }, [isPageAvailable])

  useEffect(() => {
    if (!role) {
      navigate(routePaths.error)
    }
  }, [role])

  const setSelectedItemId = (id: string): void => {
    navigate(
      {
        pathname: `${routePaths.roles}/${id}`,
        search: createSearchParams(searchParams).toString()
      },
      { replace: true, state: { fromApp: true } }
    )
  }

  const handleOnChangeSearchValue = (value: string): void => {
    setSearchParams((prev) => {
      if (!value) {
        prev.delete('search')
      } else {
        prev.set('search', value)
      }
      return prev
    })
  }

  const handeOnAddItem = () => setSelectedItemId('new')

  const handleUpdateRole = (formValue: RoleType | NewRoleType) => {
    updateRole(formValue as RoleType)
      .unwrap()
      .then(() => {
        message.success('Элемент успешно добавлен').then()
      })
      .catch(() => message.error('Не удалось сохранить роль'))
  }

  const handleCreateRole = (formValue: NewRoleType) => {
    createRole(formValue)
      .unwrap()
      .then((res) => {
        message.success('Элемент успешно добавлен').then()
        setSelectedItemId(res.id.toString())
      })
      .catch(() => {
        message.error('Не удалось добавить роль').then()
        setSelectedItemId('')
      })
  }

  const handleRemoveRole = (id: any) => {
    const idAsNumber = parseInt(id, 10)
    removeRole(idAsNumber)
      .unwrap()
      .then(() => {
        message.success('Элемент успешно удален').then()
        setSelectedItemId('')
      })
      .catch(() => message.error('Не удалось удалить роль'))
  }

  if (isLoading) {
    return <Spin />
  }

  const currentRole = data
    ? data.find((item) => item.id.toString() === selectedItemId)
    : null
  const renderItems = (item: RoleType) => (
    <List.Item data-cy="role-item">
      <div className="role-item">
        <span className="role-item__name">{item.name}</span>
        <span className="role-item__id">id: {item.id}</span>
      </div>
    </List.Item>
  )

  const renderMainContent = () => {
    if (isNew) {
      return (
        <RolesContent
          saveRole={handleCreateRole}
          permissions={permissionList}
          title="Добавить"
        />
      )
    }

    if (!selectedItemId) {
      return <EmptyData />
    }

    if (!currentRole) {
      return <NoData />
    }

    return (
      <RolesContent
        immutable={currentRole.immutable}
        saveRole={handleUpdateRole}
        permissions={permissionList}
        role={currentRole}
      />
    )
  }

  return (
    <section className="roles-page three-columns">
      <Column
        items={filterFirstColumnItems(data, searchValue)}
        showAddBtn={isAddRolePermissions}
        showRemoveBtn={isRemoveRolePermissions}
        onAddItem={handeOnAddItem}
        onRemoveItem={handleRemoveRole}
        onChangeSearchValue={handleOnChangeSearchValue}
        renderItems={renderItems}
        searchValue={searchValue}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
      <div className="roles-page__content">{renderMainContent()}</div>
    </section>
  )
}

export default RolesPage