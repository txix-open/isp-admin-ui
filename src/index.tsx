import { loader } from '@monaco-editor/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { AdminBase, baseSetupStore } from 'isp-admin-ui-kit'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import 'react-resizable/css/styles.css'
import 'simplebar-react/dist/simplebar.min.css'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

loader.config({ monaco })

loader.init().then()

dayjs.locale('ru')
const store = baseSetupStore()
setupListeners(store.dispatch)
const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <AdminBase />
  </Provider>
)
