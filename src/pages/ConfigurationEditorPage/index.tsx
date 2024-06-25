import { RollbackOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, message, Radio, RadioChangeEvent, Spin } from 'antd'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ConfigurationEditorCode from '@components/ConfigurationEditorCode'
import ConfigurationEditorJson from '@components/ConfigurationEditorJson'

import configServiceApi from '@services/configService.ts'
import modulesServiceApi from '@services/modulesService.ts'

import './configuration-editor-page.scss'
import ConfigSchemaModal from '@components/ConfigSchemaModal'
import { cleanEmptyParamsObject, sortObject } from '@utils/objectUtils.ts'
import { ConfigType, ResponseSchemaType } from '@pages/ModulesPage/module.type.ts'
import ConfirmConfigModal from '@components/ConfirmConfigModal/ConfirmConfigModal.tsx'
import ErrorConfigModal from '@components/ErrorConfigModal/ErrorConfigModal.tsx'

export interface ConfigurationEditorPropsType {
  JsonSchema?: ResponseSchemaType
  bufConfig?: ConfigType
  setBufConfig: Dispatch<SetStateAction<ConfigType | undefined>>
  isCurrentConfigLoading: boolean
  setDisableBtn?: Dispatch<SetStateAction<boolean>>
}

const ConfigurationEditorPage: FC = () => {
  const navigate = useNavigate()
  const { moduleId = '' } = useParams()
  const { id = '' } = useParams()
  const isNew = id === 'new'
  const { data: JsonSchema, isLoading: isLoadingJsonSchema } =
    modulesServiceApi.useGetByModuleIdQuery(moduleId)
  const {
    data: currentConfig,
    isLoading: isCurrentConfigLoading,
  } = configServiceApi.useGetConfigByIdQuery(id)
  const [createUpdateConfig] = configServiceApi.useCreateUpdateConfigMutation()
  const { state } = useLocation()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSchemeModal, setShowSchemeModal] = useState(false)
  const [radioValue, setRadioValue] = useState('json')
  const [bufConfig, setBufConfig] = useState<ConfigType>()
  const [detailsErrors, setDetailsError] = useState({ details: {}, isOpenDetailsErrorModal: false })
  const [disableBtn, setDisableBtn] = useState(false)

  useEffect(() => {
      setBufConfig(isNew ? {} : sortObject(currentConfig))
  }, [isCurrentConfigLoading])

  const itemsSaveBtn = [
    {
      key: 'save',
      label: 'Сохранить'
    },
    {
      key: 'unsafe',
      label: 'Сохранить небезопасно'
    }
  ]

  const onSaveBtn: MenuProps['onClick'] = (e, upVersion = undefined) => {
    const isUnsafe = e.key === 'unsafe'
    handleSaveClick(upVersion, isUnsafe)
  }

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value)
  }

  const handleSaveClick = (upVersion?: number, unsafe?: boolean) => {
    let newData = {}
    if (bufConfig) {
      if (isNew) {
        newData = {
          name: state.name,
          moduleId: moduleId,
          id: '',
          version: 0,
          data: bufConfig.data,
          unsafe: unsafe
        } as ConfigType
      }
      if (currentConfig) {
        newData = {
          ...bufConfig,
          version: upVersion ? upVersion : currentConfig.version,
          unsafe: unsafe
        } as ConfigType
      }
    }
    createUpdateConfig(cleanEmptyParamsObject(newData))
      .unwrap()
      .then(({ id }) => {
        isNew && navigate(`/${moduleId}/configEditor/${id}`)
        message.success('Конфигурация успешно сохранена')
      })
      .catch((e) => {
        if (e.data.errorCode === 2004) {
          setShowConfirmModal(true)
        }
        if (e.data.errorCode === 2003) {
          setDetailsError({ details: e.data.details, isOpenDetailsErrorModal: true })
        }
        if (e.data.errorCode === 400) {
          message.error('Невалидный JSON объект')
        }
        message.error('Ошибка обновления элемента')
      })
  }

  if (isLoadingJsonSchema || isCurrentConfigLoading) {
    return <Spin className="spin" />
  }


  const renderContent = () => {

    switch (radioValue) {
      // case 'form':
      //   return (
      //     <ConfigurationEditorForm
      //       bufConfig={bufConfig}
      //       setBufConfig={setBufConfig}
      //       isCurrentConfigLoading={isCurrentConfigLoading}
      //     />
      //   )
      case 'json':
        return (
          <ConfigurationEditorJson
            bufConfig={bufConfig}
            setBufConfig={setBufConfig}
            isCurrentConfigLoading={isCurrentConfigLoading}
          />
        )
      case 'code':
        return (
          <ConfigurationEditorCode
            setDisableBtn={setDisableBtn}
            bufConfig={bufConfig}
            setBufConfig={setBufConfig}
            isCurrentConfigLoading={isCurrentConfigLoading}
          />
        )
    }
  }


  return (
    <main className="configuration-editor-page">
      <section className="configuration-editor-page__header">
        <Button onClick={() => navigate(-1)}>
          <RollbackOutlined />
          Назад
        </Button>
        <h1>{bufConfig?.name}</h1>
        <div className="configuration-editor-page__controll">
          <Button
            disabled={!JsonSchema}
            className="configurations____buttons__show-schema-btn"
            onClick={() => setShowSchemeModal(true)}
          >
            Текущая схема конфигурации
          </Button>
          <Dropdown.Button
            onClick={() => {
              handleSaveClick()
              navigate(`/modules/${moduleId}/configurations`)
            }}
            disabled={disableBtn}
            type="primary"
            className="configuration-editor-page__save-btn"
            menu={{ items: itemsSaveBtn, onClick: onSaveBtn }}
          >
            Сохранить и выйти
          </Dropdown.Button>
        </div>

      </section>
      <div className="configuration-editor-page__content">
        <Radio.Group defaultValue="json" size="large" onChange={onRadioChange}>
          <Radio.Button disabled value="form">Форма</Radio.Button>
          <Radio.Button disabled={disableBtn} value="json">JSON</Radio.Button>
          <Radio.Button value="code">Редактор кода</Radio.Button>
        </Radio.Group>

        {renderContent()}
      </div>


      <ConfigSchemaModal
        schema={JsonSchema?.schema}
        open={showSchemeModal}
        onClose={() => setShowSchemeModal(false)}
      />

      <ConfirmConfigModal
        currentConfig={currentConfig}
        setBufConfig={setBufConfig}
        open={showConfirmModal}
        handleSaveClick={handleSaveClick}
        onClose={() => setShowConfirmModal(false)} />

      <ErrorConfigModal details={detailsErrors.details} open={detailsErrors.isOpenDetailsErrorModal}
                        onClose={() => setDetailsError({details: {}, isOpenDetailsErrorModal: false })} />

    </main>
  )
}

export default ConfigurationEditorPage
