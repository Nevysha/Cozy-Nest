import React from 'react'
import ReactDOM from 'react-dom/client'

import {ExtraNetworks} from "./ExtraNetworks.jsx";
import {LoaderProvider} from "./LoaderContext.jsx";
import {CozyLogger} from "../main/CozyLogger.js";

export function startExtraNetwork(prefix) {

  CozyLogger.debug('startExtraNetwork', prefix)

  if (!document.getElementById(`cozy-${prefix}-extra-network-react`)) {
    CozyLogger.debug('waiting for extra network react', prefix)
    setTimeout(() => startExtraNetwork(), 200)
    return
  }

  ReactDOM.createRoot(document.getElementById(`cozy-${prefix}-extra-network-react`)).render(
    <React.StrictMode>
      <LoaderProvider prefix={prefix}>
        <ExtraNetworks prefix={prefix} />
      </LoaderProvider>
    </React.StrictMode>,
  )
}