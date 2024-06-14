import { Button } from 'antd'
import Modal from '@widgets/Modal'
import { ModalPropsType } from '@widgets/Modal/modal.type.ts'
import { Dispatch, FC, SetStateAction } from 'react'
import { ConfigType } from '@pages/ModulesPage/module.type.ts'
import { useParams } from 'react-router-dom'
import configServiceApi from '@services/configService.ts'


interface ConfirmModalProps
  extends Omit<ModalPropsType, 'title' | 'children'> {
  handleSaveClick: (upVersion?: number, unsafe?: boolean) => void
  setBufConfig: Dispatch<SetStateAction<ConfigType | undefined>>
  currentConfig: ConfigType | undefined
}

const ConfirmConfigModal: FC<ConfirmModalProps> = ({
                                                     currentConfig,
                                                     setBufConfig,
                                                     handleSaveClick,
                                                     onClose = () => null,
                                                     open
                                                   }) => {
  const { id = '' } = useParams()
  const isNew = id === 'new' ? '' : id

  const {
    data
  } = configServiceApi.useGetConfigByIdQuery(isNew)


  const onConfirmHandler = () => {
    setBufConfig(currentConfig)
    onClose()
  }

  return (
    <Modal title="Версия конфигурации была кем-то изменена" open={open}
           onClose={onClose}>
      <Button className="confirm-btn danger" type="primary" danger onClick={() => {
        handleSaveClick(data && data.version)
        onClose()
      }}>Сохранить принудительно</Button>
      <Button className="confirm-btn" type="primary" onClick={onConfirmHandler}>Принять изменения</Button>
    </Modal>
  )
}
export default ConfirmConfigModal