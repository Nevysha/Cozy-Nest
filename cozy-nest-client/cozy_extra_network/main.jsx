import React from "react";
import ReactDOM from "react-dom/client";
import {CozyLogger} from "../main/CozyLogger.js";
import {CozyExtraNetworks} from "./CozyExtraNetworks.jsx";
import {ChakraProvider} from '@chakra-ui/react'
import {theme} from "../chakra/chakra-theme.ts";
import {hideNativeUiExtraNetworkElement} from "../main/cozy-utils.js";

export function startCozyExtraNetwork() {
    return new Promise((resolve, reject) => {
        _startExtraNetwork(resolve)
    })
}

function _startExtraNetwork(resolve) {

    CozyLogger.debug('startExtraNetwork')

    if (!document.getElementById(`cozy-extra-network-react`)) {
        CozyLogger.debug('waiting for extra network react')
        setTimeout(() => _startExtraNetwork(), 200)
        return
    }
    resolve()

    hideNativeUiExtraNetworkElement('txt2img')
    hideNativeUiExtraNetworkElement('img2img')

    ReactDOM.createRoot(document.getElementById(`cozy-extra-network-react`)).render(
        <React.StrictMode>
            <ChakraProvider theme={theme} >
                <CozyExtraNetworks />
            </ChakraProvider>
        </React.StrictMode>,
    )
}