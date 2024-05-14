import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  PlusSquareOutlined
} from '@ant-design/icons'
import { Button, Popconfirm, Spin, Table, message, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import CanEdit from '@components/CanEdit'

import { getUserFullName } from '@utils/userUtils/getFullNameUtil.ts'

import useRole from '@hooks/useRole.tsx'

import roleApi from '@services/roleService.ts'
import userServiceApi from '@services/userService.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeysType } from '@type/roles.type.ts'
import { UserType } from '@type/user.type.ts'

import './users-page.scss'
import dayjs from 'dayjs'
import { dateFormats } from '@constants/date.ts'

const UsersPage = () => {
  const { data: allUsers = [], isLoading: isUsersLoading } =
    userServiceApi.useGetAllUsersQuery()
  const { data: roles, isLoading: isRolesLoading } =
    roleApi.useGetAllRolesQuery()
  const [blockUser] = userServiceApi.useBlockUserMutation()
  const [deleteUser] = userServiceApi.useDeleteUserMutation()
  const { role, hasPermission } = useRole()
  const navigate = useNavigate()

  const isLoading = isRolesLoading || isUsersLoading

  const isPageAvailable = hasPermission(PermissionKeysType.read)
  const hasCreateUserPermission = hasPermission(PermissionKeysType.write)

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

  const handleDeleteUser = (userId: number) => {
    deleteUser(userId)
      .unwrap()
      .then(() => message.success('Пользователь успешно удален'))
      .catch(() => message.error('Не удалось удалить пользователя'))
  }

  const handleBlockUser = (userId: number) => {
    const currentUser = allUsers.find((el) => el.id === userId)
    const successMessage = currentUser?.blocked
      ? `Пользователь ${currentUser.lastName} ${currentUser.firstName} успешно разблокирован`
      : `Пользователь ${currentUser?.lastName} ${currentUser?.firstName} успешно заблокирован`
    const errorMessage = currentUser?.blocked
      ? `Не удалось разблокировать пользователя ${currentUser.lastName} ${currentUser.firstName}`
      : `Не удалось заблокировать пользователя ${currentUser?.lastName} ${currentUser?.firstName}`
    blockUser(userId)
      .unwrap()
      .then(() => message.success(successMessage))
      .catch(() => message.error(<>{errorMessage}</>))
  }

  if (isLoading) {
    return <Spin />
  }

  const columns: ColumnsType<UserType> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Пользователь',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => getUserFullName(record)
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Роль',
      dataIndex: 'roles',
      key: 'roles',
      render: (values: number[]) => {
        const labels: string[] = []
        values.forEach((value: number) => {
          const roleLabel = roles?.find((el) => el.id === value)
          if (roleLabel) {
            labels.push(roleLabel.name)
          }
        })
        return labels.map((label) => (
          <div key={label} className="role-item">
            {label}
          </div>
        ))
      }
    },
    {
      title: 'Последняя сессия',
      dataIndex: 'lastSessionCreatedAt',
      key: 'lastSessionCreatedAt',
      render: (value: string) =>
        value ?  dayjs(value).format(dateFormats.fullFormat) : ''
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        const blockTitle = record.blocked
          ? 'Вы действительно хотите разблокировать этого пользователя?'
          : 'Вы действительно хотите заблокировать этого пользователя?'
        return (
          <div className="users-page__content__table__actions">
            <CanEdit>
              <Button.Group className="button_group">
                <Popconfirm
                  title={blockTitle}
                  onConfirm={() => handleBlockUser(record.id)}
                >
                  <Tooltip
                    key="LockOutlined"
                    title="Заблокировать пользователя"
                  >
                    <Button
                      data-cy={`users-page__content__table__actions__lock-btn ${record.id}`}
                      className="users-page__content__table__actions__lock-btn"
                      danger={record.blocked}
                      icon={
                        record.blocked ? <LockOutlined /> : <UnlockOutlined />
                      }
                    />
                  </Tooltip>
                </Popconfirm>
                <Tooltip key="EditOutlined" title="Редактировать пользователя">
                  <Button
                    data-cy={`users-page__content__table__actions__edit-btn ${record.id}`}
                    className="users-page__content__table__actions__edit-btn"
                    icon={<EditOutlined />}
                    onClick={() => {
                      navigate(`${routePaths.users}/${record.id}`, {
                        state: { ...record }
                      })
                    }}
                  />
                </Tooltip>

                <Popconfirm
                  title="Вы действительно хотите удалить этого пользователя?"
                  onConfirm={() => handleDeleteUser(record.id)}
                >
                  <Tooltip key="DeleteOutlined" title="Удалить пользователя">
                    <Button
                      data-cy={`users-page__content__table__actions__delete-btn ${record.id}`}
                      className="users-page__content__table__actions__delete-btn"
                      icon={<DeleteOutlined />}
                    />
                  </Tooltip>
                </Popconfirm>
              </Button.Group>
            </CanEdit>
          </div>
        )
      }
    }
  ]

  return (
    <section className="users-page">
      <header className="users-page__header">
        <span
          data-cy="users-page__header__title"
          className="users-page__header__title"
        >
          Пользователи
        </span>
        <Button
          disabled={!hasCreateUserPermission}
          onClick={() =>
            navigate(`${routePaths.users}/new`, { state: { fromApp: true } })
          }
          data-cy="users-page__header__addButton"
          type="primary"
          icon={<PlusSquareOutlined />}
        >
          Добавить
        </Button>
      </header>
      <section className="users-page__content">
        <div className="users-page__content__wrap-table">
          <Table
            data-cy="users-page__content__table"
            rowKey={(record) => record.id}
            pagination={false}
            dataSource={allUsers}
            columns={columns}
          />
        </div>
      </section>
    </section>
  )
}

export default UsersPage
