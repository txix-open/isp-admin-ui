import { FC } from 'react'
import { ConfigurationEditorPropsType } from '@pages/ConfigurationEditorPage'
import Editor from '@monaco-editor/react'
import { ConfigType } from '@pages/ModulesPage/module.type.ts'
import { message } from 'antd'

const ConfigurationEditorCode: FC<ConfigurationEditorPropsType> = ({setDisableBtn= () => {},  bufConfig, setBufConfig }) => {
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: []) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(this, [...args])
      }, wait)
    }
  }

  const debouncedHandleError = debounce(() => {
    message.error('Невалидный JSON объект')
  }, 500)

  const handleChange = (data: string | undefined) => {

    if (data) {
      try {
        const newData = {
          ...bufConfig,
          data: {...JSON.parse(data) }
        } as ConfigType
        setDisableBtn(false)
        setBufConfig(newData)
      } catch (error) {
        debouncedHandleError()
        setDisableBtn(true)
      }
    }
  }

  const editorValue =  JSON.stringify(bufConfig?.data, null, '\t')

  return (
    <div>
      <Editor
        width="auto"
        height="100vh"
        language="json"
        theme="vs-white"
        value={editorValue}
        onChange={handleChange}
        options={{
          minimap: {
            enabled: false
          },
          fontSize: 16,
        }}

      />
    </div>
  )
}

export default ConfigurationEditorCode