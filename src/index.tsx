import { setupListeners } from '@reduxjs/toolkit/query'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './components/App.tsx'

import './index.css'
import { setupStore } from './stores'

const store = setupStore()
setupListeners(store.dispatch)
const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
