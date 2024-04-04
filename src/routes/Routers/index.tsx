import { App } from 'antd'
import { Route, Routes } from 'react-router-dom'

import ErrorPage from '@components/ErrorPage'
import Layout from '@components/Layout'

import HomePages from '@pages/HomePage'
import LoginPage from '@pages/LoginPage'

import PrivateRoute from '@routes/PrivateRoute'
import { routePaths } from '@routes/routePaths.ts'

const Routers = () => {
  return (
    <App>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePages />} />
          </Route>
        </Route>
        <Route path={routePaths.login} element={<LoginPage />} />
        <Route path={routePaths.error} element={<ErrorPage />} />
      </Routes>
    </App>
  )
}

export default Routers
