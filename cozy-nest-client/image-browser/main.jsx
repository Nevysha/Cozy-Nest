import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ImagesProvider} from "./ImagesContext.tsx";
import {ChakraProvider} from '@chakra-ui/react'
import {theme} from "../chakra/chakra-theme.ts";

export function startCozyNestImageBrowser() {

  if (!document.getElementById('cozy-img-browser-react')) {
    setTimeout(() => startCozyNestImageBrowser(), 200)
    return
  }

  ReactDOM.createRoot(document.getElementById('cozy-img-browser-react')).render(
    <React.StrictMode>
        <ChakraProvider theme={theme} >
          <ImagesProvider>
            <App />
          </ImagesProvider>
        </ChakraProvider >
    </React.StrictMode>,
  )
}

