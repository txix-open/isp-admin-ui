import {useState} from "react";
import Modal from "src/widgets/Modal";
import { Button, theme } from 'antd';
import { useRole } from '@hooks/useRole.tsx';

import { PermissionKeys } from '@type/roles.type.ts'

import './home.scss'

const HomePages = () => {
  const { hasPermission } = useRole()
  const { useToken } = theme
  const { token } = useToken()
    const [isOpenModal, setIsOpenModal] = useState(false)

  const isPageAvailable = hasPermission(PermissionKeys.user_view)

  return (
    <main className="main" style={{ backgroundColor: token.colorBgLayout }}>
      {isPageAvailable && (
        <Button ghost type="primary">
          Border
        </Button>
      )}
      <div>Проверка шрифтов</div>

      {isOpenModal && <Modal setIsOpenModal={setIsOpenModal} title="modal title"><div>modal content</div></Modal>}

      <Button type="primary" onClick={() => setIsOpenModal(true)}>Open Modal</Button>
    </main>
  )
}

export default HomePages
