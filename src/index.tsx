import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import {setupListeners} from "@reduxjs/toolkit/query";
import {Provider} from 'react-redux';
import App from './components/App.tsx'
import {setupStore} from "./store";
import './index.css'

const store = setupStore();
setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
)
