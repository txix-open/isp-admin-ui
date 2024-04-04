import { Button, theme } from 'antd'

import { useRole } from '@hooks/useRole.tsx'

import { PermissionKeys } from '@type/roles.type.ts'

import './home.scss'

const HomePages = () => {
  const { hasPermission } = useRole()
  const { useToken } = theme
  const { token } = useToken()

  const isPageAvailable = hasPermission(PermissionKeys.user_view)

  return (
    <main className="main" style={{ backgroundColor: token.colorBgLayout }}>
      {isPageAvailable && (
        <Button ghost type="primary">
          Border
        </Button>
      )}
      <div>Проверка шрифтов</div>
      <Button type="primary">Primary</Button>
    </main>
  )
}

export default HomePages
