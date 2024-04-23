import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '@components/Layout'

import HomePage from '@pages/HomePage'

import PrivateRoute from '@routes/PrivateRoute'
import { routePaths } from '@routes/routePaths.ts'

const LoginPage = lazy(() => import('@pages/LoginPage'))
const ErrorPage = lazy(() => import('@components/ErrorPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))
const UsersPage = lazy(() => import('@pages/UsersPage'))
const RolesPage = lazy(() => import('@pages/RolesPage'))
const UserEditor = lazy(() => import('src/pages/UserEditor'))
const SessionsPage = lazy(() => import('@pages/SessionsPage'))
const SecurityLogPage = lazy(() => import('@pages/SecurityLogPage'))
const AppAccessPage = lazy(() => import('@pages/AppAccessPage'))
const ModulesPage = lazy(() => import('@pages/ModulesPage'))
const ApplicationsPage = lazy(() => import('@pages/ApplicationsPage'))

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
          <Route
            path={`${routePaths.profile}`}
            element={
              <Suspense fallback={<Spin />}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path={routePaths.users}
            element={
              <Suspense fallback={<Spin />}>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path={`${routePaths.users}/:id`}
            element={
              <Suspense fallback={<Spin />}>
                <UserEditor />
              </Suspense>
            }
          />
          <Route
            path={routePaths.roles}
            element={
              <Suspense fallback={<Spin />}>
                <RolesPage />
              </Suspense>
            }
          >
            <Route
              path=":id"
              element={
                <Suspense fallback={<Spin />}>
                  <RolesPage />
                </Suspense>
              }
            />
          </Route>
            <Route
                path={routePaths.applications}
                element={
                    <Suspense fallback={<Spin />}>
                        <ApplicationsPage />
                    </Suspense>
                }
            >
                <Route
                    path=":id"
                    element={
                        <Suspense fallback={<Spin />}>
                            <ApplicationsPage />
                        </Suspense>
                    }
                />
            </Route>
          <Route
            path={routePaths.sessions}
            element={
              <Suspense fallback={<Spin />}>
                <SessionsPage />
              </Suspense>
            }
          />
          <Route
            path={routePaths.securityLog}
            element={
              <Suspense fallback={<Spin />}>
                <SecurityLogPage />
              </Suspense>
            }
          />
          <Route
            path={`${routePaths.appAccess}`}
            element={
              <Suspense fallback={<Spin />}>
                <AppAccessPage />
              </Suspense>
            }
          >
            <Route
              path=":id"
              element={
                <Suspense fallback={<Spin />}>
                  <AppAccessPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path={routePaths.modules}
            element={
              <Suspense fallback={<Spin />}>
                <ModulesPage />
              </Suspense>
            }
          >
            <Route path=":id">
              <Route
                path="configurations"
                element={
                  <Suspense fallback={<Spin />}>
                    <div>Configurations</div>
                  </Suspense>
                }
              />
              <Route
                path="connections"
                element={
                  <Suspense fallback={<Spin />}>
                    <div>Connections</div>
                  </Suspense>
                }
              />
            </Route>
          </Route>
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
