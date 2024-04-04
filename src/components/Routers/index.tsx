import { App } from 'antd'
import { Route, Routes } from 'react-router-dom'

import HomePages from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import ErrorPage from '../ErrorPage'
import Layout from '../Layout'
import PrivateRoute from '../PrivateRoute'

const Routers = () => {
  return (
    <App>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePages />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </App>
  )
}

export default Routers
