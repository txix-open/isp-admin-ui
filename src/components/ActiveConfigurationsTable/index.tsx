import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { Button, message, Table, Tag, Tooltip } from 'antd'
import { FC, useEffect, useRef, useState } from 'react'

import ActiveTableActionButtons from '@widgets/ActiveTableActionButtons'

import {
  ActiveConfigurationsTablePropsType
} from '@components/ActiveConfigurationsTable/active-configurations-table.type.ts'

import configApi from '@services/configService.ts'

import { ConfigType } from '@pages/ModulesPage/module.type.ts'
import { ColumnsType } from 'antd/es/table'

import './active-configurations-table.scss'
import dayjs from 'dayjs'
import CanEdit from '@components/CanEdit'


const ActiveConfigurationsTable: FC<ActiveConfigurationsTablePropsType> =
  ({
     isActiveTable = false,
     handleShowConfig,
     handleShowCompareModal,
     data
   }) => {
    const [editKeyConfig, setEditKeyConfig] = useState<string>('')
    const [tempEditValues, setTempEditValues] = useState<any>()
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
    const [createUpdateConfig] = configApi.useCreateUpdateConfigMutation()
    const [markConfigAsActive] = configApi.useMarkConfigAsActiveMutation()
    const [deleteConfig] = configApi.useDeleteConfigMutation()


    useEffect(() => {
      if (inputRefs.current[editKeyConfig]) {
        inputRefs.current[editKeyConfig]?.focus()
      }
    }, [editKeyConfig])
    const handleEditStart = (record: ConfigType) => {
      setEditKeyConfig(record.id)
      setTempEditValues({
        ...tempEditValues,
        [record.id]: record.name
      } as ConfigType)
    }

    const handleCancelEdit = (record: ConfigType) => {
      setEditKeyConfig('')
      setTempEditValues({
        ...tempEditValues,
        [record.id]: record.name
      } as ConfigType)
    }

    const handleSaveEdit = (record: ConfigType) => {
      const sendData = { ...record, name: tempEditValues[record.id] }
      createUpdateConfig(sendData)
        .unwrap()
        .then(() => {
          message.success('Элемент успешно сохранен')
          setEditKeyConfig('')
        })
        .catch(() => {
          message.error('Не удалось сохранить элемент')
        })
    }
    const handleDeleteConfig = (record: ConfigType) => {
      deleteConfig(record.id)
        .unwrap()
        .then(() => {
          message.success('Элемент успешно удален')
          setEditKeyConfig('')
        })
        .catch(() => {
          message.error('Не удалось удалить элемент')
        })
    }

    const handleMarkConfigActive = (record: ConfigType) => {
      markConfigAsActive(record.id)
        .unwrap()
        .then(() => {
          message.success('Элемент успешно обновлен')
          setEditKeyConfig('')
        })
        .catch(() => {
          message.error('Не удалось обновить элемент')
        })
    }

    const renderNameField = (value: string, record: ConfigType) => {
      const canEdit = editKeyConfig === record.id
      const inputValue = canEdit ? tempEditValues[record.id] : value

      return (
        <div className="active-configurations-table__table__name-field">
          <input
            ref={(inputRef) => (inputRefs.current[record.id] = inputRef)}
            onChange={(event) => {
              const { value } = event.target
              setTempEditValues({ ...tempEditValues, [record.id]: value })
            }}
            disabled={!canEdit}
            value={inputValue}
          />
          {canEdit ? (
            <div className="active-configurations-table__table__name-field__actions">
              <Tooltip title="Сохранить">
                <Button
                  type="primary"
                  onClick={() => handleSaveEdit(record)}
                  icon={<CheckOutlined />}
                />
              </Tooltip>
              <Tooltip title="Отменить">
                <Button
                  onClick={() => handleCancelEdit(record)}
                  icon={<CloseOutlined />}
                />
              </Tooltip>
            </div>
          ) : (
            <CanEdit>
              <Tooltip title="Редактировать название">
                <Button
                  onClick={() => handleEditStart(record)}
                  icon={<EditOutlined />}
                />
              </Tooltip>
            </CanEdit>
          )}
        </div>
      )
    }

    const columns: ColumnsType<ConfigType> = [
      {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        render: renderNameField,
        align: 'center'
      },
      {
        title: 'Версия',
        dataIndex: 'version',
        key: 'version',
        align: 'center'
      },
      {
        title: 'Статус конфигурации',
        dataIndex: 'valid',
        key: 'version',
        align: 'center',
        render: (value: boolean) => {
          if (value) {
            return <Tag color="#4fc14f">Корректная</Tag>
          }
          return <Tag color="red">Некорректная</Tag>
        }
      },
      {
        title: 'Дата обновления',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        render: (value: string) => {
          return dayjs(value).format('HH:mm:ss DD.MM.YYYY')
        }
      },
      {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
        render: (_: unknown, record: ConfigType) => (
          <ActiveTableActionButtons
            isActive={isActiveTable}
            handleShowConfig={handleShowConfig}
            handleShowCompareModal={handleShowCompareModal}
            handleDeleteConfig={handleDeleteConfig}
            handleMarkConfigActive={handleMarkConfigActive}
            record={record}
          />
        )
      }
    ]
    const className = `active-configurations-table__table ${isActiveTable ? 'active-config' : ''}`
    return (
      <div className="active-configurations-table">
        <h2 className="active-configurations-table__title">
          {isActiveTable ? 'Активная конфигурация' : 'Другие конфигурации'}
        </h2>
        <Table
          className={className}
          rowKey={(record) => record.id}
          pagination={false}
          columns={columns}
          dataSource={data}
        />
      </div>
    )
  }

export default ActiveConfigurationsTable