import { EditorState, EditorView } from '@uiw/react-codemirror'
import { Button, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, memo, useState } from 'react'
import CodeMirrorMerge from 'react-codemirror-merge'

import Modal from '@widgets/Modal'

import { CompareVersionModalPropsType } from '@components/CompareVersionModal/compare-version-modal.type'

import { sortObject } from '@utils/objectUtils.ts'

import { useAppSelector } from '@hooks/redux.ts'

import configServiceApi from '@services/configService.ts'
import userServiceApi from '@services/userService.ts'

import { VersionType } from '@type/version.type'

import './compare-version-modal.scss'
import dayjs from 'dayjs'
import { dateFormats } from '@constants/date.ts'


const Original = CodeMirrorMerge.Original
const Modified = CodeMirrorMerge.Modified

const CompareVersionModal: FC<CompareVersionModalPropsType> = ({
                                                                 open,
                                                                 onClose,
                                                                 config,
                                                                 currentConfigId
                                                               }) => {
  const [selectedItem, setSelectedItem] = useState<VersionType>()
  const { data: versions = [], isLoading: isVersionLoading } =
    configServiceApi.useGetAllVersionQuery(currentConfigId)
  const { data: allUsers = [], isLoading: isUsersLoading } =
    userServiceApi.useGetAllUsersQuery()
  const { profile } = useAppSelector((state) => state.profileReducer)
  const isLoading = isVersionLoading || isUsersLoading
  if (isLoading) {
    return <Spin />
  }

  const columns: ColumnsType<VersionType> = [
    {
      key: 'configVersion',
      title: 'Версия',
      dataIndex: 'configVersion'
    },
    {
      key: 'createdAt',
      title: 'Создано',
      dataIndex: 'createdAt',
      render: (value: string) => {
        return dayjs(value).format(dateFormats.fullFormat)
      }
    },
    {
      key: 'user',
      title: 'Автор',
      dataIndex: 'adminId',
      render: (value: number) => {
        const user = allUsers.find((user) => user.id === value)
        if (user) {
          return `${user.lastName} ${user.firstName}`
        }
        return `${profile.lastName} ${profile.firstName}`
      }
    }
  ]
  return (
    <div className="compare-version-modal">
      <Modal title="Выберите версию для сравнения" open={open} onClose={onClose}>
        {selectedItem ? (
          <div className="compare-version-modal__content">
            <Button onClick={() => setSelectedItem(undefined)}>Назад</Button>
            <div className="compare-version-modal__header">
              <span> Версия: {selectedItem.configVersion}</span>
              <span>{config?.version ? `Текущая версия : ${config?.version}` : `Версия: ${config?.configVersion}`}</span>
            </div>
            <CodeMirrorMerge orientation="a-b">
              <Original
                value={JSON.stringify(sortObject(selectedItem.data), null, 2)}
              />
              <Modified
                value={JSON.stringify(sortObject(config?.data), null, 2)}
                extensions={[
                  EditorView.editable.of(false),
                  EditorState.readOnly.of(true)
                ]}
              />
            </CodeMirrorMerge>
          </div>
        ) : (
          <div className="compare-version-modal__content__table">
            <Table
              rowClassName="compare-version-modal__content__table__row"
              size="small"
              columns={columns}
              pagination={{ pageSize: 30 }}
              dataSource={versions}
              rowKey={(record) => record.id}
              onRow={(record) => {
                return {
                  onClick: () => setSelectedItem(record)
                }
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default memo(CompareVersionModal)
