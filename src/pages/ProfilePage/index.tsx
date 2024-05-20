import { Button, Descriptions, Popconfirm } from 'antd'
import { useState } from 'react'

import PermissionList from '@widgets/PermissionList'

import ChangePasswordModal from '@components/ChangePasswordModal'
import RoleList from '@components/RoleList'

import { useAppSelector } from '@hooks/redux.ts'
import useLogout from '@hooks/useLogout.tsx'

import './profile-page.scss'


const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { profile } = useAppSelector((state) => state.profileReducer)
  const { logoutUser, isLoading } = useLogout()

  return (
    <section className="profile-page">
      <ChangePasswordModal
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
      />
      <h1 className="profile-page__title">{`${profile.lastName} ${profile.firstName}`}</h1>
      <div className="profile-page__user-info">
        <div className="profile-page__user-info__email-wrapper">
          <Descriptions>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <RoleList userRoles={profile.roles} />
      <PermissionList permissions={profile.permissions} />
      <div className="profile-page__actions">
        <Popconfirm
          okText="Выйти"
          cancelText="Отмена"
          title="Вы действительно хотите выйти из профиля?"
          onConfirm={logoutUser}
        >
          <Button
            loading={isLoading}
            disabled={isLoading}
            className="profile-page__actions__exit-btn"
          >
            Выход
          </Button>
        </Popconfirm>
        <Button
          className="profile-page__actions__change-pass-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Сменить пароль
        </Button>
      </div>
    </section>
  )
}

export default ProfilePage
