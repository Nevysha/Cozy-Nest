import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";

export default function startCozyPrompt(parentId, containerId) {
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
      <App containerId={containerId} parentId={parentId}/>
    </React.StrictMode>,
  )
}