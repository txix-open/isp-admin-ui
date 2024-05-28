import {
  AlertOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { Button, Dropdown, Popconfirm, Tooltip } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ActiveTableActionButtonsPropsType } from './active-table-action-buttons.type.ts'

import './active-table-action-buttons.scss'
import CanEdit from '@components/CanEdit'

const ActiveTableActionButtons: FC<ActiveTableActionButtonsPropsType> =
  ({
     isActive,
     record,
     handleShowCompareModal,
     handleShowConfig,
     handleDeleteConfig,
     handleMarkConfigActive
   }) => {
    const navigate = useNavigate()

    const navigateToAllVersion = () => navigate(`${record.id}/all_versions`)

    const renderDropDown = (record: any) => {
      return (
        <div className="dropdown">
          <Tooltip key="1" title="Сравнение версий">
            <Button
              onClick={() => handleShowCompareModal(record)}
              icon={<SwapOutlined />}
            />
          </Tooltip>
          <Tooltip key="2" title="Просмотр истории">
            <Button onClick={navigateToAllVersion} icon={<HistoryOutlined />} />
          </Tooltip>
          <CanEdit>
            <Popconfirm
              title="Вы действительно хотите удалить выбранный конфиг?"
              onConfirm={() => handleDeleteConfig(record)}
            >
              <Tooltip key="3" title="Удалить конфиг">
                <Button danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </CanEdit>
        </div>
      )
    }

    const renderAdditionalButtons = () => {
      if (isActive) {
        return (
          <>
            <Tooltip key="1" title="Сравнение версий">
              <Button
                onClick={() => handleShowCompareModal(record)}
                icon={<SwapOutlined />}
              />
            </Tooltip>
            <Tooltip key="2" title="Просмотр истории">
              <Button
                onClick={navigateToAllVersion}
                icon={<HistoryOutlined />}
              />
            </Tooltip>
          </>
        )
      }

      return (
        <>
          <CanEdit>
            <Tooltip key="3" title="Сделать активной">
              <Button onClick={() => handleMarkConfigActive(record)} icon={<AlertOutlined />} />
            </Tooltip>
          </CanEdit>
          <Dropdown dropdownRender={() => renderDropDown(record)}>
            <Button>...</Button>
          </Dropdown>
        </>
      )
    }
    return (
      <div className="active-configurations-table-actions-field">
        <Button.Group className="button_group">
        <Tooltip title="Просмотр">
          <Button
            onClick={() => handleShowConfig(record)}
            icon={<EyeOutlined />}
          />
        </Tooltip>
        <CanEdit>
          <Tooltip title="Редактировать">
            <Button icon={<EditOutlined />} />
          </Tooltip>
        </CanEdit>
        {renderAdditionalButtons()}
        </Button.Group>
      </div>
    )
  }

export default ActiveTableActionButtons
