import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import { useAuth } from 'isp-ui-kit'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiPaths } from '@constants/api/apiPaths.ts'
import { localStorageKeys } from '@constants/localStorageKeys.ts'

import {
  MenuItemKeysUser,
  menuKeysUser
} from '@components/UserMenu/user-menu.type.ts'

import { getConfigProperty } from '@utils/configUtils.ts'
import { LocalStorage } from '@utils/localStorageUtils.ts'

import { useAppSelector } from '@hooks/redux.ts'

import { routePaths } from '@routes/routePaths.ts'

const UserMenu = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuItemKeysUser[]>(
    []
  )
  const navigate = useNavigate()
  const { logout } = useAuth()
  const {
    profile: { firstName }
  } = useAppSelector((state) => state.profileReducer)

  const headerName = LocalStorage.get(localStorageKeys.HEADER_NAME)

  useEffect(() => {
    const menuKey = location.pathname.split('/')[1] as MenuItemKeysUser

    const menuItem = menuKeysUser[menuKey]

    if (menuItem) {
      setSelectedMenuKeys([menuItem.key])
      setOpenKeys(menuItem.parent)
    }
  }, [location])

  const userItems: MenuProps['items'] = [
    {
      label: firstName || 'Анастасия',
      key: 'userManagement',
      icon: <img src="/src/assets/icon/default-user.svg" alt="" />,
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
    }
  ]
  const handlerOnClickMenuUser = ({ key }: any): void => {
    switch (key) {
      case MenuItemKeysUser.logout:
        logout(apiPaths.logout, {
          'X-APPLICATION-TOKEN': getConfigProperty(
            'APP_TOKEN',
            import.meta.env.VITE_APP_TOKEN
          ),
          [headerName]: LocalStorage.get(localStorageKeys.USER_TOKEN)
        })
          .then(() => {
            LocalStorage.remove(localStorageKeys.USER_TOKEN)
            LocalStorage.remove(localStorageKeys.HEADER_NAME)
            navigate(routePaths.login, { replace: true })
          })
          .catch(() => {})
        break
      default:
    }
  }
  return (
    <div className="user-menu">
      <Menu
        onOpenChange={(keys) => setOpenKeys(keys)}
        openKeys={openKeys}
        selectedKeys={selectedMenuKeys}
        onClick={handlerOnClickMenuUser}
        theme="light"
        mode="inline"
        items={userItems}
      />
    </div>
  )
}
export default UserMenu
