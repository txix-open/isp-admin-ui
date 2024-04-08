import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps } from 'antd'
import { useAuth } from 'isp-ui-kit'
import { useNavigate } from 'react-router-dom'

import { apiPaths } from '@constants/api/apiPaths.ts'
import { localStorageKeys } from '@constants/localStorageKeys.ts'

import { UserMenuKeys } from '@components/UserMenu/user-menu.type.ts'

import { getConfigProperty } from '@utils/configUtils.ts'
import { LocalStorage } from '@utils/localStorageUtils.ts'

import { useAppSelector } from '@hooks/redux.ts'

import { routePaths } from '@routes/routePaths.ts'

import './user.scss'

const items: MenuProps['items'] = [
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

export default function UserMenu() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const headerName = LocalStorage.get(localStorageKeys.HEADER_NAME)
  const {
    profile: { firstName }
  } = useAppSelector((state) => state.profileReducer)
  const handlerDropDownClick = (e: any) => {
    if ((e.key as UserMenuKeys) === 'logout') {
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
    }
  }

  return (
    <Dropdown
      trigger={['click']}
      menu={{ items, onClick: handlerDropDownClick }}
      className="user"
    >
      <div role="presentation" onClick={(e) => e.preventDefault()}>
        <span className="user__avatar" />
        <span className="user__name">{firstName || ''}</span>
      </div>
    </Dropdown>
  )
}
