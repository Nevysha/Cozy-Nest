import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";
import {ChakraProvider} from '@chakra-ui/react'
import {theme} from "../chakra/chakra-theme.ts";

export default async function startCozyPrompt(parentId, containerId, tabId) {
  return new Promise((resolve, reject) => {
    try {
        _startCozyPrompt(parentId, containerId, tabId, resolve);
    } catch (e) {
        reject(e);
    }
  });
}

function _startCozyPrompt(parentId, containerId, tabId, resolve) {
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
        <App containerId={containerId} parentId={parentId} tabId={tabId} resolve={resolve}/>
      </ChakraProvider >
    </React.StrictMode>,
  )
}