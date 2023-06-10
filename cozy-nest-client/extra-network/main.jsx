import React from 'react'
import ReactDOM from 'react-dom/client'

import {ExtraNetworks} from "./ExtraNetworks.jsx";
import {LoaderProvider} from "./LoaderContext.jsx";

export function startExtraNetwork(prefix) {

    if (!document.getElementById(`cozy-${prefix}-extra-network-react`)) {
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