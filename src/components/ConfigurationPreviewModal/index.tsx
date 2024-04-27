import { ReactJsonView } from 'isp-ui-kit'
import { FC } from 'react'

import Modal from '@widgets/Modal'

import { ConfigurationPreviewModalPropsType } from '@components/ConfigurationPreviewModal/configuration-preview-modal.type.ts'

import './configuration-preview-modal.scss'


const ConfigurationPreviewModal: FC<ConfigurationPreviewModalPropsType> = ({
  versionCompare = false,
  config,
  open,
  onClose
}) => {
  const data = JSON.parse(JSON.stringify(config.data || {}))
  const configName = versionCompare
    ? `Версия: ${config.configVersion}`
    : config.name
  return (
    <div className="configuration-preview-modal">
      <Modal title={configName || ''} open={open} onClose={onClose}>
        <ReactJsonView
          src={data}
          name={false}
          sortKeys={true}
          displayDataTypes={false}
          editKeys={false}
        />
      </Modal>
    </div>
  )
}

export default ConfigurationPreviewModal
