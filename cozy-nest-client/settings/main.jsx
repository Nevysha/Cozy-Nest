import React from "react";
import ReactDOM from 'react-dom/client'
import {App} from "./App.jsx";

const containerId = 'cozy_nest_options'
export default function startCozyNestSettings() {
  if (!document.getElementById('nevysha-btn-menu-wrapper')) {
    setTimeout(() => startCozyNestSettings(), 200)
    return
  }

  //add a div to hold settings
  const settingsDiv = document.createElement("div");
  settingsDiv.id = containerId;
  settingsDiv.style = 'display: flex;'
  document.querySelector('#nevysha-btn-menu-wrapper').appendChild(settingsDiv);

  ReactDOM.createRoot(document.getElementById(containerId)).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}