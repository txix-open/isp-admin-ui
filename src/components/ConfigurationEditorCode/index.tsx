import { FC, useContext } from 'react'
import { ConfigurationEditorPropsType } from '@pages/ConfigurationEditorPage'
import Editor, { loader } from '@monaco-editor/react'
import { ConfigType } from '@pages/ModulesPage/module.type.ts'
import { Context } from '@stores/index.tsx'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

const ConfigurationEditorCode: FC<ConfigurationEditorPropsType> = ({setDisableBtn= () => {},  bufConfig, setBufConfig }) => {
  const { changeTheme } = useContext(Context)

  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };

  loader.config({ monaco });

  loader.init().then();

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
        theme={changeTheme ? 'vs-dark' : 'vs-white'}
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