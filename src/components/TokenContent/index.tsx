import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import ClipboardJS from 'clipboard'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Layout, FormComponents } from 'isp-ui-kit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ValidationRules } from '@constants/form/validationRules.ts'

import Modal from '@widgets/Modal'

// import CanEdit from '@components/CanEdit'
import {
  ApplicationTokenType,
  NewApplicationTokenType
} from '@pages/ApplicationsPage/applications.type.ts'

import tokensApi from '@services/tokensService.ts'

import './tokens.scss'
import CanEdit from '@components/CanEdit'
import { dateFormats } from '@constants/date.ts'

const { FormSelect } = FormComponents
const { EmptyData } = Layout

interface TokenPropTypes {
  id: number
}

// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('ru')
dayjs.extend(duration)
dayjs.extend(relativeTime)

const TokenContent = ({ id }: TokenPropTypes) => {
  const [showApplicationsModal, setShowApplicationsModal] = useState(false)
  const {
    handleSubmit: handleSubmitTokens,
    control: controlTokens,
    reset
  } = useForm<ApplicationTokenType>({
    mode: 'onChange'
  })

  const { data, isLoading } = tokensApi.useGetTokensByAppIdQuery({ id })
  const [createToken] = tokensApi.useCreateTokenMutation()
  const [revokeToken] = tokensApi.useRevokeTokensMutation()

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-btn')
    clipboard.on('success', () => {
      message.success('Токен скопирован в буфер обмена')
    })
    clipboard.on('error', () => {
      message.error('Ошибка копирования')
    })

    return () => {
      clipboard.destroy()
    }
  }, [])

  const handleCreateToken = (data: any) => {
    if (id) {
      const newToken: NewApplicationTokenType = {
        expireTimeMs: data.expireTime,
        appId: Number(id)
      }

      createToken(newToken)
        .then(() => {
          setShowApplicationsModal(false)
          reset()
          message.info('Элемент добавлен')
        })
        .catch(() => {
          message.error('Ошибка добавления элемента')
        })
    }
  }

  function shortenString(longString: string) {
    if (longString.length <= 6) {
      return <span>{longString}</span>
    } else {
      return (
        <span>
          {longString.slice(0, 3)}...{longString.slice(-3)}
        </span>
      )
    }
  }

  const handleRevokeToken = (elem: ApplicationTokenType) => {
    const currentRemoveToken = {
      appId: id,
      tokens: [elem.token]
    }

    revokeToken(currentRemoveToken)
      .unwrap()
      .then(() => message.success('Элемент удален'))
      .catch(() => message.info('Ошибка удаления элемента'))
  }

  const columns: ColumnsType<ApplicationTokenType> = [
    {
      title: 'Токен',
      dataIndex: 'token',
      key: 'token',
      render: (record) => <div>{shortenString(record)}</div>
    },
    {
      title: 'Дата/Время выпуска',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (record) => {
        const formatTime = dayjs(record.createdAt).format(dateFormats.fullFormat)
        return <div>{formatTime}</div>
      }
    },
    {
      title: 'Срок действия',
      dataIndex: 'expireTime',
      key: 'expireTime',
      render: (value) => {
        const time = dayjs.duration(value).humanize()
        if (value > 0) {
          return <div>{time}</div>
        }
        return <div>Отсутствует</div>
      }
    },
    {
      title: 'Истекает',
      dataIndex: 'expireTime',
      key: 'expireTime',
      render: (value, record) => {
        const formatTime = dayjs(record.createdAt)
          .add(record.expireTime)
          .format(dateFormats.fullFormat)

        return value > 0 ? <span>{formatTime}</span> : <span> Никогда </span>
      }
    },
    {
      title: 'Скопировать',
      dataIndex: 'token',
      key: 'copyToken',
      align: 'center',
      render: (record) => {
        return (
          <Button className="copy-btn" data-clipboard-text={record}>
            <CopyOutlined />
          </Button>
        )
      }
    },
    {
      title: 'Отозвать',
      dataIndex: 'appId',
      key: 'recall',
      align: 'center',
      render: (_, record) => {
        return (
          <Popconfirm
            title="Закончить эту сессию?"
            onConfirm={() => handleRevokeToken(record)}
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        )
      }
    }
  ]

  const tokensOptions = [
    {
      value: -1,
      label: 'Бессрочно'
    },
    {
      value: 3600000,
      label: 'Один час'
    },
    {
      value: 86400000,
      label: 'Один день'
    },
    {
      value: 2592000000,
      label: '30 дней'
    },
    {
      value: 31536000000,
      label: 'Один год'
    }
  ]
  if (!id) {
    return <EmptyData />
  }

  if (isLoading) {
    return <Spin className="spin" />
  }

  const handleShowAddModalToken = () => {
    setShowApplicationsModal(true)
  }

  return (
    <section className="token-content">
      <div className="token-content__wrap">
        <header className="token-content__header">
          <CanEdit>
            <Button
              className="applications-content__add-btn"
              type="primary"
              onClick={handleShowAddModalToken}
            >
              Добавить токен
            </Button>
          </CanEdit>
        </header>
        <div className="token-content__table">
          <Table
            className="appliactions-tokent__table"
            rowKey={(record) => record.createdAt}
            pagination={false}
            columns={columns}
            dataSource={data}
          />
        </div>
        <Modal
          onOk={handleSubmitTokens(handleCreateToken)}
          title="Добавить"
          open={showApplicationsModal}
          footer={{ onCanselText: 'Отмена', onOkText: 'Сохранить' }}
          onClose={() => setShowApplicationsModal(false)}
        >
          <form>
            <FormSelect
              options={tokensOptions}
              name="expireTime"
              control={controlTokens}
              label="Время действия"
              rules={{ required: ValidationRules.required }}
            />
          </form>
        </Modal>
      </div>
    </section>
  )
}

export default TokenContent
