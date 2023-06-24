import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";
import {ChakraProvider} from '@chakra-ui/react'
import {theme} from "../chakra/chakra-theme.ts";

export default function startCozyPrompt(parentId, containerId, tabId) {
  //
  if (!document.getElementById(parentId)) {
    setTimeout(() => startCozyPrompt(), 200)
    return
  }

  const settingsDiv = document.createElement("div");
  settingsDiv.id = containerId;
  settingsDiv.style = 'display: flex; height: fit-content; width: 100%;'

  document.getElementById(parentId)
    .insertBefore(settingsDiv, document.getElementById(parentId).firstChild);

  ReactDOM.createRoot(document.getElementById(containerId)).render(
    <React.StrictMode>
      <ChakraProvider theme={theme} >
        <App containerId={containerId} parentId={parentId} tabId={tabId}/>
      </ChakraProvider >
    </React.StrictMode>,
  )
}