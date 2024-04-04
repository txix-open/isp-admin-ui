import { setupListeners } from '@reduxjs/toolkit/query'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './components/App.tsx'
import './index.css'
import { setupStore } from './store'

const store = setupStore()
setupListeners(store.dispatch)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
