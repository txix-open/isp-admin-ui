import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  MenuItemKeysUser,
  menuKeysUser
} from '@components/UserMenu/user-menu.type.ts'

import { useAppSelector } from '@hooks/redux.ts'
import useLogout from '@hooks/useLogout.tsx'

import { routePaths } from '@routes/routePaths.ts'


const UserMenu = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuItemKeysUser[]>(
    []
  )
  const navigate = useNavigate()

  const { logoutUser } = useLogout()
  const {
    profile: { firstName }
  } = useAppSelector((state) => state.profileReducer)

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
      label: firstName,
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
      case MenuItemKeysUser.logout: {
        logoutUser()
        break
      }
      case MenuItemKeysUser.profile: {
        navigate(routePaths.profile)
        break
      }
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
