import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'

import { HeaderPropsType } from '@widgets/Header/header.type.ts'

import { useAppSelector } from '@hooks/redux.ts'

import './header.scss'

const Header = ({ title }: HeaderPropsType) => {
  const {
    ui: { name, primaryColor }
  } = useAppSelector((state) => state.UIReducer)

  return (
    <section
      className="header"
      style={{
        backgroundColor: primaryColor
      }}
    >
      <div>
        <Breadcrumb
          items={[
            {
              href: '/',
              title: (
                <>
                  <HomeOutlined />
                  <span>Главная</span>
                </>
              )
            },
            {
              title: <span>{title}</span>
            }
          ]}
        />
      </div>
      <span>{name}</span>
    </section>
  )
}

export default Header
