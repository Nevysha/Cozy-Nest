import React from 'react'
import ReactDOM from 'react-dom/client'

import {ExtraNetworks} from "./ExtraNetworks.jsx";

export function startExtraNetwork() {

    if (!document.getElementById('cozy-extra-network-react')) {
      setTimeout(() => startExtraNetwork(), 200)
      return
    }

    ReactDOM.createRoot(document.getElementById('cozy-extra-network-react')).render(
      <React.StrictMode>
          <ExtraNetworks />
      </React.StrictMode>,
    )
}