import { FC, useContext } from 'react'
import {ConfigurationEditorPropsType} from '@pages/ConfigurationEditorPage'
import { ReactJsonView } from 'isp-ui-kit'
import {Spin} from 'antd'
import { cleanEmptyParamsObject } from '@utils/objectUtils.ts'
import { Context } from '@stores/index.tsx'

const ConfigurationEditorJson: FC<ConfigurationEditorPropsType> = ({ bufConfig = {}, setBufConfig, isCurrentConfigLoading}) => {
  const { changeTheme } = useContext(Context)
  if (isCurrentConfigLoading) {
    return <Spin className="spin" />
  }

  const handleEdit = (updated_src: any) => {
    const newData = {
      ...bufConfig,
      data: { ...updated_src }
    }
    setBufConfig(cleanEmptyParamsObject(newData))
  }

  return (
    <ReactJsonView
      theme={ changeTheme ? 'twilight' : ''}
      onAdd={true}
      onDelete={({updated_src}: any) => handleEdit(updated_src)}
      displayDataTypes={false}
      displayObjectSize={false}
      name={null}
      enableClipboard={true}
      iconStyle="square"
      onEdit={({updated_src}: any) => handleEdit(updated_src)}
      src={bufConfig.data}
      sortKeys={true}
      collapsed={1}
    />
  )
}

export default ConfigurationEditorJson
