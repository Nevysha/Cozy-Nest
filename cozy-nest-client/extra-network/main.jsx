import React from 'react'
import ReactDOM from 'react-dom/client'

import {ExtraNetworks} from "./ExtraNetworks.jsx";

export function startExtraNetwork() {

    if (!document.getElementById('right_button_wrapper')) {
      setTimeout(() => startExtraNetwork(), 200)
      CozyLogger.debug('right_button_wrapper not found')
      return
    }

    const _container = document.createElement("div");
    _container.id = 'cozy-extra-network-react';
    _container.style = 'display: flex; height: 50%;'
    document.getElementById('right_button_wrapper')
      .insertBefore(_container, document.getElementById('right_button_wrapper').firstChild);

    ReactDOM.createRoot(document.getElementById('cozy-extra-network-react')).render(
      <React.StrictMode>
        <ExtraNetworks />
      </React.StrictMode>,
    )
}