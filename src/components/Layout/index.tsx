import { LockOutlined, ProfileOutlined } from '@ant-design/icons'
import { Divider, Layout, Menu, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { localStorageKeys } from '@constants/localStorageKeys.ts'

import {
  MenuItemKeys,
  MenuItemType,
  menuKeys
} from '@components/Layout/layout.type.ts'
import UserMenu from '@components/UserMenu'

import { LocalStorage } from '@utils/localStorageUtils.ts'

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts'
import useRole from '@hooks/useRole.tsx'

import { fetchProfile } from '@stores/redusers/ActionCreators.ts'
import { StateProfileStatus } from '@stores/redusers/ProfileSlice.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeys } from '@type/roles.type.ts'

import './layout.scss'

const { Content, Sider } = Layout

const LayoutComponent = () => {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuItemKeys[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.profileReducer)
  const location = useLocation()
  const userToken = LocalStorage.get(localStorageKeys.USER_TOKEN)

  const { hasPermission } = useRole()

  const hideItem = (permission: PermissionKeys | PermissionKeys[]) => {
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
      label: 'Доступы приложений',
      key: 'appAccess',
      className: hideItem([PermissionKeys.user_view]),
      icon: <LockOutlined />
    },
    {
      label: 'Пользователи и роли',
      key: 'sessionManagement',
      className: hideItem([PermissionKeys.user_view]),
      icon: <ProfileOutlined />,
      children: [
        {
          label: 'Пользователи',
          key: 'users',
          className: hideItem(PermissionKeys.user_view)
        }
      ]
    }
  ]

  useEffect(() => {
    if (userToken) {
      dispatch(fetchProfile())
    }
  }, [])

  useEffect(() => {
    const menuKey = location.pathname.split('/')[1] as MenuItemKeys

    const menuItem = menuKeys[menuKey]

    if (menuItem) {
      setSelectedMenuKeys([menuItem.key])
      setOpenKeys(menuItem.parent)
    }
  }, [location])

  const handlerOnClickMenu = ({ key }: any): void => {
    switch (key) {
      case MenuItemKeys.appAccess:
        navigate(routePaths.appAccess)
        break
      default:
    }
  }

  if (status === StateProfileStatus.rejected) {
    return <Navigate to={routePaths.error} replace />
  }

  return (
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
            <UserMenu />
            <Divider />
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
  )
}

export default LayoutComponent
