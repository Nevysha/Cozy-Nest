import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ImagesProvider} from "./ImagesContext.tsx";

export function startCozyNestImageBrowser() {

  if (!document.getElementById('cozy-img-browser-react')) {
    setTimeout(() => startCozyNestImageBrowser(), 200)
    return
  }

  ReactDOM.createRoot(document.getElementById('cozy-img-browser-react')).render(
    <React.StrictMode>
      <ImagesProvider>
        <App />
      </ImagesProvider>
    </React.StrictMode>,
  )
}

