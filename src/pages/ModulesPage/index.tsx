import { ExclamationCircleOutlined } from '@ant-design/icons'
import { List, message, Spin, Tabs, Tag, Tooltip } from 'antd'
import { compareVersions } from 'compare-versions'
import { Layout } from 'isp-ui-kit'
import { useEffect, useState } from 'react'
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import { ModuleType } from '@pages/ModulesPage/module.type.ts'

import { filterFirstColumnItems } from '@utils/firstColumnUtils.ts'

import useRole from '@hooks/useRole.tsx'

import modulesServiceApi from '@services/modulesService.ts'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeysType } from '@type/roles.type.ts'

import './modules-page.scss'

const { Column, EmptyData, NoData } = Layout

const ModulesPage = () => {
  const [activeTab, setActiveTab] = useState('configurations')
  const { id: selectedItemId = '' } = useParams()
  const navigate = useNavigate()
  const { role, hasPermission } = useRole()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: ModulesList = [], isLoading: isModulesLoading } =
    modulesServiceApi.useGetModulesQuery('modules', {
      pollingInterval: 1000,
      skipPollingIfUnfocused: true
    })
  const [removeModule] = modulesServiceApi.useRemoveModuleMutation()
  const location = useLocation()

  const searchValue = searchParams.get('search') || ''
  const isPageAvailable = hasPermission(PermissionKeysType.read)
  const isRemoveModule = hasPermission(PermissionKeysType.write)
  const isLoading = isModulesLoading

  useEffect(() => {
    if (!isPageAvailable) {
      navigate(routePaths.home)
    }
  }, [isPageAvailable])

  useEffect(() => {
    if (!role) {
      navigate(routePaths.error)
    }
  }, [role])

  useEffect(() => {
    const url = location.pathname.substring(
      location.pathname.lastIndexOf('/') + 1
    )
    switch (url) {
      case 'configurations':
        return setActiveTab('configurations')
      case 'connections':
        return setActiveTab('connections')
    }
  }, [location])

  const setSelectedItemId = (id: string): void => {
    if (id) {
      navigate(
        {
          pathname: `${routePaths.modules}/${id}/${activeTab}`,
          search: createSearchParams(searchParams).toString()
        },
        { replace: true }
      )
    }
  }

  const handleOnChangeSearchValue = (value: string): void => {
    setSearchParams((prev) => {
      if (!value) {
        prev.delete('search')
      } else {
        prev.set('search', value)
      }
      return prev
    })
  }

  const handleRemoveModule = (id: string) => {
    removeModule(id)
      .unwrap()
      .then(() => {
        navigate(routePaths.modules)
        message.success('Модуль успешно удален').then()
        setSelectedItemId('')
      })
      .catch(() => message.error('Не удалось удалить модуль'))
  }

  const versionCompare = (versions: string[]) => {
    const sorted = versions?.sort(compareVersions)
    const firstVersion = sorted[0]
    for (let i = 1; i < sorted.length; i++) {
      if (compareVersions(firstVersion, sorted[i]) !== 0) {
        return false
      }
    }
    return true
  }

  const getLastVersion = (versions: string[]) => {
    const sorted = versions?.sort(compareVersions)
    return sorted[sorted.length - 1]
  }

  if (isLoading) {
    return <Spin />
  }

  const currentRole = ModulesList
    ? ModulesList.find(
        (item: ModuleType) => item.id.toString() === selectedItemId
      )
    : null

  const renderItems = (item: ModuleType) => {
    const isSame = versionCompare(item.status.map((i) => i.version))
    const textTooltip = isSame
      ? 'Активны экземпляры одинаковых версий'
      : 'Активны экземпляры разных версий'
    const lastVersion = getLastVersion(item.status.map((i) => i.version))

    const renderVersion = () => {
      if (!isSame && lastVersion) {
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {lastVersion}
          </Tag>
        )
      }
      if (isSame && lastVersion) {
        return <Tag color="default">{lastVersion}</Tag>
      }
      return ''
    }

    return (
      <List.Item>
        <div className="module-item">
          <div className="module-item__name">
            <span>{item.name}</span>
            <Tooltip overlayInnerStyle={{ width: '300px' }} title={textTooltip}>
              {renderVersion()}
            </Tooltip>
          </div>
          <div className="module-item__content">
            <span className="module-item__content__description">
              активные экземпляры:
            </span>
            <strong
              className={`module-item__content__status ${
                !item.status || !item.status.length
                  ? 'module-item__content__status_zero'
                  : ''
              }`}
            >
              {(item.status && item.status.length) || '0'}
            </strong>
          </div>
        </div>
      </List.Item>
    )
  }

  const renderMainContent = () => {
    if (!selectedItemId) {
      return <EmptyData />
    }

    if (!currentRole) {
      return <NoData />
    }

    return <Outlet />
  }
  const secondColumnItems = [
    {
      key: 'configurations',
      name: 'Конфигурации'
    },
    { key: 'connections', name: 'Подключения' }
  ]

  return (
    <section className="modules-page three-columns">
      <Column
        items={filterFirstColumnItems(ModulesList, searchValue)}
        showAddBtn={false}
        showRemoveBtn={isRemoveModule}
        onRemoveItem={handleRemoveModule}
        onChangeSearchValue={handleOnChangeSearchValue}
        renderItems={renderItems}
        searchValue={searchValue}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
      <Tabs
        activeKey={activeTab}
        onChange={(activeKey) => {
          setActiveTab(activeKey)
          const path = `${selectedItemId}/${activeKey}`
          navigate(path)
        }}
        className="modules-page__tabs"
        tabPosition={'left'}
        items={secondColumnItems.map((item) => {
          return {
            disabled: selectedItemId === '',
            label: item.name,
            key: item.key,
            children: (
              <div className="modules-page__content">{renderMainContent()}</div>
            )
          }
        })}
      />
    </section>
  )
}

export default ModulesPage