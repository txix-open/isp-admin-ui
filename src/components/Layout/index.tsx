import {
  AppstoreAddOutlined,
  LockOutlined,
  LogoutOutlined,
  ProductOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { ConfigProvider, Layout, Menu, Spin } from 'antd'
import type { MenuProps } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { localStorageKeys } from '@constants/localStorageKeys.ts'

import DefaultUser from '@components/Icons/DefaultUser.tsx'
import {
  MenuItemKeysType,
  MenuItemLabelsType,
  MenuItemType,
  menuKeys
} from '@components/Layout/layout.type.ts'

import { LocalStorage } from '@utils/localStorageUtils.ts'

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts'
import useLogout from '@hooks/useLogout.tsx'
import useRole from '@hooks/useRole.tsx'

import { fetchProfile, fetchUI } from '@stores/redusers/ActionCreators.ts'
import { StateProfileStatus } from '@stores/redusers/ProfileSlice.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeysType } from '@type/roles.type.ts'

import Header from 'src/widgets/Header'



import './layout.scss'

const { Content, Sider } = Layout

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuItemKeysType[]>(
      []
  )
  const [title, setTitle] = useState('')
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const {
    status,
    profile: { firstName }
  } = useAppSelector((state) => state.profileReducer)
  const location = useLocation()
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const { theme } = useContext(ConfigProvider.ConfigContext)

  const userToken = LocalStorage.get(localStorageKeys.USER_TOKEN)
  const { logoutUser } = useLogout()

  const hideItem = (permission: PermissionKeysType | PermissionKeysType[]) => {
    if (Array.isArray(permission)) {
      const result = permission.reduce((acc, currentValue) => {
        const hasPermissionFunc = hasPermission(currentValue)
        return hasPermissionFunc || acc
      }, false)
      return result ? '' : 'hide-item'
    }
    return hasPermission(permission) ? '' : 'hide-item'
  }
  const menuItems: MenuItemType[] = [
    {
      label: firstName || '',
      key: 'userManagement',
      className: 'user-item',
      icon: <DefaultUser />,
      children: [
        {
          label: 'Профиль',
          key: 'profile',
          icon: <ProfileOutlined />
        },
        {
          label: 'Выход',
          key: 'logout',
          icon: <LogoutOutlined />
        }
      ]
    },
    {
      label: 'Группа приложений',
      key: 'applications_group',
      className: hideItem([PermissionKeysType.read]),
      icon: <AppstoreAddOutlined />
    },
    {
      label: 'Доступы приложений',
      key: 'appAccess',
      className: hideItem([PermissionKeysType.read]),
      icon: <LockOutlined />
    },
    {
      label: 'Пользователи и роли',
      key: 'sessionManagement',
      className: hideItem([PermissionKeysType.read]),
      icon: <ProfileOutlined />,
      children: [
        {
          label: 'Пользователи',
          key: 'users',
          className: hideItem(PermissionKeysType.read)
        },
        {
          label: 'Пользовательские сессии',
          key: 'sessions',
          className: hideItem(PermissionKeysType.read)
        },
        {
          label: 'Просмотр журналов ИБ',
          key: 'securityLog',
          className: hideItem(PermissionKeysType.read)
        },
        {
          label: 'Роли',
          key: 'roles',
          className: hideItem(PermissionKeysType.read)
        }
      ]
    },
    {
      label: 'Модули',
      key: 'modules',
      className: hideItem(PermissionKeysType.read),
      icon: <ProductOutlined />
    }
  ]

  useEffect(() => {
    ConfigProvider.config({
      holderRender: (children) => (
          <ConfigProvider prefixCls="static" theme={theme}>
            {children}
          </ConfigProvider>
      )
    })
  }, [theme])

  useEffect(() => {
    if (userToken) {
      dispatch(fetchProfile())
      dispatch(fetchUI())
    }
  }, [])

  useEffect(() => {
    const menuKey = location.pathname.split('/')[1] as MenuItemKeysType

    const menuItem = menuKeys[menuKey]

    if (menuItem) {
      setTitle(MenuItemLabelsType[menuItem.key])
      setSelectedMenuKeys([menuItem.key])
      setOpenKeys(menuItem.parent)
    }
  }, [location])

  const handlerOnClickMenu: MenuProps['onClick'] = ({ key }): void => {
    switch (key) {
      case MenuItemKeysType.logout: {
        logoutUser()
        break
      }
      case MenuItemKeysType.profile: {
        navigate(routePaths.profile)
        break
      }
      case MenuItemKeysType.users:
        navigate(routePaths.users)
        break
      case MenuItemKeysType.sessions:
        navigate(routePaths.sessions)
        break
      case MenuItemKeysType.securityLog:
        navigate(routePaths.securityLog)
        break
      case MenuItemKeysType.appAccess:
        navigate(routePaths.appAccess)
        break
      case MenuItemKeysType.roles:
        navigate(routePaths.roles)
        break
      case MenuItemKeysType.modules:
        navigate(routePaths.modules)
        break
      case MenuItemKeysType.applicationsGroup:
        navigate(routePaths.applicationsGroup)
        break
      default:
    }
  }

  if (status === StateProfileStatus.rejected) {
    return <Navigate to={routePaths.error} replace />
  }

  return (
      <section>
        <Header title={title} />
        <Layout className="layout" data-cy="homePage">
          {status === StateProfileStatus.pending ? (
              <Spin size="large" />
          ) : (
              <>
                <Sider
                    width="250px"
                    data-cy="aside"
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                  <Menu
                      onOpenChange={(keys) => setOpenKeys(keys)}
                      openKeys={openKeys}
                      selectedKeys={selectedMenuKeys}
                      onClick={handlerOnClickMenu}
                      theme="light"
                      mode="inline"
                      items={menuItems}
                  />
                </Sider>
                <Layout className="site-layout">
                  <Content className="site-layout__content">
                    <Outlet />
                  </Content>
                </Layout>
              </>
          )}
        </Layout>
      </section>
  )
}

export default LayoutComponent
