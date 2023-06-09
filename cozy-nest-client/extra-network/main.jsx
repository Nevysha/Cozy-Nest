import React from 'react'
import ReactDOM from 'react-dom/client'

import {ExtraNetworks} from "./ExtraNetworks.jsx";
import {theme} from "../chakra/chakra-theme.ts";
import {ChakraProvider} from "@chakra-ui/react";

export function startExtraNetwork() {

    if (!document.getElementById('cozy-extra-network-react')) {
      setTimeout(() => startExtraNetwork(), 200)
      return
    }

    ReactDOM.createRoot(document.getElementById('cozy-extra-network-react')).render(
      <React.StrictMode>
        <ChakraProvider theme={theme} >
          <ExtraNetworks />
        </ChakraProvider>
      </React.StrictMode>,
    )
}