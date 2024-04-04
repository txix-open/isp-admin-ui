import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import Header from '@components/Header'

import { useAppSelector } from '@hooks/redux.ts'
import { useRole } from '@hooks/useRole.tsx'

import { StateProfileStatus } from '@stores/redusers/ProfileSlice.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeys } from '@type/roles.type.ts'

import { MenuItemKeys, menuKeys } from './layout.type.ts'

import './layout.scss'

const Layout = () => {
  const { hasPermission } = useRole()
  const navigate = useNavigate()
  const { status } = useAppSelector((state) => state.profileReducer)

  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuItemKeys[]>([])

  const hideItem = (permission: PermissionKeys | PermissionKeys[]) => {
    if (Array.isArray(permission)) {
      const result = permission.reduce((acc, currentValue) => {
        const isHasPermission = hasPermission(currentValue)
        return isHasPermission || acc
      }, false)
      return result ? '' : 'hide-item'
    }
    return hasPermission(permission) ? '' : 'hide-item'
  }

  const menuItems = [
    {
      label: 'Profile',
      key: 'users',
      className: hideItem(PermissionKeys.user_view)
    },
    {
      label: 'Profile2',
      key: 'roles',
      className: hideItem(PermissionKeys.user_view)
    }
  ]

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
      case MenuItemKeys.roles:
        navigate(routePaths.error)
        break
      case MenuItemKeys.users:
        navigate(routePaths.home)
        break
      default:
    }
  }

  if (status === StateProfileStatus.rejected) {
    return <Navigate to={routePaths.error} replace />
  }

  return (
    <section className="layout">
      <Header />
      <Menu
        onOpenChange={(keys) => setOpenKeys(keys)}
        openKeys={openKeys}
        selectedKeys={selectedMenuKeys}
        onClick={handlerOnClickMenu}
        theme="light"
        mode="inline"
        items={menuItems}
      />
      <Outlet />
    </section>
  )
}

export default Layout
