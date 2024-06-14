import { FC } from 'react'
import {ConfigurationEditorPropsType} from '@pages/ConfigurationEditorPage'
import { ReactJsonView } from 'isp-ui-kit'
import {Spin} from 'antd'
import { cleanEmptyParamsObject } from '@utils/objectUtils.ts'

const ConfigurationEditorJson: FC<ConfigurationEditorPropsType> = ({ bufConfig = {}, setBufConfig, isCurrentConfigLoading, JsonSchema}) => {
  if (isCurrentConfigLoading) {
    return <Spin className="spin" />
  }

  return (
    <ReactJsonView
      displayDataTypes={false}
      displayObjectSize={false}
      name={null}
      enableClipboard={true}
      iconStyle="square"
      onEdit={({updated_src}: any) => {
            const newData = {
              ...bufConfig,
              data: { ...updated_src }
            }
            setBufConfig(cleanEmptyParamsObject(newData))
          }
      }
      src={bufConfig.data}
      sortKeys={true}
      collapsed={1}
    />
  )
}

export default ConfigurationEditorJson