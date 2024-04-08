import { Spin } from 'antd'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '@components/Layout'

import HomePage from '@pages/HomePage'

import PrivateRoute from '@routes/PrivateRoute'
import { routePaths } from '@routes/routePaths.ts'

const LoginPage = lazy(() => import('@pages/LoginPage'))

const ErrorPage = lazy(() => import('@components/ErrorPage'))

const Routers = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path={routePaths.home} element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<Spin />}>
                <HomePage />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route
        path={routePaths.error}
        element={
          <Suspense fallback={<Spin />}>
            <ErrorPage />
          </Suspense>
        }
      />
      <Route
        path={routePaths.login}
        element={
          <Suspense fallback={<Spin />}>
            <LoginPage />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default Routers
