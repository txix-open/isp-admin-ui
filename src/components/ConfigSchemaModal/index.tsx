import { JsonSchemaViewer } from '@stoplight/json-schema-viewer'
import { FC } from 'react'

import Modal from '@widgets/Modal'

import { ConfigSchemaModalPropsType } from '@components/ConfigSchemaModal/config-schema-moda.type.ts'

import './config-schema-modal.scss'

const ConfigSchemaModal: FC<ConfigSchemaModalPropsType> = ({
  open,
  onClose,
  schema
}) => {
  return (
    <div className="config-schema-modal">
      <Modal title="Текущая схема конфигурации" open={open} onClose={onClose}>
        <JsonSchemaViewer
          viewMode="view"
          className="json-schema-view"
          schema={schema}
          emptyText="No schema defined"
          defaultExpandedDepth={99}
        />
      </Modal>
    </div>
  )
}

export default ConfigSchemaModal
