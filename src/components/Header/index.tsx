import { Segmented, theme } from 'antd'
import { useContext } from 'react'

import { darkTheme, lightTheme } from '../../constants/theme.ts'
import { Context } from '../../store'
import './header.scss'

const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const Header = () => {
  const { setTheme } = useContext(Context)
  const { useToken } = theme
  const { token } = useToken()

  return (
    <header className="header" style={{ backgroundColor: token.colorBgLayout }}>
      <Segmented
        onChange={(v) => setTheme(v === 'light' ? lightTheme : darkTheme)}
        options={options}
      />
    </header>
  )
}

export default Header
