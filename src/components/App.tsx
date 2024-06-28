import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU'
import { useEffect, useState } from 'react'

import { darkTheme, lightTheme } from '@constants/theme.ts'

import { Context } from '@stores/index.tsx'

import Routers from '@routes/Routers'

import './app.scss'

const App = () => {
  const [themes, setTheme] = useState(lightTheme)
  const [changeTheme, setChangeTheme] = useState(
    localStorage.getItem('theme')
      ? JSON.parse(localStorage.getItem('theme') || '')
      : true
  )

  useEffect(() => {
    setTheme(() => (changeTheme ? darkTheme : lightTheme))
  }, [changeTheme])

  return (
    <div className="app">
      <Context.Provider value={{ setTheme, setChangeTheme, changeTheme }}>
        <ConfigProvider theme={themes} locale={ruRu}>
          <Routers />
        </ConfigProvider>
      </Context.Provider>
    </div>
  )
}

export default App
