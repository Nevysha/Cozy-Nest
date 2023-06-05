import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";

const containerId = 'cozy_nest_prompt';
const parentId = 'txt2img_prompt';
export default function startCozyPrompt() {
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
      <App />
    </React.StrictMode>,
  )
}