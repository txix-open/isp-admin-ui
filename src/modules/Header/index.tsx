import { Layout } from 'antd'

import UserMenu from '@components/UserMenu/UserMenu.tsx'

import './header.scss'


const { Header: AntdHeader } = Layout

const Header = () => {
  return (
    <AntdHeader className="header">
      <UserMenu />
    </AntdHeader>
  )
}

export default Header
