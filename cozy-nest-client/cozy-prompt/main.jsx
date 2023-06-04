import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";


const containerId = 'cozy_nest_prompt';
export default function startCozyPrompt() {
  //
  if (!document.getElementById('txt2img_prompt_container')) {
    setTimeout(() => startCozyPrompt(), 200)
    return
  }

  const settingsDiv = document.createElement("div");
  settingsDiv.id = containerId;
  settingsDiv.style = 'display: flex; height: fit-content; width: 100%;'

  document.getElementById('txt2img_prompt_container')
    .insertBefore(settingsDiv, document.getElementById('txt2img_prompt_container').firstChild);

  ReactDOM.createRoot(document.getElementById(containerId)).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}