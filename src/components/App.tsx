import { ConfigProvider } from 'antd'
import { useState } from 'react'

import { lightTheme } from '@constants/theme.ts'

import { Context } from '@stores/index.tsx'

import Routers from '@routes/Routers'

import './app.scss'

const App = () => {
  const [themes, setTheme] = useState(lightTheme)

  return (
    <div className="app">
      <Context.Provider value={{ setTheme }}>
        <ConfigProvider theme={themes}>
          <Routers />
        </ConfigProvider>
      </Context.Provider>
    </div>
  )
}

export default App
