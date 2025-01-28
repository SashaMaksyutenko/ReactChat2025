//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'dropzone/dist/dropzone.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import {store} from '/src/redux/store'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer position='top-right' autoClose={5000} stacked/>
    </BrowserRouter>
  </ReduxProvider>
)
